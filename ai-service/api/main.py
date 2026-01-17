from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.api.routers import code_evaluation, code_evaluation_ws
from src.logging import get_logger

logger = get_logger("API")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle management
    Gracefully handle startup and shutdown events, avoid CancelledError
    """
    # Execute on startup
    logger.info("Application startup")
    yield
    # Execute on shutdown
    logger.info("Application shutdown")


app = FastAPI(title="DeepTutor API", version="1.0.0", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount user directory as static root for generated artifacts
# This allows frontend to access generated artifacts (images, PDFs, etc.)
# URL: /api/outputs/solve/solve_xxx/artifacts/image.png
# Physical Path: DeepTutor/data/user/solve/solve_xxx/artifacts/image.png
project_root = Path(__file__).parent.parent.parent
user_dir = project_root / "data" / "user"

# Initialize user directories on startup
try:
    from src.services.setup import init_user_directories

    init_user_directories(project_root)
except Exception:
    # Fallback: just create the main directory if it doesn't exist
    if not user_dir.exists():
        user_dir.mkdir(parents=True)

app.mount("/api/outputs", StaticFiles(directory=str(user_dir)), name="outputs")

app.include_router(code_evaluation.router, prefix="/api/v1/compila", tags=["compila"])
app.include_router(code_evaluation_ws.router, prefix="/api/v1/compila", tags=["compila-ws"])


@app.get("/")
async def root():
    return {"message": "Welcome to DeepTutor API"}


if __name__ == "__main__":
    from pathlib import Path

    import uvicorn

    # Get project root directory
    project_root = Path(__file__).parent.parent.parent

    # Ensure project root is in Python path
    import sys

    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))

    # Get port from configuration
    from src.services.setup import get_backend_port

    backend_port = get_backend_port(project_root)

    # Configure reload_excludes with absolute paths to properly exclude directories
    venv_dir = project_root / "venv"
    data_dir = project_root / "data"
    reload_excludes = [
        str(d)
        for d in [
            venv_dir,
            project_root / ".venv",
            data_dir,
            project_root / "web" / "node_modules",
            project_root / "web" / ".next",
            project_root / ".git",
        ]
        if d.exists()
    ]

    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=backend_port,
        reload=True,
        reload_excludes=reload_excludes,
    )
