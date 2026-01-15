import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TodoNodeData } from '../types';
import { api } from '../services/api';

export function TodoNode({ data, id }: { data: TodoNodeData; id: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);

    const handleToggleComplete = async () => {
        try {
            await api.updateTodo(parseInt(id), { completed: !data.completed });
            data.onUpdate();
        } catch (err) {
            console.error('Failed to toggle todo:', err);
        }
    };

    const handleSaveTitle = async () => {
        if (!title.trim()) return;
        try {
            await api.updateTodo(parseInt(id), { title: title.trim() });
            setIsEditing(false);
            data.onUpdate();
        } catch (err) {
            console.error('Failed to update title:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deleteTodo(parseInt(id));
            data.onUpdate();
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    };

    return (
        <div className={`todo-node ${data.completed ? 'completed' : ''}`}>
            <Handle type="target" position={Position.Left} className="handle" />

            <div className="node-header">
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={data.completed}
                        onChange={handleToggleComplete}
                    />
                    <span className="checkbox-custom"></span>
                </label>
                <button className="delete-btn" onClick={handleDelete}>X</button>
            </div>

            <div className="node-content">
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                        autoFocus
                        className="edit-input"
                    />
                ) : (
                    <div
                        className="node-title"
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {data.title}
                    </div>
                )}
                {data.description && (
                    <div className="node-description">{data.description}</div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className="handle" />
        </div>
    );
}
