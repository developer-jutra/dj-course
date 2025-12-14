from pydantic import BaseModel, Field, validator
from typing import Optional, Literal

class GeminiConfig(BaseModel):
    engine: Literal["GEMINI"] = Field(default="GEMINI")
    model_name: str = Field(..., description="Nazwa modelu Gemini")
    gemini_api_key: str = Field(..., min_length=1, description="Klucz API Google Gemini")
    temperature: Optional[float] = Field(default=None, ge=0.0, le=2.0, description="Temperatura próbkowania")
    top_p: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Top-P sampling")
    top_k: Optional[int] = Field(default=None, ge=1, description="Top-K sampling")
    
    @validator('gemini_api_key')
    def validate_api_key(cls, v):
        if not v or v.strip() == "":
            raise ValueError("GEMINI_API_KEY nie może być pusty")
        return v.strip()
