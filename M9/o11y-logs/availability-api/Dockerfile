FROM python:3.13-slim
WORKDIR /app
COPY pyproject.toml pyproject.toml
RUN pip install uv
RUN uv pip install --system --no-cache .
COPY . .
EXPOSE 3001
CMD ["python", "server.py"]
