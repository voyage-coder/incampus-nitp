FROM python:3.12-slim-bookworm

# Tectonic is much smaller than full TeX Live and works on Render free tier.
RUN apt-get update \
    && apt-get install -y --no-install-recommends tectonic \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p uploads generated temp/debug

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
