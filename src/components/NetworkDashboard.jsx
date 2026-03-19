import { useMemo, useState } from 'react';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';
import GridNode from './GridNode';
import ControlPanel from './ControlPanel';
import { matrixGenerator } from '../utils/matrixGenerator';

const SEARCH_ANIMATION_DELAY = 10;
const PATH_ANIMATION_DELAY = 30;

function cloneGridForRun(grid) {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      isVisited: false,
      distance: Infinity,
      fScore: Infinity,
      previousNode: null,
    }))
  );
}

function toggleWall(grid, row, col) {
  const clickedNode = grid[row][col];
  if (clickedNode.isStart || clickedNode.isTarget) return grid;

  const updatedGrid = grid.slice();
  updatedGrid[row] = grid[row].slice();
  updatedGrid[row][col] = {
    ...clickedNode,
    isWall: !clickedNode.isWall,
  };

  return updatedGrid;
}

function getBaseClass(node) {
  if (node.isStart) return 'node node-start';
  if (node.isTarget) return 'node node-target';
  if (node.isWall) return 'node node-wall';
  return 'node';
}

function resetNodeClasses(grid) {
  for (const row of grid) {
    for (const node of row) {
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (!element) continue;
      element.className = getBaseClass(node);
    }
  }
}

function NetworkDashboard() {
  const initialGrid = useMemo(() => matrixGenerator(), []);
  const [grid, setGrid] = useState(initialGrid);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [runStats, setRunStats] = useState({
    algorithm: 'None',
    visitedCount: 0,
    shortestPathCount: 0,
    pathFound: false,
    totalCost: 'N/A',
  });

  const runAndAnimate = (algorithm, algorithmLabel) => {
    if (isAnimating) return;

    const workingGrid = cloneGridForRun(grid);
    resetNodeClasses(workingGrid);

    const startNode = workingGrid[10][5];
    const targetNode = workingGrid[10][45];
    const { visitedNodesInOrder, shortestPath } = algorithm(
      workingGrid,
      startNode,
      targetNode
    );

    const pathFound = shortestPath.length > 0;
    const totalCost = Number.isFinite(targetNode.distance)
      ? targetNode.distance
      : 'N/A';

    setRunStats({
      algorithm: algorithmLabel,
      visitedCount: visitedNodesInOrder.length,
      shortestPathCount: shortestPath.length,
      pathFound,
      totalCost,
    });

    setIsAnimating(true);

    for (let i = 0; i <= visitedNodesInOrder.length; i += 1) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, SEARCH_ANIMATION_DELAY * i);
        break;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.isStart || node.isTarget) return;

        const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
        if (nodeElement) {
          nodeElement.className = 'node node-visited';
        }
      }, SEARCH_ANIMATION_DELAY * i);
    }
  };

  const animateShortestPath = (shortestPath) => {
    if (!shortestPath || shortestPath.length === 0) {
      setIsAnimating(false);
      return;
    }

    for (let i = 0; i < shortestPath.length; i += 1) {
      setTimeout(() => {
        const node = shortestPath[i];
        if (!node.isStart && !node.isTarget) {
          const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
          if (nodeElement) {
            nodeElement.className = 'node node-path';
          }
        }

        if (i === shortestPath.length - 1) {
          setIsAnimating(false);
        }
      }, PATH_ANIMATION_DELAY * i);
    }
  };

  const handleMouseDown = (row, col) => {
    if (isAnimating) return;
    const updatedGrid = toggleWall(grid, row, col);
    setGrid(updatedGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isAnimating) return;
    const updatedGrid = toggleWall(grid, row, col);
    setGrid(updatedGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const handleRunDijkstra = () => {
    runAndAnimate(dijkstra, 'Dijkstra');
  };

  const handleRunAStar = () => {
    runAndAnimate(aStar, 'A*');
  };

  const handleClearBoard = () => {
    if (isAnimating) return;
    const cleanGrid = matrixGenerator();
    setGrid(cleanGrid);
    resetNodeClasses(cleanGrid);
    setRunStats({
      algorithm: 'None',
      visitedCount: 0,
      shortestPathCount: 0,
      pathFound: false,
      totalCost: 'N/A',
    });
  };

  return (
    <div className="dashboard" onMouseLeave={handleMouseUp}>
      <div className="title-block">
        <h1>Network Breach Pathfinder</h1>
        <p>Simulate breach traversal with Dijkstra and A* route intelligence.</p>
      </div>

      <ControlPanel
        onRunDijkstra={handleRunDijkstra}
        onRunAStar={handleRunAStar}
        onClearBoard={handleClearBoard}
        disabled={isAnimating}
      />

      <div className="stats-panel" aria-live="polite">
        <div className="stat-item">
          <span className="stat-label">Algorithm</span>
          <span className="stat-value">{runStats.algorithm}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Visited Nodes</span>
          <span className="stat-value">{runStats.visitedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Shortest Path Nodes</span>
          <span className="stat-value">{runStats.shortestPathCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Path Found</span>
          <span className="stat-value">{runStats.pathFound ? 'Yes' : 'No'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value">{runStats.totalCost}</span>
        </div>
      </div>

      <div className="grid-shell">
        <div className="grid-container">
          {grid.map((row) =>
            row.map((node) => (
              <GridNode
                key={`${node.row}-${node.col}`}
                node={node}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: '#16c47f' }} /> Start
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: '#ff5a5f' }} /> Target
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: '#1e2e45' }} /> Wall
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: '#43b0f1' }} /> Visited
        </span>
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: '#ffd166' }} /> Shortest
          Path
        </span>
      </div>
    </div>
  );
}

export default NetworkDashboard;
