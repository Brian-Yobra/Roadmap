import { Project, Todo, TodoLink } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  },
  createProject: async (name: string): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
  },
  deleteProject: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete project");
  },

  // Todos
  getTodos: async (projectId: number): Promise<Todo[]> => {
    const res = await fetch(`${API_URL}/todos?project_id=${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
  },
  createTodo: async (todo: Partial<Todo>): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },
  updateTodo: async (id: number, todo: Partial<Todo>): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },
  deleteTodo: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete todo");
  },

  // Links
  getLinks: async (projectId: number): Promise<TodoLink[]> => {
    const res = await fetch(`${API_URL}/links?project_id=${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch links");
    return res.json();
  },
  createLink: async (sourceId: number, targetId: number): Promise<TodoLink> => {
    const res = await fetch(`${API_URL}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_id: sourceId, target_id: targetId }),
    });
    if (!res.ok) throw new Error("Failed to create link");
    return res.json();
  },
  deleteLink: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/links/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete link");
  },
};
