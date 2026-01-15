import { Panel } from '@xyflow/react';

interface CanvasHeaderProps {
    projectName: string;
}

export function CanvasHeader({ projectName }: CanvasHeaderProps) {
    return (
        <Panel position="top-center" className="header-panel">
            <h1>{projectName}</h1>
            <p>Ctrl+Z undo | Ctrl+Y redo | Scroll to zoom | Right-click to pan</p>
        </Panel>
    );
}
