cd backend
start "Backend" node build/server.js
cd..
cd frontend
start "Frontend" ng serve --open