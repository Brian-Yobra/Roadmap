from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import projects, todos, links

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo Canvas API",
    description="A modular canvas-based Todo List API",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(projects.router)
app.include_router(todos.router)
app.include_router(links.router)

@app.get("/")
def root():
    """Health check endpoint"""
    return {"message": "Todo Canvas API is running", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
