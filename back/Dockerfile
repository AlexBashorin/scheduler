# Dockerfile for Go Server
FROM golang:1.22 AS builder

WORKDIR /app
COPY . .

# Download dependencies and build the application
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o server .  # Compiles main.go into the server binary

# Use a minimal base image
FROM scratch
WORKDIR /root/
COPY --from=builder /app/server .
COPY server.crt .
COPY server.key .

# Run the server
CMD ["./server"]  # Executes the compiled binary