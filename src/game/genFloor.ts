import { ROOM } from "../mocks/room";

export const genFloor = (floorToRemove?: any) => {
  //gen block party floor

  const size = 100

  if (floorToRemove) {
    return {
      ...floorToRemove,
      scenery: floorToRemove.scenery.map((row, i) => {
        return {
          ...row,
            color: floorToRemove.color !== row.color
              ? '#ffffff'
              : row.color,
        };
      })
    }
  }

  const randomColorIndex = Math.floor(Math.random() * colors.length);
  const scenery = [];

  for (let i = 0; i < ROOM.FLOOR_SIZE; i += size) {
    for (let j = 0; j < ROOM.FLOOR_SIZE; j += size) {
      scenery.push({
        position: { x: i, y: j },
        width: size,
        height: size,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  return { color: colors[randomColorIndex], scenery };
};

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
];
