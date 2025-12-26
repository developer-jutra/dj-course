from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
import os

class LlamaConfig(BaseModel):
    engine: Literal["LLAMA"] = Field(default="LLAMA")
    model_name: str = Field(..., description="Nazwa modelu LLaMA")
    llama_model_path: str = Field(..., min_length=1, description="Ścieżka do modelu LLaMA (GGUF)")
    llama_gpu_layers: int = Field(default=1, ge=0, description="Liczba warstw GPU")
    llama_context_size: int = Field(default=2048, gt=0, description="Rozmiar kontekstu")
    temperature: Optional[float] = Field(default=None, ge=0.0, le=2.0, description="Temperatura próbkowania")
    top_p: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Top-P sampling")
    top_k: Optional[int] = Field(default=None, ge=1, description="Top-K sampling")

    @validator('llama_model_path')
    def validate_model_path(cls, v):
        if not os.path.exists(v):
            raise ValueError(f"Plik modelu nie istnieje: {v}")
        if not v.endswith('.gguf'):
            raise ValueError("Plik modelu musi mieć rozszerzenie .gguf")
        return v
