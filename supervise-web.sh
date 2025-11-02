#!/usr/bin/env bash
# ScopeLock Web Server Supervisor
# Simple restart loop with exponential backoff and health checks
# Author: Priya "The Pulse"
# Date: 2025-11-02

set -e

PORT="${SCOPELOCK_PORT:-8080}"
HOST="${SCOPELOCK_HOST:-0.0.0.0}"
PUBLIC_DIR="/home/mind-protocol/scopelock/public"
PID_FILE="/tmp/scopelock_web.pid"
LOG_FILE="/tmp/scopelock_web.log"

# Write our PID
echo $$ > "${PID_FILE}"

# Cleanup on exit
cleanup() {
    echo "[ScopeLock] Supervisor received signal, cleaning up..."
    if [ -n "${SERVER_PID}" ] && kill -0 "${SERVER_PID}" 2>/dev/null; then
        kill "${SERVER_PID}" 2>/dev/null || true
        wait "${SERVER_PID}" 2>/dev/null || true
    fi
    rm -f "${PID_FILE}"
    exit 0
}

trap cleanup SIGTERM SIGINT EXIT

# Health check function
check_health() {
    curl -sf -m 3 "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1
    return $?
}

# Exponential backoff
backoff_ms=1000
max_backoff_ms=30000
failures=0

echo "[ScopeLock] Starting web server supervisor"
echo "[ScopeLock] Port: ${PORT}, Host: ${HOST}, Dir: ${PUBLIC_DIR}"

while true; do
    echo "[ScopeLock] Starting web server (attempt $((failures + 1)))..."

    # Start server in background
    cd "${PUBLIC_DIR}"
    python3 -m http.server "${PORT}" --bind "${HOST}" >> "${LOG_FILE}" 2>&1 &
    SERVER_PID=$!

    echo "[ScopeLock] Server started with PID ${SERVER_PID}"

    # Wait for readiness (up to 10 seconds)
    ready=false
    for i in {1..10}; do
        sleep 1
        if check_health; then
            ready=true
            echo "[ScopeLock] ✓ Server ready and healthy"
            break
        fi
    done

    if ! $ready; then
        echo "[ScopeLock] ✗ Server failed readiness check"
        kill "${SERVER_PID}" 2>/dev/null || true
        wait "${SERVER_PID}" 2>/dev/null || true
        failures=$((failures + 1))
    else
        # Reset backoff on successful start
        backoff_ms=1000
        failures=0

        # Monitor process and run periodic health checks
        while kill -0 "${SERVER_PID}" 2>/dev/null; do
            sleep 10
            if ! check_health; then
                echo "[ScopeLock] ✗ Health check failed"
                kill "${SERVER_PID}" 2>/dev/null || true
                break
            fi
        done

        echo "[ScopeLock] Server process died (PID ${SERVER_PID})"
        wait "${SERVER_PID}" 2>/dev/null || true
        failures=$((failures + 1))
    fi

    # Exponential backoff with jitter
    if [ $failures -gt 0 ]; then
        jitter=$((RANDOM % 500))
        sleep_ms=$((backoff_ms + jitter))
        sleep_s=$(awk "BEGIN {print ${sleep_ms}/1000}")

        echo "[ScopeLock] Backing off ${sleep_s}s before restart..."
        sleep "${sleep_s}"

        # Increase backoff
        backoff_ms=$((backoff_ms * 2))
        if [ $backoff_ms -gt $max_backoff_ms ]; then
            backoff_ms=$max_backoff_ms
        fi
    fi
done
