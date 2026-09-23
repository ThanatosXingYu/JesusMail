#!/bin/bash

echo "Compiling JesusMail core..."

# Determine the architecture and set the binary name accordingly
ARCH=$(uname -m)
PLATFORMS="all"
if [[ "$ARCH" == "x86_64" ]]; then
    BINARY="jesusmail-amd64"
    PLATFORMS="x86"
    echo "Detect x86_64 architecture, using amd64 binary"
elif [[ "$ARCH" == "arm64" || "$ARCH" == "aarch64" ]]; then
    BINARY="jesusmail-arm64"
    PLATFORMS="arm"
    echo "Detect arm64/aarch64 architecture, using arm64 binary"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Using the alpine image to compile the Go application
docker exec p-g-alpine sh -c "cd /opt/core && sh ./go-build.sh $PLATFORMS"

echo "Copying the compiled JesusMail core to the core container..."

echo "Copying the compiled binary from the build container to the core container..."

# Copy the compiled binary to the jesusmail-core-jesusmail-1 container
docker cp $BINARY jesusmail-core-jesusmail-1:/opt/jesusmail/core/jesusmail


echo "Removing the existing frontend bundle from the core container..."

# Remove the public/dist/ directory from the jesusmail-core-jesusmail-1 container
docker exec jesusmail-core-jesusmail-1 sh -c "rm -rf /opt/jesusmail/core/public/dist"


echo "Copying the frontend bundle to the core container..."

# Copy the public directory to the jesusmail-core-jesusmail-1 container
docker cp public/. jesusmail-core-jesusmail-1:/opt/jesusmail/core/public/


echo "Copying the manifest to the core container..."

# Copy the manifest/ directory to the jesusmail-core-jesusmail-1 container
docker cp manifest/. jesusmail-core-jesusmail-1:/opt/jesusmail/core/manifest/


echo "Copying the templates to the core container..."

# Copy the template/ directory to the jesusmail-core-jesusmail-1 container
docker cp template/. jesusmail-core-jesusmail-1:/opt/jesusmail/core/template/


echo "Restarting the JesusMail core container..."

# Restart the jesusmail-core-jesusmail-1 container to apply changes
docker restart jesusmail-core-jesusmail-1

echo "JesusMail core has been successfully compiled and deployed."