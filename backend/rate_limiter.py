"""
Rate Limiter for V-Tool API
Uses sliding window algorithm with in-memory storage.
Tracks by IP address (anonymous) or user_id (authenticated).
"""

import time
from collections import defaultdict
from threading import Lock
from typing import Optional, Dict, Tuple
from dataclasses import dataclass, field


@dataclass
class RateLimitConfig:
    """Configuration for rate limiting per endpoint."""
    requests_per_hour: int
    requests_per_day: int
    
    
# Default rate limits for free tier
FREE_TIER_LIMITS: Dict[str, RateLimitConfig] = {
    "download": RateLimitConfig(requests_per_hour=5, requests_per_day=15),
    "summary": RateLimitConfig(requests_per_hour=10, requests_per_day=30),
    "spy": RateLimitConfig(requests_per_hour=20, requests_per_day=60),
    "slideshow": RateLimitConfig(requests_per_hour=5, requests_per_day=15),
    "audio": RateLimitConfig(requests_per_hour=5, requests_per_day=15),
    "remove_bg": RateLimitConfig(requests_per_hour=10, requests_per_day=30),
    "remove_watermark": RateLimitConfig(requests_per_hour=5, requests_per_day=15),
    "inpainting": RateLimitConfig(requests_per_hour=5, requests_per_day=15),
}

# Premium tier gets 5x the limits
PREMIUM_MULTIPLIER = 5


@dataclass
class UsageRecord:
    """Tracks usage for a single identifier (IP or user_id)."""
    hourly_timestamps: list = field(default_factory=list)
    daily_timestamps: list = field(default_factory=list)
    

class RateLimiter:
    """Thread-safe in-memory rate limiter with sliding window."""
    
    def __init__(self):
        self._usage: Dict[str, Dict[str, UsageRecord]] = defaultdict(
            lambda: defaultdict(UsageRecord)
        )
        self._lock = Lock()
        self._hour_seconds = 3600
        self._day_seconds = 86400
    
    def _clean_old_timestamps(self, timestamps: list, window_seconds: int, now: float) -> list:
        """Remove timestamps outside the sliding window."""
        cutoff = now - window_seconds
        return [ts for ts in timestamps if ts > cutoff]
    
    def check_rate_limit(
        self,
        identifier: str,
        endpoint: str,
        is_premium: bool = False
    ) -> Tuple[bool, int, int]:
        """
        Check if request is allowed under rate limits.
        
        Args:
            identifier: IP address or user_id
            endpoint: The endpoint being accessed (e.g., 'download', 'summary')
            is_premium: Whether user has premium tier
            
        Returns:
            Tuple of (allowed: bool, remaining_hourly: int, reset_seconds: int)
        """
        config = FREE_TIER_LIMITS.get(endpoint)
        if not config:
            # Unknown endpoint, allow by default
            return True, 999, 0
        
        hourly_limit = config.requests_per_hour
        daily_limit = config.requests_per_day
        
        if is_premium:
            hourly_limit *= PREMIUM_MULTIPLIER
            daily_limit *= PREMIUM_MULTIPLIER
        
        now = time.time()
        
        with self._lock:
            record = self._usage[endpoint][identifier]
            
            # Clean old timestamps
            record.hourly_timestamps = self._clean_old_timestamps(
                record.hourly_timestamps, self._hour_seconds, now
            )
            record.daily_timestamps = self._clean_old_timestamps(
                record.daily_timestamps, self._day_seconds, now
            )
            
            hourly_count = len(record.hourly_timestamps)
            daily_count = len(record.daily_timestamps)
            
            # Check limits
            if hourly_count >= hourly_limit:
                # Calculate reset time (when oldest request expires)
                oldest = min(record.hourly_timestamps) if record.hourly_timestamps else now
                reset_seconds = int((oldest + self._hour_seconds) - now)
                return False, 0, max(1, reset_seconds)
            
            if daily_count >= daily_limit:
                oldest = min(record.daily_timestamps) if record.daily_timestamps else now
                reset_seconds = int((oldest + self._day_seconds) - now)
                return False, 0, max(1, reset_seconds)
            
            remaining = min(hourly_limit - hourly_count, daily_limit - daily_count) - 1
            return True, max(0, remaining), 0
    
    def record_request(self, identifier: str, endpoint: str):
        """Record a successful request for rate limiting."""
        now = time.time()
        
        with self._lock:
            record = self._usage[endpoint][identifier]
            record.hourly_timestamps.append(now)
            record.daily_timestamps.append(now)
    
    def get_usage_stats(self, identifier: str, endpoint: str) -> Dict:
        """Get current usage statistics for debugging/display."""
        config = FREE_TIER_LIMITS.get(endpoint)
        if not config:
            return {"error": "Unknown endpoint"}
        
        now = time.time()
        
        with self._lock:
            record = self._usage[endpoint][identifier]
            
            # Clean and count
            hourly = self._clean_old_timestamps(
                record.hourly_timestamps, self._hour_seconds, now
            )
            daily = self._clean_old_timestamps(
                record.daily_timestamps, self._day_seconds, now
            )
            
            return {
                "endpoint": endpoint,
                "hourly_used": len(hourly),
                "hourly_limit": config.requests_per_hour,
                "daily_used": len(daily),
                "daily_limit": config.requests_per_day,
            }


# Global rate limiter instance
rate_limiter = RateLimiter()
