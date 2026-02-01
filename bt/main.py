from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

# Import routers
from routers.auth import router as authrouter
from routers.profile import router as profilerouter
from routers.projects import router as projectrouter
from routers.search import router as searchrouter
from routers.application import router as applicationrouter
from routers.management import router as managementrouter
from routers.chat import router as chatrouter
from routers.skills import router as skillrouter
from routers.upload import router as uploadrouter

# Create FastAPI app
app = FastAPI(
    title="FilmCrew API",
    description="Backend API for FilmCrew Platform",
    version="1.0.0"
)

# ===================== CORS CONFIG (ENHANCED) =====================
# CRITICAL FIX: CORS must be added BEFORE any other middleware
# Order matters in FastAPI!

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React (Vite)
        "http://127.0.0.1:5173",  # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# ===================== GLOBAL EXCEPTION HANDLER =====================
# This will catch ANY errors and return proper JSON responses
# Prevents CORS errors caused by unhandled exceptions

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch all unhandled exceptions and return proper JSON response
    This prevents CORS errors from server crashes
    """
    print(f"❌ UNHANDLED EXCEPTION: {exc}")
    print(f"📍 Path: {request.url.path}")
    print(f"🔍 Traceback:")
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc),
            "path": str(request.url.path)
        },
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# ===================== BASIC ENDPOINTS =====================

@app.get("/")
async def root():
    return {
        "message": "FilmCrew API is running! 🎬",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "cors": "enabled",
        "frontend": "http://localhost:5173"
    }

# ===================== ROUTERS =====================
# Include routers in specific order
# Auth should be first, then profile, then others

app.include_router(authrouter)
app.include_router(profilerouter)
app.include_router(skillrouter)  # Skills before projects (projects use skills)
app.include_router(projectrouter)
app.include_router(searchrouter)
app.include_router(applicationrouter)
app.include_router(managementrouter)
app.include_router(chatrouter)
app.include_router(uploadrouter)

# ===================== LIFECYCLE EVENTS =====================

@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print("🎬 FilmCrew API Started Successfully!")
    print("=" * 60)
    print("📝 API Docs:      http://localhost:8000/docs")
    print("🔧 Health Check:  http://localhost:8000/health")
    print("🌐 CORS Enabled:  http://localhost:5173")
    print("=" * 60)
    print("✅ Available Endpoints:")
    print("   • /auth/*       - Authentication")
    print("   • /profile/*    - User Profiles")
    print("   • /projects/*   - Project Management")
    print("   • /search/*     - Search System")
    print("   • /applications/* - Applications")
    print("   • /management/* - Project Management")
    print("   • /chat/*       - Messaging")
    print("   • /skills/*     - Skills")
    print("   • /upload/*     - File Upload")
    print("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    print("=" * 60)
    print("👋 FilmCrew API Shutting Down...")
    print("=" * 60)

# ===================== DEBUG MIDDLEWARE =====================
# Uncomment this during development to see all requests

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests for debugging"""
    print(f"🌐 {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        print(f"✅ {request.method} {request.url.path} -> {response.status_code}")
        return response
    except Exception as e:
        print(f"❌ {request.method} {request.url.path} -> ERROR: {e}")
        raise