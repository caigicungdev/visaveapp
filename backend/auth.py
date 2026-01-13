"""
Authentication module for V-Tool API.
Provides optional JWT validation using Supabase.
Anonymous users are allowed but get stricter rate limits.
"""

from typing import Optional
from fastapi import Request, HTTPException
from dataclasses import dataclass
import jwt
import httpx
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY


@dataclass
class User:
    """Represents an authenticated user."""
    id: str
    email: Optional[str] = None
    is_premium: bool = False


async def get_current_user(request: Request) -> Optional[User]:
    """
    Extract and validate user from Authorization header.
    Returns None for anonymous users (allowed for free tier).
    
    Args:
        request: FastAPI request object
        
    Returns:
        User object if authenticated, None if anonymous
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        return None
    
    if not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.replace("Bearer ", "")
    
    if not token:
        return None
    
    try:
        # Validate token with Supabase
        user_data = await validate_supabase_token(token)
        if user_data:
            return User(
                id=user_data.get("id", user_data.get("sub", "")),
                email=user_data.get("email"),
                is_premium=user_data.get("is_premium", False)
            )
    except Exception as e:
        print(f"Auth validation error: {e}")
        # Don't fail - allow as anonymous
        pass
    
    return None


async def validate_supabase_token(token: str) -> Optional[dict]:
    """
    Validate a Supabase JWT token.
    
    Args:
        token: JWT token from client
        
    Returns:
        User data dict if valid, None otherwise
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("Warning: Supabase not configured, skipping token validation")
        return None
    
    try:
        # Call Supabase to validate the token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_SERVICE_KEY
                },
                timeout=5.0
            )
            
            if response.status_code == 200:
                user_data = response.json()
                
                # Check if user has premium subscription
                # This could be extended to check user_metadata or a subscriptions table
                is_premium = user_data.get("user_metadata", {}).get("is_premium", False)
                
                return {
                    "id": user_data.get("id"),
                    "email": user_data.get("email"),
                    "is_premium": is_premium
                }
    except httpx.RequestError as e:
        print(f"Supabase request error: {e}")
    except Exception as e:
        print(f"Token validation error: {e}")
    
    return None


def get_client_ip(request: Request) -> str:
    """
    Extract client IP address from request.
    Handles proxied requests (X-Forwarded-For) and direct connections.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Client IP address string
    """
    # Check for proxied requests
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # X-Forwarded-For can contain multiple IPs, take the first (client)
        return forwarded.split(",")[0].strip()
    
    # Check X-Real-IP (common with nginx)
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    
    # Fall back to direct connection
    if request.client:
        return request.client.host
    
    return "unknown"
