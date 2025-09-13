from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from core.config import ApiResponse

router = APIRouter()

class LoginRequest(BaseModel):
    user_id: str

class LoginResponse(BaseModel):
    user_id: str
    token: str
    message: str

@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(request: LoginRequest):
    """Development login endpoint"""
    if not request.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required")
    
    # In a real app, you'd generate a proper JWT token
    # For development, we'll just return a simple token
    token = f"dev_token_{request.user_id}"
    
    response_data = LoginResponse(
        user_id=request.user_id,
        token=token,
        message="Login successful"
    )
    
    return ApiResponse(data=response_data, success=True)

@router.post("/logout", response_model=ApiResponse[dict])
async def logout():
    """Logout endpoint"""
    return ApiResponse(data={"message": "Logout successful"}, success=True)
