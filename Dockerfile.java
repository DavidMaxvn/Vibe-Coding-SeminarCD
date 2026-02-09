# Build stage
FROM mcr.microsoft.com/openjdk/jdk:25-ubuntu AS build

WORKDIR /workspace

# Copy project files from repo root
COPY java/socialapp/ ./java/socialapp/
COPY openapi.yaml /openapi.yaml

# Build the application
WORKDIR /workspace/java/socialapp
RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# Create a slim JRE from the JDK
RUN jlink \
    --add-modules java.base,java.logging,java.sql,java.naming,java.management,java.security.jgss,java.instrument,jdk.unsupported,java.desktop \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /jre

# Runtime stage
FROM mcr.microsoft.com/openjdk/jdk:25-ubuntu AS runtime

# Extracted JRE
COPY --from=build /jre /opt/java/jre

# App JAR
WORKDIR /app
COPY --from=build /workspace/java/socialapp/build/libs/*SNAPSHOT.jar /app/app.jar
COPY --from=build /openapi.yaml /openapi.yaml

# Pass host env vars into container
ARG CODESPACE_NAME
ARG GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
ENV CODESPACE_NAME=${CODESPACE_NAME}
ENV GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}

# Create SQLite DB inside the image (do not copy from host)
RUN touch /app/sns_api.db

EXPOSE 8080

ENTRYPOINT ["/opt/java/jre/bin/java","-jar","/app/app.jar"]
