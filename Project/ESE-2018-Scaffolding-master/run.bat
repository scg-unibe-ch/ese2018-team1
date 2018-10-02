cd backend
start "Backend" npm run tsc 
sleep 3
start "Backend" node build/server.js
cd..
cd frontend
start "Frontend" ng serve --open