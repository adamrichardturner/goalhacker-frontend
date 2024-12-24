#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [dev|prod]"
    echo "  dev  - Set up development environment"
    echo "  prod - Set up production environment"
    exit 1
}

# Check if environment argument is provided
if [ "$#" -ne 1 ]; then
    usage
fi

ENV=$1

case $ENV in
    "dev")
        echo "Setting up development environment..."
        cp api/.env.development api/.env
        cp frontend/.env.development frontend/.env
        ;;
    "prod")
        echo "Setting up production environment..."
        cp api/.env.production api/.env
        cp frontend/.env.production frontend/.env
        ;;
    *)
        usage
        ;;
esac

echo "Environment files set up successfully for $ENV environment." 