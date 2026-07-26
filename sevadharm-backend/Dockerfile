# Use a lightweight official Python image
FROM python:3.10-slim

# Install Tesseract OCR system packages
RUN apt-get update && \
    apt-get install -y tesseract-ocr && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code into the container
COPY . .

# Start the FastAPI server using Render's dynamic PORT variable
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]