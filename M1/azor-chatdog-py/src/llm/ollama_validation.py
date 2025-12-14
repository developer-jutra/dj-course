from pydantic import BaseModel, Field, validator
from typing import Optional, Literal

class OllamaConfig(BaseModel):
    engine: Literal["OLLAMA"] = Field(default="OLLAMA")
    model_name: str = Field(..., description="Nazwa modelu Ollama")
    ollama_api_base_url: str = Field(..., description="Bazowy URL do API Ollama")
    temperature: Optional[float] = Field(default=None, ge=0.0, le=2.0, description="Temperatura próbkowania")
    top_p: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Top-P sampling")
    top_k: Optional[int] = Field(default=None, ge=1, description="Top-K sampling")
    
    @validator('ollama_api_base_url')
    def validate_api_base_url(cls, v):
        if not v or v.strip() == "":
            raise ValueError("OLLAMA_API_BASE_URL nie może być pusty")
        return v.strip()
