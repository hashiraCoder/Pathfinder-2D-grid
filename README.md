# Network Breach Pathfinder

Pathfinding Visualizer built with React + Vite.

This app simulates network traversal using:
- Dijkstra's Algorithm
- A* (A-Star) with Manhattan Distance heuristic

Users can draw walls on a `20 x 50` grid and visualize:
- Search expansion order (`visitedNodesInOrder`)
- Final shortest path (`shortestPath`)
- Run metrics (visited nodes, shortest path nodes, path found, total cost)

## Tech Stack

- React 18
- Vite 5
- Standard CSS (no Canvas)
- Pure JavaScript algorithm modules

## Project Structure

```text
src/
	algorithms/
		aStar.js
		dijkstra.js
	components/
		ControlPanel.jsx
		GridNode.jsx
		NetworkDashboard.jsx
	styles/
		NetworkDashboard.css
	utils/
		matrixGenerator.js
	App.jsx
	main.jsx
```

## Node Model

Each grid cell is initialized with:

```js
{
	row: rowIndex,
	col: colIndex,
	isStart: row === 10 && col === 5,
	isTarget: row === 10 && col === 45,
	isWall: false,
	weight: 1,
	isVisited: false,
	distance: Infinity,
	fScore: Infinity,
	previousNode: null
}
```

## Grid + Interaction

- Grid size: `20 rows x 50 columns`
- Node size: `25px x 25px`
- Rendered with CSS Grid:

```css
.grid-container {
	display: grid;
	grid-template-columns: repeat(50, 25px);
	gap: 1px;
	background-color: #333;
}
```

- Mouse interactions:
	- `onMouseDown`: toggle wall
	- `onMouseEnter`: drag-to-draw walls
	- `onMouseUp`: stop drawing

## Algorithms

### Dijkstra
- Pure JS implementation.
- Handles boundaries and walls.
- Returns:
	- `visitedNodesInOrder`
	- `shortestPath`

### A*
- Pure JS implementation.
- Uses Manhattan Distance heuristic:

```text
|current.row - target.row| + |current.col - target.col|
```

- Handles boundaries and walls.
- Returns:
	- `visitedNodesInOrder`
	- `shortestPath`

## Animation Strategy

Animation is handled in `NetworkDashboard.jsx`, not inside algorithm files.

- Phase 1: animate visited nodes with `setTimeout` loop (search phase).
- Phase 2: chain shortest-path animation with a second `setTimeout` loop.
- Performance optimization: uses `document.getElementById` and CSS class updates to avoid full-grid React re-render per tick.

## Metrics Displayed

After each run, the dashboard shows:
- Algorithm name
- Number of visited nodes
- Number of nodes in shortest path
- Path found (`Yes`/`No`)
- Total path cost

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Usage

1. Draw walls by clicking and dragging on the grid.
2. Click `Run Dijkstra` or `Run A*`.
3. Watch search animation and shortest-path animation.
4. Check run statistics in the stats panel.
5. Use `Clear Board` to reset walls and metrics.

## Notes

- Start node is fixed at `(10, 5)`.
- Target node is fixed at `(10, 45)`.
- If walls block all possible routes, `Path Found` is `No` and shortest path count is `0`.

