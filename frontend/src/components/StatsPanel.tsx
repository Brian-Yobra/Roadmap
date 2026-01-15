import { Panel } from '@xyflow/react';

interface StatsPanelProps {
    pendingCount: number;
    completedCount: number;
}

export function StatsPanel({ pendingCount, completedCount }: StatsPanelProps) {
    return (
        <Panel position="top-right" className="stats-panel">
            <div className="stat">
                <span className="stat-value">{pendingCount}</span>
                <span className="stat-label">Pending</span>
            </div>
            <div className="stat">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">Done</span>
            </div>
        </Panel>
    );
}
