'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { api } from '../services/api';
import { Project, Todo, TodoLink, TodoNode } from '../types';
import { useHistory } from '../hooks/useHistory';
import { TodoNode as TodoNodeComponent } from '../components/TodoNode';
import { Sidebar } from '../components/Sidebar';
import { CanvasHeader } from '../components/CanvasHeader';
import { StatsPanel } from '../components/StatsPanel';

const nodeTypes = { todo: TodoNodeComponent };

export default function Home() {
  // UI State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Canvas State
  const [nodes, setNodes, onNodesChange] = useNodesState<TodoNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const nodePositions = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Data Fetching
  const fetchProjects = useCallback(async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      } else if (data.length === 0) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setLoading(false);
    }
  }, [selectedProject]);

  const fetchData = useCallback(async () => {
    if (!selectedProject) {
      setNodes([]);
      setEdges([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [todos, links] = await Promise.all([
        api.getTodos(selectedProject.id),
        api.getLinks(selectedProject.id),
      ]);

      setNodes(todos.map((todo) => ({
        id: String(todo.id),
        type: 'todo',
        position: { x: todo.position_x, y: todo.position_y },
        data: {
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          onUpdate: () => fetchData(),
        },
      })));

      setEdges(links.map((link) => ({
        id: `link-${link.id}`,
        source: String(link.source_id),
        target: String(link.target_id),
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2 },
      })));
    } catch (err) {
      setError('Could not connect to server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, setNodes, setEdges]);

  const { pushUndo, handleUndo, handleRedo, canUndo, canRedo } = useHistory(fetchData);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { if (selectedProject) { setLoading(true); fetchData(); } }, [selectedProject, fetchData]);

  // Event Handlers
  const onNodeDragStart = useCallback((_: React.MouseEvent, node: TodoNode) => {
    nodePositions.current.set(node.id, { ...node.position });
  }, []);

  const onNodeDragStop = useCallback(async (_: React.MouseEvent, node: TodoNode) => {
    const prevPos = nodePositions.current.get(node.id);
    try {
      await api.updateTodo(parseInt(node.id), {
        position_x: node.position.x,
        position_y: node.position.y,
      });
      if (prevPos) {
        pushUndo({
          type: 'MOVE_TODO',
          todoId: parseInt(node.id),
          previousX: prevPos.x,
          previousY: prevPos.y,
        });
      }
    } catch (err) { console.error('Failed to update position:', err); }
  }, [pushUndo]);

  const onConnect = useCallback(async (connection: Connection) => {
    if (!connection.source || !connection.target) return;
    try {
      const newLink = await api.createLink(parseInt(connection.source), parseInt(connection.target));
      pushUndo({ type: 'CREATE_LINK', linkId: newLink.id });
      setEdges((eds) => addEdge({
        ...connection,
        id: `link-${newLink.id}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2 },
      }, eds));
    } catch (err) { console.error('Failed to create link:', err); }
  }, [pushUndo, setEdges]);

  const onEdgesDelete = useCallback(async (deletedEdges: Edge[]) => {
    for (const edge of deletedEdges) {
      const linkId = edge.id.replace('link-', '');
      try {
        await api.deleteLink(parseInt(linkId));
        pushUndo({
          type: 'DELETE_LINK',
          linkId: parseInt(linkId),
          sourceId: parseInt(edge.source),
          targetId: parseInt(edge.target),
        });
      } catch (err) { console.error('Failed to delete link:', err); }
    }
  }, [pushUndo]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      const newProject = await api.createProject(newProjectName.trim());
      setNewProjectName('');
      setProjects((prev) => [newProject, ...prev]);
      setSelectedProject(newProject);
    } catch (err) { console.error('Failed to create project:', err); }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project and all its todos?')) return;
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(projects.find((p) => p.id !== id) || null);
      }
    } catch (err) { console.error('Failed to delete project:', err); }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !selectedProject) return;
    const lastNode = nodes[nodes.length - 1];
    const position = lastNode ? { x: lastNode.position.x + 50, y: lastNode.position.y + 50 } : { x: 250, y: 150 };
    try {
      const newTodo = await api.createTodo({
        project_id: selectedProject.id,
        title: newTodoTitle.trim(),
        position_x: position.x,
        position_y: position.y,
      });
      pushUndo({ type: 'CREATE_TODO', todoId: newTodo.id });
      setNewTodoTitle('');
      fetchData();
    } catch (err) { console.error('Failed to add todo:', err); }
  };

  if (loading && projects.length === 0) {
    return <div className="loading-screen"><div className="spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="app-container">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="canvas-container">
        {!selectedProject ? (
          <div className="empty-state"><h2>No Project Selected</h2><p>Create or select a project to get started</p></div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            deleteKeyCode="Delete"
            panOnDrag={[1, 2]}
            zoomOnScroll
            connectionMode={ConnectionMode.Loose}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#333" gap={20} />
            <Controls className="controls" />
            <MiniMap
              className="minimap"
              nodeColor={(n) => (n.data?.completed ? '#22c55e' : '#06b6d4')}
              maskColor="rgba(0, 0, 0, 0.8)"
            />

            <CanvasHeader projectName={selectedProject.name} />

            <Panel position="top-left" className="add-panel">
              <form onSubmit={handleAddTodo} className="add-form">
                <input
                  type="text"
                  placeholder="Add new todo..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                />
                <button type="submit">+</button>
              </form>
              <div className="undo-redo-btns">
                {canUndo && <button className="undo-btn" onClick={handleUndo} title="Undo (Ctrl+Z)">Undo</button>}
                {canRedo && <button className="redo-btn" onClick={handleRedo} title="Redo (Ctrl+Y)">Redo</button>}
              </div>
            </Panel>

            <StatsPanel
              pendingCount={nodes.length - nodes.filter((n) => n.data?.completed).length}
              completedCount={nodes.filter((n) => n.data?.completed).length}
            />

            {error && <Panel position="bottom-center" className="error-panel">{error}</Panel>}
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
