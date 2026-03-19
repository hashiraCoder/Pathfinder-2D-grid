function manhattanDistance(currentNode, targetNode) {
  return (
    Math.abs(currentNode.row - targetNode.row) +
    Math.abs(currentNode.col - targetNode.col)
  );
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function getShortestPath(targetNode, startNode) {
  const shortestPath = [];
  let currentNode = targetNode;

  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  if (shortestPath.length === 0) return shortestPath;
  if (shortestPath[0] !== startNode) return [];

  return shortestPath;
}

export function aStar(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const openSet = [];

  for (const row of grid) {
    for (const node of row) {
      node.isVisited = false;
      node.distance = Infinity;
      node.fScore = Infinity;
      node.previousNode = null;
    }
  }

  startNode.distance = 0;
  startNode.fScore = manhattanDistance(startNode, targetNode);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      if (a.fScore === b.fScore) return a.distance - b.distance;
      return a.fScore - b.fScore;
    });

    const currentNode = openSet.shift();
    if (!currentNode || currentNode.isWall || currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === targetNode) break;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall || neighbor.isVisited) continue;

      const tentativeDistance = currentNode.distance + neighbor.weight;
      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeDistance;
        neighbor.fScore = tentativeDistance + manhattanDistance(neighbor, targetNode);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  const shortestPath = getShortestPath(targetNode, startNode);
  return { visitedNodesInOrder, shortestPath };
}
