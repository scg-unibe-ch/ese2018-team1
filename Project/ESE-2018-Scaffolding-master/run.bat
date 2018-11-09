cd frontend
start "Frontend" ng serve --open
cd..
cd backend
start "Backend" npm run tsc 
sleep 5
start "Backend" node build/server.js

