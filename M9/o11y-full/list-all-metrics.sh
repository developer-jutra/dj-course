#!/bin/bash
# List all metrics from Prometheus

echo -e "\033[32mAll metrics:\033[0m"
curl -s http://localhost:9090/api/v1/label/__name__/values | jq -r '.data[]' | sort

echo -e "\033[32mActive targets:\033[0m"
curl -s http://localhost:9090/api/v1/targets | jq -r '.data.activeTargets[] | "\(.labels.job) - \(.health)"'

echo -e "\033[32mAll metrics from otel-collector:\033[0m"
curl -s http://localhost:8890/metrics | grep -E '^[a-z_]+{' | sed 's/{.*//' | sort -u