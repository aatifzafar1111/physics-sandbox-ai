export function ViewGizmo({ onAxis }: { onAxis?: (axis: "x" | "y" | "z") => void }) {
  return (
    <div className="absolute right-3 top-3 z-10 select-none">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-label="View orientation gizmo">
        {/* cube */}
        <g fill="none" stroke="currentColor" className="text-border" strokeWidth="1.2">
          <polygon points="48,20 74,33 74,62 48,75 22,62 22,33" />
          <polyline points="22,33 48,46 74,33" />
          <line x1="48" y1="46" x2="48" y2="75" />
        </g>
        {/* axes */}
        <g strokeWidth="1.6" strokeLinecap="round">
          <line x1="48" y1="46" x2="48" y2="18" stroke="var(--axis-y)" />
          <line x1="48" y1="46" x2="76" y2="60" stroke="var(--axis-x)" />
          <line x1="48" y1="46" x2="22" y2="60" stroke="var(--axis-z)" />
        </g>
        <text
          x="48"
          y="12"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--axis-y)"
          onClick={() => onAxis?.("y")}
          className="cursor-pointer"
        >
          Y
        </text>
        <text
          x="84"
          y="66"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--axis-x)"
          onClick={() => onAxis?.("x")}
          className="cursor-pointer"
        >
          X
        </text>
        <text
          x="14"
          y="66"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--axis-z)"
          onClick={() => onAxis?.("z")}
          className="cursor-pointer"
        >
          Z
        </text>
      </svg>
    </div>
  );
}
