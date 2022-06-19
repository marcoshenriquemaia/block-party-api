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

  const color = getExistRandomColor(scenery.map((block) => block.color));

  return { color, scenery };
};

const getExistRandomColor = (randomColorList: any[]) => {
  const randomColorIndex = Math.floor(Math.random() * colors.length);

  if (!randomColorList.find((color) => color === colors[randomColorIndex])) {
    return getExistRandomColor(randomColorList);
  } else {
    return colors[randomColorIndex];
  }
}

const colors = [
  "#9c9d97",
  "#474f52",
  "#1d1c21",
  "#ffd83d",
  "#f9801d",
  "#b02e26",
  "#825432",
  "#80c71f",
  "#5d7c15",
  "#3ab3da",
  "#169c9d",
  "#3c44a9",
  "#f38caa",
  "#c64fbd",
  "#8932b7"
]
