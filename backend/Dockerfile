FROM python:3.14.7

WORKDIR /app

COPY backend/app/requirements.txt .

RUN pip install -r requirements.txt

COPY backend/app/ /app
COPY backend/alembic/ /app/alembic
COPY backend/alembic.ini /app/alembic.ini

CMD ["sh", "-c", "fastapi run main.py --host 0.0.0.0 --port ${PORT:-8000}"]
