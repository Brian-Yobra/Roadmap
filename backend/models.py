from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Project(Base):
    """Project model - each project has its own canvas of todos"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to todos
    todos = relationship("Todo", back_populates="project", cascade="all, delete-orphan")


class Todo(Base):
    """Todo model for PostgreSQL database with canvas position"""
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    completed = Column(Boolean, default=False)
    position_x = Column(Float, default=100.0)
    position_y = Column(Float, default=100.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="todos")
    outgoing_links = relationship("TodoLink", foreign_keys="TodoLink.source_id", back_populates="source", cascade="all, delete-orphan")
    incoming_links = relationship("TodoLink", foreign_keys="TodoLink.target_id", back_populates="target", cascade="all, delete-orphan")


class TodoLink(Base):
    """Link between two todos for canvas connections"""
    __tablename__ = "todo_links"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("todos.id", ondelete="CASCADE"), nullable=False)
    target_id = Column(Integer, ForeignKey("todos.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    source = relationship("Todo", foreign_keys=[source_id], back_populates="outgoing_links")
    target = relationship("Todo", foreign_keys=[target_id], back_populates="incoming_links")
