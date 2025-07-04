FROM python:3.11-slim

# Install Poetry
RUN pip install --upgrade pip && pip install poetry

WORKDIR /app
COPY . .

# Install dependencies
RUN poetry install --no-interaction --no-ansi --only main

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 