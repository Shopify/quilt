#!/bin/bash

mkdir -p .package-build-cache

for p in packages/*; do
    mkdir -p .package-build-cache/${p:9}

    if [ -d ${p}/build ]
    then
        cp -a ${p}/build .package-build-cache/${p:9}
    fi
done
