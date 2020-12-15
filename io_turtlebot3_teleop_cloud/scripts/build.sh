#!/bin/bash
cd ui
apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
apt-get install -y python-pip
pip install git+git://github.com/rapyuta-robotics/autobahn-python@py2_backport
npm install