import { Project } from '../types';

interface SidebarProps {
    projects: Project[];
    selectedProject: Project | null;
    onSelectProject: (project: Project) => void;
    onCreateProject: (e: React.FormEvent) => void;
    onDeleteProject: (id: number) => void;
    newProjectName: string;
    setNewProjectName: (name: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
    projects,
    selectedProject,
    onSelectProject,
    onCreateProject,
    onDeleteProject,
    newProjectName,
    setNewProjectName,
    collapsed,
    setCollapsed,
}: SidebarProps) {
    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <h2>Projects</h2>}
                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? '>' : '<'}
                </button>
            </div>

            {!collapsed && (
                <>
                    <form onSubmit={onCreateProject} className="project-form">
                        <input
                            type="text"
                            placeholder="New project..."
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                        />
                        <button type="submit">+</button>
                    </form>

                    <div className="project-list">
                        {projects.length === 0 ? (
                            <p className="empty-text">No projects yet</p>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                                    onClick={() => onSelectProject(project)}
                                >
                                    <span className="project-name">{project.name}</span>
                                    <button
                                        className="project-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteProject(project.id);
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
