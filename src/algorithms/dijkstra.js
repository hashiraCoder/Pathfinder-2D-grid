class MinHeap {
  constructor(compare) {
    this.heap = [];
    this.compare = compare;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const tail = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = tail;
      this.bubbleDown(0);
    }

    return min;
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.heap[current], this.heap[parent]) >= 0) break;

      [this.heap[current], this.heap[parent]] = [
        this.heap[parent],
        this.heap[current],
      ];
      current = parent;
    }
  }

  bubbleDown(index) {
    let current = index;

    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let smallest = current;

      if (
        left < this.heap.length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === current) break;

      [this.heap[current], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[current],
      ];
      current = smallest;
    }
  }
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

export function dijkstra(grid, startNode, targetNode) {
  const visitedNodesInOrder = [];
  const minHeap = new MinHeap((a, b) => a.priority - b.priority);

  for (const row of grid) {
    for (const node of row) {
      node.isVisited = false;
      node.distance = Infinity;
      node.previousNode = null;
    }
  }

  startNode.distance = 0;
  minHeap.push({ node: startNode, priority: startNode.distance });

  while (!minHeap.isEmpty()) {
    const entry = minHeap.pop();
    if (!entry) break;

    const { node: closestNode, priority } = entry;

    // Ignore stale heap entries created before a better distance was found.
    if (priority !== closestNode.distance) continue;

    if (!closestNode || closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;
    if (closestNode.isVisited) continue;

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
        minHeap.push({ node: neighbor, priority: neighbor.distance });
      }
    }
  }

  const shortestPath = getShortestPath(targetNode, startNode);
  return { visitedNodesInOrder, shortestPath };
}
