cd frontend
start "Frontend" ng serve --host 0.0.0.0 --port 80 --open
cd..
cd backend
start "Backend" npm run tsc 
sleep 5
start "Backend" node build/server.js

