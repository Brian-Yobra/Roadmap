import { useState, useRef, useCallback, useEffect } from 'react';
import { UndoAction } from '../types';
import { api } from '../services/api';

export function useHistory(fetchData: () => void) {
    const undoStack = useRef<UndoAction[]>([]);
    const redoStack = useRef<UndoAction[]>([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const pushUndo = useCallback((action: UndoAction) => {
        undoStack.current.push(action);
        setCanUndo(true);
        redoStack.current = [];
        setCanRedo(false);
    }, []);

    const handleUndo = useCallback(async () => {
        const action = undoStack.current.pop();
        if (!action) {
            setCanUndo(false);
            return;
        }

        try {
            switch (action.type) {
                case 'DELETE_TODO':
                    await api.createTodo({
                        project_id: action.todoData.project_id,
                        title: action.todoData.title,
                        description: action.todoData.description,
                        position_x: action.todoData.position_x,
                        position_y: action.todoData.position_y,
                    });
                    break;

                case 'CREATE_TODO':
                    await api.deleteTodo(action.todoId);
                    break;

                case 'TOGGLE_COMPLETE':
                    await api.updateTodo(action.todoId, { completed: action.previousState });
                    break;

                case 'MOVE_TODO':
                    await api.updateTodo(action.todoId, {
                        position_x: action.previousX,
                        position_y: action.previousY,
                    });
                    break;

                case 'CREATE_LINK':
                    await api.deleteLink(action.linkId);
                    break;

                case 'DELETE_LINK':
                    await api.createLink(action.sourceId, action.targetId);
                    break;
            }

            redoStack.current.push(action);
            setCanRedo(true);
            fetchData();
        } catch (err) {
            console.error('Undo failed:', err);
        }

        setCanUndo(undoStack.current.length > 0);
    }, [fetchData]);

    const handleRedo = useCallback(async () => {
        const action = redoStack.current.pop();
        if (!action) {
            setCanRedo(false);
            return;
        }

        try {
            switch (action.type) {
                case 'DELETE_TODO':
                    await api.deleteTodo(action.todoId);
                    break;
                case 'CREATE_TODO':
                    break;
                case 'TOGGLE_COMPLETE':
                    await api.updateTodo(action.todoId, { completed: !action.previousState });
                    break;
                case 'MOVE_TODO':
                    break;
                case 'CREATE_LINK':
                    break;
                case 'DELETE_LINK':
                    await api.deleteLink(action.linkId);
                    break;
            }

            undoStack.current.push(action);
            setCanUndo(true);
            fetchData();
        } catch (err) {
            console.error('Redo failed:', err);
        }

        setCanRedo(redoStack.current.length > 0);
    }, [fetchData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                handleUndo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    return { pushUndo, handleUndo, handleRedo, canUndo, canRedo };
}
