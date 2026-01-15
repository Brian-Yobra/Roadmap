import { Node } from '@xyflow/react';

export interface Project {
    id: number;
    name: string;
    created_at: string;
}

export interface Todo {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    completed: boolean;
    position_x: number;
    position_y: number;
    created_at: string;
}

export interface TodoLink {
    id: number;
    source_id: number;
    target_id: number;
}

export interface TodoNodeData {
    title: string;
    description: string | null;
    completed: boolean;
    onUpdate: () => void;
    [key: string]: unknown;
}

export type TodoNode = Node<TodoNodeData>;

export type UndoAction =
    | { type: 'DELETE_TODO'; todoId: number; todoData: Todo }
    | { type: 'CREATE_TODO'; todoId: number }
    | { type: 'TOGGLE_COMPLETE'; todoId: number; previousState: boolean }
    | { type: 'MOVE_TODO'; todoId: number; previousX: number; previousY: number }
    | { type: 'CREATE_LINK'; linkId: number }
    | { type: 'DELETE_LINK'; linkId: number; sourceId: number; targetId: number };
