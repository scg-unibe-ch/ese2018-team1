@echo off
title ESE installer
echo INSTALLING BACKEND
cd backend
echo 	installing prequisites
npm install
echo 	compiling typescript
npm run tsc
echo 	testrun
node build/server.js
echo go to the website and make sure the website is awailable (errors may occur)
sleep 2
start http://localhost:3000/`
echo press any key to continue
pause
cd..
cls
echo INSTALLING FRONTEND
cd frontend
echo 	installing prequisites
npm install
echo compiling and running the angular
sleep 1
ng serve --open
ng add @angular/material
cls
echo DONE
echo press any key to continue
pause
