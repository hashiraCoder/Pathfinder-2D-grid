function GridNode({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  const { row, col, isStart, isTarget, isWall } = node;

  let className = 'node';
  if (isStart) className += ' node-start';
  else if (isTarget) className += ' node-target';
  else if (isWall) className += ' node-wall';

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      role="button"
      tabIndex={-1}
      aria-label={`Node ${row}, ${col}`}
    />
  );
}

export default GridNode;
