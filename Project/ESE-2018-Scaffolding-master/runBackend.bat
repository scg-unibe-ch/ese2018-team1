cd backend
start "Backend" npm run tsc 
sleep 3
start "Backend" node build/server.js