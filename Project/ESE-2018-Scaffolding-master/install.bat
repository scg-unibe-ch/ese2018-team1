@echo off
title ESE installer
echo INSTALLING BACKEND
cd backend
echo 	installing prequisites
npm install
cls
echo INSTALLING BACKEND
echo 	compiling typescript
npm run tsc
cls
echo INSTALLING BACKEND
echo 	testrun
node build/server.js
cls
echo INSTALLING BACKEND
echo go to the website and make sure the website is awailable (errors may occur)
sleep 2
start http://localhost:3000/`
cls
echo INSTALLING BACKEND
echo press any key to continue
pause
cd..
cls
echo INSTALLING FRONTEND
cd frontend
echo 	installing angular
npm install -g @angular/cli
cls
echo INSTALLING FRONTEND
echo 	installing prequisites
npm install
cls
echo INSTALLING FRONTEND
echo compiling and running the angular
sleep 1
ng serve --open
ng add @angular/material
cls
echo DONE
echo press any key to continue
pause
