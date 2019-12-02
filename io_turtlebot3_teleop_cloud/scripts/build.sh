#!/bin/bash
cd ui
apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
npm install