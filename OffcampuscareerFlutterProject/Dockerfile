# Multi-stage Dockerfile for Flutter Web Deployment
FROM debian:bullseye-slim AS build-env

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    && rm -rf /var/lib/apt/lists/*

# Clone Flutter SDK
RUN git clone https://github.com/flutter/flutter.git -b stable /usr/local/flutter

# Add Flutter to path
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Run doctor and pre-cache web artifacts
RUN flutter doctor -v
RUN flutter config --enable-web

# Copy Flutter Project
WORKDIR /app
COPY . .

# Fetch package dependencies
RUN flutter pub get

# Build production web bundle
RUN flutter build web --release

# Stage 2: Serve using Nginx container
FROM nginx:alpine
COPY --from=build-env /app/build/web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
