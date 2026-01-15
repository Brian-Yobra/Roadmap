from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import crud
import schemas
import models

router = APIRouter(prefix="/links", tags=["links"])

@router.get("", response_model=List[schemas.TodoLinkResponse])
def read_links(
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_links(db, project_id)

@router.post("", response_model=schemas.TodoLinkResponse, status_code=201)
def create_link(link: schemas.TodoLinkCreate, db: Session = Depends(get_db)):
    # Validate source and target exist
    source = crud.get_todo(db, link.source_id)
    target = crud.get_todo(db, link.target_id)
    
    if not source:
        raise HTTPException(status_code=404, detail="Source todo not found")
    if not target:
        raise HTTPException(status_code=404, detail="Target todo not found")
    if link.source_id == link.target_id:
        raise HTTPException(status_code=400, detail="Cannot link todo to itself")
    if source.project_id != target.project_id:
        raise HTTPException(status_code=400, detail="Cannot link todos from different projects")
    
    # Check if link already exists
    existing = crud.get_link_by_endpoints(db, link.source_id, link.target_id)
    if existing:
        raise HTTPException(status_code=400, detail="Link already exists")
    
    return crud.create_link(db, link)

@router.delete("/{link_id}", status_code=204)
def delete_link(link_id: int, db: Session = Depends(get_db)):
    db_link = crud.delete_link(db, link_id)
    if not db_link:
        raise HTTPException(status_code=404, detail="Link not found")
    return None
