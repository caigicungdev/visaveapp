from fastapi import APIRouter

from . import inpainting

def register_routers(app):
    app.include_router(inpainting.router)
