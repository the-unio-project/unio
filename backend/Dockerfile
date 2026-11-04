FROM python:3.14.7

WORKDIR /app

COPY ./app/requirements.txt .

RUN pip install -r requirements.txt

COPY ./app/ /app
COPY ./alembic/ /app/alembic
COPY ./alembic.ini /app/alembic.ini

CMD ["sh", "-c", "fastapi run main.py --host 0.0.0.0 --port ${PORT:-8000}"]
