#!/bin/bash
pwd > /aaaa.txt
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum -y install nodejs
npm i -g pm2