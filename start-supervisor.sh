#!/usr/bin/env bash
# ScopeLock Supervisor Launcher
# Starts MPSv3 supervisor with ScopeLock services.yaml
# Author: Priya "The Pulse"
# Date: 2025-11-02

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUPERVISOR_PY="/home/mind-protocol/mindprotocol/orchestration/mpsv3_supervisor.py"
CONFIG_YAML="${SCRIPT_DIR}/services.yaml"

if [ ! -f "${SUPERVISOR_PY}" ]; then
    echo "ERROR: MPSv3 supervisor not found at ${SUPERVISOR_PY}"
    exit 1
fi

if [ ! -f "${CONFIG_YAML}" ]; then
    echo "ERROR: services.yaml not found at ${CONFIG_YAML}"
    exit 1
fi

echo "[ScopeLock] Starting MPSv3 supervisor with config: ${CONFIG_YAML}"
exec python3 "${SUPERVISOR_PY}" --config "${CONFIG_YAML}"
