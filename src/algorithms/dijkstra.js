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

export function dijkstra(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = [];

  for (const row of grid) {
    for (const node of row) {
      node.isVisited = false;
      node.distance = Infinity;
      node.previousNode = null;
      unvisitedNodes.push(node);
    }
  }

  startNode.distance = 0;

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();

    if (!closestNode || closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === targetNode) break;

    const neighbors = getNeighbors(closestNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isVisited || neighbor.isWall) continue;

      const tentativeDistance = closestNode.distance + neighbor.weight;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = closestNode;
      }
    }
  }

  const shortestPath = getShortestPath(targetNode, startNode);
  return { visitedNodesInOrder, shortestPath };
}
