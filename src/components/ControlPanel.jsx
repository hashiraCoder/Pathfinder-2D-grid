function ControlPanel({ onRunDijkstra, onRunAStar, onClearBoard, disabled }) {
  return (
    <div className="control-panel">
      <button type="button" onClick={onRunDijkstra} disabled={disabled}>
        Run Dijkstra
      </button>
      <button type="button" onClick={onRunAStar} disabled={disabled}>
        Run A*
      </button>
      <button type="button" onClick={onClearBoard} disabled={disabled}>
        Clear Board
      </button>
    </div>
  );
}

export default ControlPanel;
