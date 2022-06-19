import { ROOM } from "../mocks/room";
import { room } from "../server";

export interface IUser {
  score?: number;
  socketId: string;
  name: string;
  avatar: string;
  positionX: number;
  positionY: number;
}

const speed = 5;

export class User {
  name: string;
  socketId: string;
  avatar: string;
  positionY: number;
  positionX: number;
  score?: number;
  inGame: boolean;

  constructor(user: IUser) {
    this.name = user.name;
    this.socketId = user.socketId;
    this.avatar = user.avatar;
    this.positionY = user.positionY;
    this.positionX = user.positionX;
    this.score = user.score ?? 0;
    this.inGame = false;

    this.move = this.move.bind(this);
    this.setInfo = this.setInfo.bind(this);
    this.lose = this.lose.bind(this);
  }

  move(direction: string) {
    switch (direction) {
      case "up":
        this.positionY -= speed;
        break;
      case "down":
        this.positionY += speed;
        break;
      case "left":
        this.positionX -= speed;
        break;
      case "right":
        this.positionX += speed;
        break;
    }
  }

  setInfo(info: IUser) {
    this.name = info.name;
    this.avatar = info.avatar;
    this.positionY = info.positionY;
    this.positionX = info.positionX;
    this.score = 0;
  }

  lose() {
    this.inGame = false;
  }

  returnToGame() {
    this.inGame = true;
    this.positionX = ROOM.FLOOR_SIZE / 2;
    this.positionY = ROOM.FLOOR_SIZE / 2;
  }

  verifyPosition(user: User) {
    const playerColorPosition = room.floor.scenery.find((block) => {
      if (
        Math.floor((this.positionX + 25) / 100) * 100 === block.position.x &&
        Math.floor((this.positionY + 25) / 100) * 100 === block.position.y
      ) {
        return block;
      }
    });

    if (playerColorPosition?.color === "#ffffff" || !playerColorPosition) {
      user.lose();
    }

  }

  win(){
    this.score++;
  }

  rename(name: string) {
    this.name = name;
  }

  changeAvatar(avatar: string) {
    this.avatar = avatar;
  }
}
