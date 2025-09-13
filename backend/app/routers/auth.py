from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class LoginRequest(BaseModel):
    user_id: str

class LoginResponse(BaseModel):
    user_id: str
    token: str
    message: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Development login endpoint"""
    if not request.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required")
    
    # In a real app, you'd generate a proper JWT token
    # For development, we'll just return a simple token
    token = f"dev_token_{request.user_id}"
    
    return LoginResponse(
        user_id=request.user_id,
        token=token,
        message="Login successful"
    )

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logout successful"}
