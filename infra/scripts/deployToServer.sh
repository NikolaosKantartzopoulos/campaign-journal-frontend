#!/bin/bash

# Function to display error messages and exit
display_error() {
  echo "Error: $1"
  # Add any error handling steps here if needed
  exit 1
}

# Ask for sudo password
echo -n "Enter your sudo password: "
read -s SUDO_PASSWORD
echo

# Check sudo password by running a harmless command with sudo
echo "$SUDO_PASSWORD" | sudo -S echo "Testing sudo access..."
if [ $? -eq 0 ]; then
  echo "Sudo access granted"
else
  display_error "Incorrect sudo password. Please try again."
fi

# Function to run commands with sudo
run_with_sudo() {
  echo "$SUDO_PASSWORD" | sudo -S "$@"
}

# Run yarn lint
if yarn lint; then
  echo "yarn lint successful"
else
  display_error "yarn lint failed"
fi

# Run yarn tsc (TypeScript compile check)
if yarn tsc; then
  echo "yarn tsc successful"
else
  display_error "yarn tsc failed"
fi

# Run yarn test
if yarn test; then
  echo "yarn test successful"

  # Run yarn build
  if yarn build; then
    echo "yarn build successful"

    # If all checks pass, continue with the rest of the script
    echo "Continuing with the deployment process..."

    # Your existing commands here (use the function run_with_sudo for commands requiring sudo)
    run_with_sudo rm -rf /home/nik/code/deployments/dnd.rtlan.gr/*

    cp -r ../* /home/nik/code/deployments/dnd.rtlan.gr/

    cd /home/nik/code/deployments/dnd.rtlan.gr/campaign-journal-frontend
    
    npm run build
    npm install 
    npm prisma:generate

    pm2 delete all
    pm2 start npm --name 'dnd-server' -- start -- --port 3500
    run_with_sudo systemctl reload apache2

  else
    # If yarn build fails, display an error message
    display_error "yarn build failed"
  fi
else
  # If yarn test fails, display an error message
  display_error "yarn test failed"
fi

sleep 2

response=$(curl -s -o /dev/null -w "%{http_code}" https://dnd.rtlan.gr)

# Check the HTTP status code
if [ $response -eq 502 ]; then
  echo 'Received a Bad Gateway error from Cloudflare (HTTP 502)'
else
  echo "Site is accessible through Cloudflare"
fi