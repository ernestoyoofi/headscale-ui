#!/bin/bash
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7,linux/386 -t ernestoyoofi/headscale-ui:latest --push .
echo "Result"
docker buildx imagetools inspect ernestoyoofi/headscale-ui:latest