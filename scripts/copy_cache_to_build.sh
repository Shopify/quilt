#!/bin/bash

if [ -n "$(ls -A .package-build-cache)" ]
then
    for p in .package-build-cache/*/build; do
        mkdir -p packages/${p:21}
        rm -rf packages/${p:21}/*
        cp -a $p/* packages/${p:21}
    done
fi
