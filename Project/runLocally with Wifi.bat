start startWifi.bat
cd frontend
start "Frontend" ng serve --host 0.0.0.0 --port 80 --open --disable-host-check
cd..
cd backend
start "Backend" npm run tsc 
sleep 10
start "Backend" node build/server.js

