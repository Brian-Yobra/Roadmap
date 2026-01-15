from sqlalchemy.orm import Session
from typing import Optional
import models
import schemas

# Projects
def get_projects(db: Session):
    return db.query(models.Project).order_by(models.Project.created_at.desc()).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(name=project.name)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project

# Todos
def get_todos(db: Session, project_id: Optional[int] = None):
    query = db.query(models.Todo)
    if project_id is not None:
        query = query.filter(models.Todo.project_id == project_id)
    return query.order_by(models.Todo.created_at.desc()).all()

def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def create_todo(db: Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: schemas.TodoUpdate):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo:
        for key, value in todo.model_dump(exclude_unset=True).items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo

# Links
def get_links(db: Session, project_id: Optional[int] = None):
    query = db.query(models.TodoLink)
    if project_id is not None:
        query = query.join(models.Todo, models.TodoLink.source_id == models.Todo.id).filter(models.Todo.project_id == project_id)
    return query.all()

def get_link_by_endpoints(db: Session, source_id: int, target_id: int):
    return db.query(models.TodoLink).filter(
        models.TodoLink.source_id == source_id,
        models.TodoLink.target_id == target_id
    ).first()

def create_link(db: Session, link: schemas.TodoLinkCreate):
    db_link = models.TodoLink(source_id=link.source_id, target_id=link.target_id)
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

def delete_link(db: Session, link_id: int):
    db_link = db.query(models.TodoLink).filter(models.TodoLink.id == link_id).first()
    if db_link:
        db.delete(db_link)
        db.commit()
    return db_link
