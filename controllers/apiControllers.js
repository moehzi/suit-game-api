const { User, Biodata, Room, Round, UserRoom } = require("../models/");
const { success, fail } = require("../middlewares/resBuilder");

exports.getUser = async (req, res) => {
  const usersWithData = await User.findAll({
    attributes: {
      exclude: ["encryptedPassword"],
    },
    include: [
      {
        model: Biodata,
        as: "biodata",
      },
    ],
  });

  res.status(201).json(success(usersWithData));
};

exports.showProfile = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "Fail",
      message: "Not found",
    });
  }

  res.status(200).json({
    status: "OK",
    data: {
      username: user.username,
      role: user.role,
      name: user.biodata.name,
      email: user.biodata.email,
      address: user.biodata.address,
    },
  });
};

exports.createRoom = async function (req, res) {
  const room = await Room.create({
    roomName: req.body.roomName,
    roomMaster: req.user.id,
    isActive: true,
  });

  await UserRoom.create({
    userId: req.user.id,
    roomId: room.id,
  });

  const roundOne = await Round.create({
    name: "ROUND ONE",
    firstPlayerId: req.user.id,
    roomId: room.id,
    isActive: true,
  });

  const roundTwo = await Round.create({
    name: "ROUND TWO",
    firstPlayerId: req.user.id,
    roomId: room.id,
    isActive: false,
  });

  const roundThree = await Round.create({
    name: "ROUND THREE",
    firstPlayerId: req.user.id,
    roomId: room.id,
    isActive: false,
  });

  res.status(200).json({
    statuts: "OK",
    data: {
      id: room.id,
      roomName: room.roomName,
      roomMaster: room.roomMaster,
      roundOne,
      roundTwo,
      roundThree,
    },
  });
};

exports.join = async (req, res) => {
  const rooms = await Round.findAll({
    where: {
      roomId: req.params.id,
    },
  });

  await UserRoom.create({
    userId: req.user.id,
    roomId: req.params.id,
  });

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i].dataValues;
    const round = await Round.findOne({ where: { id: room.id } });
    await round.update({
      secondPlayerId: req.user.id,
    });
  }

  return res.status(201).json({
    status: "OK",
    message: `You are sucesfully join the room`,
  });
};

let firstPlayerPoint = 0;
let secondPlayerPoint = 0;

exports.fight = async function (req, res) {
  try {
    const { pick, isActive = true } = req.body;

    const rooms = await Round.findAll({
      where: {
        roomId: req.params.id,
      },
    });

    const findRoom = await Round.findOne({
      where: {
        roomId: req.params.id,
      },
    });

    if (!findRoom) {
      return res.status(404).json({
        status: "FAIL",
        message: "room not found",
      });
    }

    const roomId = await Room.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!roomId.isActive) {
      firstPlayerPoint = 0;
      secondPlayerPoint = 0;
      return res.status(404).json({
        status: "FAIL",
        message: "This room has been finished",
      });
    }

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i].dataValues;

      const round = await Round.findOne({ where: { id: room.id } });

      if (round.isActive) {
        if (req.user.id == room.firstPlayerId) {
          await round.update({
            firstPlayerSelect: pick,
          });
        } else {
          await round.update({
            secondPlayerSelect: pick,
          });
        }

        if (round.firstPlayerSelect && round.secondPlayerSelect) {
          const result = checkWinner(
            round.firstPlayerSelect,
            round.secondPlayerSelect,
            round.firstPlayerId,
            round.secondPlayerId
          );

          await round.update({
            isActive: false,
            result: result,
          });

          if (result === round.firstPlayerId) {
            firstPlayerPoint++;
          }

          if (result === round.secondPlayerId) {
            secondPlayerPoint++;
          }

          if (firstPlayerPoint > secondPlayerPoint) {
            await roomId.update({
              winner: round.firstPlayerId,
            });
          } else if (firstPlayerPoint < secondPlayerPoint) {
            await roomId.update({
              winner: round.secondPlayerId,
            });
          } else {
            await roomId.update({
              // 0 means draw
              winner: 0,
            });
          }
          //   Finish game now
          //   Just input isActive:false to end game if you want in the second pick
          await roomId.update({
            isActive: isActive,
          });

          const nextRound = await Round.findOne({
            where: { id: round.id + 1 },
          });

          if (!nextRound) {
            await roomId.update({
              isActive: false,
            });
            return res.status(200).json({
              round,
              message: "GAME FINISHED",
            });
          }

          await nextRound.update({ isActive: true });
          return res.status(200).json({
            round,
          });
        }
        return res.status(200).json({
          round,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: error.message,
      stack: error.stack,
    });
  }
};

exports.gameHistory = async function (req, res) {
  const game = await UserRoom.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Room,
        attributes: ["winner"],
        include: [
          {
            model: Round,
          },
        ],
      },
    ],
  });

  if (!game)
    res.status(404).json({
      status: "FAIL",
      message: "Not found",
    });

  res.status(200).json({
    status: "OK",
    data: {
      game,
    },
  });
};

function checkWinner(
  firstPlayerSelect,
  secondPlayerSelect,
  firstPlayerId,
  secondPlayerId
) {
  if (firstPlayerSelect === "rock" && secondPlayerSelect === "paper") {
    return secondPlayerId;
  } else if (
    firstPlayerSelect === "rock" &&
    secondPlayerSelect === "scissors"
  ) {
    return firstPlayerId;
  } else if (firstPlayerSelect === "paper" && secondPlayerSelect === "rock") {
    return firstPlayerId;
  } else if (
    firstPlayerSelect === "paper" &&
    secondPlayerSelect === "scissors"
  ) {
    return secondPlayerId;
  } else if (
    firstPlayerSelect === "scissors" &&
    secondPlayerSelect === "rock"
  ) {
    return secondPlayerId;
  } else if (
    firstPlayerSelect === "scissors" &&
    secondPlayerSelect === "paper"
  ) {
    return firstPlayerId;
  } else if (firstPlayerSelect === secondPlayerSelect) {
    return "draw";
  }
}
