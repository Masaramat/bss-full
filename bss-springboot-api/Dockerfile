# Use an official OpenJDK runtime
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy built JAR
COPY target/loan-processor-0.0.1-SNAPSHOT.jar /app/loan-processor.jar

# Expose port
EXPOSE 8080

# Set active profile and optionally memory options
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Metadata
LABEL org.opencontainers.image.source="https://github.com/Masaramat/bss-springboot-api.git"

# Run the app with JAVA_OPTS and profile
ENTRYPOINT exec java $JAVA_OPTS -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar /app/loan-processor.jar
