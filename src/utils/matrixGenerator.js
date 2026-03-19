const ROW_COUNT = 20;
const COL_COUNT = 50;

export function matrixGenerator() {
  const grid = [];

  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    const currentRow = [];

    for (let colIndex = 0; colIndex < COL_COUNT; colIndex += 1) {
      currentRow.push({
        row: rowIndex,
        col: colIndex,
        isStart: rowIndex === 10 && colIndex === 5,
        isTarget: rowIndex === 10 && colIndex === 45,
        isWall: false,
        weight: 1,
        isVisited: false,
        distance: Infinity,
        fScore: Infinity,
        previousNode: null,
      });
    }

    grid.push(currentRow);
  }

  return grid;
}

export { ROW_COUNT, COL_COUNT };
