import { genFloor } from "../game/genFloor";
import { User } from "./user";

export class Room{
  users: User[];
  floor: any;
  scenery: any;
  constructor(){
    this.users = []
    this.floor = genFloor()
  }

  join(user: User){
    const newUser = new User(user)

    this.users.push(newUser)
  }

  leave(user: User){
    const index = this.users.findIndex(u => u.socketId === user.socketId)

    if(index !== -1){
      this.users.splice(index, 1)
    }
  }

  move(userSocketId: string, direction: string){
    const index = this.getUsersInGame().findIndex(u => u.socketId === userSocketId)

    if(index !== -1){
      this.users[index].move(direction)
    }
  }

  newFloor(clearFloor?: boolean) {
    if(clearFloor){
      this.floor = genFloor(this.floor)
    } else {
      this.floor = genFloor()
    }
  }

  verifyAllUsersPosition(){
    this.users.forEach(user => {
      user.verifyPosition()
    })
  }

  getUsersInGame(){
    return this.users.filter(user => user.inGame)
  }

  getRoomWithUsersInGame(){
    this.verifyAllUsersPosition();
    const room = {
      users: this.getUsersInGame(),
      floor: this.floor,
      scenery: this.scenery
    }

    return room
  }

  restartGame(){
    this.users.forEach(user => {
      user.returnToGame()
    })

    this.floor = genFloor()
  }

  userRename(newName: string, user: User){
    const index = this.users.findIndex(u => u.socketId === user.socketId)

    if(index !== -1){
      this.users[index].name = newName
    }
  }

  userChangeAvatar(newAvatar: string, user: User){
    const index = this.users.findIndex(u => u.socketId === user.socketId)

    if(index !== -1){
      this.users[index].avatar = newAvatar
    }
  }

  rewardWinner(winner: User){
    if (!winner) return
    const index = this.users.findIndex(u => u.socketId === winner.socketId)

    if(index !== -1){
      this.users[index].win()
    }
  }

  getUsersRank(){
    return this.users.sort((a, b) => b.score - a.score)
  }
}