import { io } from "./socket";
import { Room } from "./roomData";
import { User } from "./roomData/user";
import { genFloor } from "./game/genFloor";
import { Socket } from "dgram";

export const room = new Room();

let currentInterval = 0;
let timeout = null;

const intervals = [6 * 1000, 5 * 1000, 4 * 1000, 3 * 1000];

io.on("connection", (socket) => {
  const user = new User({
    name: "",
    socketId: socket.id,
    avatar: "",
    positionX: 0,
    positionY: 0,
  });

  socket.on("disconnect", () => {
    room.leave(user);
    io.to("main_room").emit("user:left", room.getRoomWithUsersInGame());
  });

  socket.on("join", (userInfo: User) => {
    socket.join("main_room");
    user.setInfo(userInfo);
    room.join(user);

    if (room.users.length === 2) {
      clearTimeout(timeout);
      room.restartGame();
      runGame();
    }

    io.to("main_room").emit("user:join", {
      room: room.getRoomWithUsersInGame(),
      currentFloor: room.floor,
    });
  });

  socket.on("move", ({ direction }) => {
    room.move(user, direction);

    io.to("main_room").emit("room:update", room.getRoomWithUsersInGame());
  });

  socket.on("user:rename", (newName) => {
    room.userRename(newName, user)
    io.to("main_room").emit("room:update", room.getRoomWithUsersInGame());
  });

  socket.on("user:avatar", (newAvatar) => {
    room.userChangeAvatar(newAvatar, user)
    io.to("main_room").emit("room:update", room.getRoomWithUsersInGame());
  })
});

const runGame = () => {
  if (room.users.length === 1) return;

  room.newFloor();
  room.verifyAllUsersPosition();

  const roomPlayersInGame = room.getRoomWithUsersInGame();

  if (roomPlayersInGame.users.length <= 1) {
    room.rewardWinner(roomPlayersInGame.users[0]);
    room.restartGame();
    io.to("main_room").emit("room:rank", room.getUsersRank());
  }

  io.to("main_room").emit("floor:update", room.floor);
  io.to("main_room").emit("room:update", room.getRoomWithUsersInGame());

  currentInterval++;

  timeout = setTimeout(
    () => {
      room.newFloor(true);
      room.verifyAllUsersPosition();
      io.to("main_room").emit("floor:update", room.floor);
      io.to("main_room").emit("room:update", room.getRoomWithUsersInGame());

      timeout = setTimeout(runGame, 3 * 1000);
    },
    intervals[currentInterval] ? intervals[currentInterval] : 2 * 1000
  );
};
