from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Project schemas
class ProjectCreate(BaseModel):
    """Schema for creating a Project"""
    name: str


class ProjectResponse(BaseModel):
    """Schema for Project response"""
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


# Todo schemas
class TodoBase(BaseModel):
    """Base schema for Todo"""
    title: str
    description: Optional[str] = None


class TodoCreate(TodoBase):
    """Schema for creating a Todo"""
    project_id: int
    position_x: Optional[float] = 100.0
    position_y: Optional[float] = 100.0


class TodoUpdate(BaseModel):
    """Schema for updating a Todo"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None


class TodoResponse(TodoBase):
    """Schema for Todo response"""
    id: int
    project_id: int
    completed: bool
    position_x: float
    position_y: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Link schemas
class TodoLinkCreate(BaseModel):
    """Schema for creating a link between todos"""
    source_id: int
    target_id: int


class TodoLinkResponse(BaseModel):
    """Schema for link response"""
    id: int
    source_id: int
    target_id: int
    created_at: datetime

    class Config:
        from_attributes = True
