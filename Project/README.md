# ESE 2018 Scaffolding
Welcome to the 2018 ESE course. You can use this scaffolding as a starting point for your group projects. It contains the following components:
- [frontend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/frontend): an Angular application
- [backend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/backend): a Node.js application written in TypeScript, using the express.js web framework 

## Prerequisites
- You should have [Node.js](https://nodejs.org/en/) and NPM installed (NPM is installed automatically with latest versions of Node.js) which are needed by both [frontend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/frontend) and [backend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/backend) projects. You can verify whether you have both by running `node -v` and `npm -v` in terminal or command prompt.
- You should have [Angular CLI](https://cli.angular.io/) globally installed on your machine.
- Get your WebStorm student license [from here](https://www.jetbrains.com/shop/eform/students) 

## Getting started
- Clone this repo on your machine and immediately delete `.git` folder.
- Decide among your team members, and create a new git repository on Github of your own. Push this project as an initial commit.
- [frontend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/frontend) and [backend](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/backend) contain instructions to set up the projects on your machines.
- We encourage you to use [WebStorm](https://www.jetbrains.com/webstorm/) as an IDE for this project. Once you clone the project to your machine, refere [this](https://www.jetbrains.com/help/webstorm/angular.html) tutorial, specifically section 'Starting with an existing Angular application' to open and use the project in WebStorm. 
- To install the prequisites for the front- and backend run the [intstall.bat](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/intstall.bat) file. Make sure you have installed [Node.js](https://nodejs.org/en/). When you installed angular and express you can run [run.bat](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/run.bat) to start up the Backend and Frontend. The Frontend will automatically start up the browser with the correct website. Make sure, that the node and ng commands are globally available. 
- To install the prequisites for the front- and backend run the [intstall.bat](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/intstall.bat) file. Make sure you have installed [Node.js](https://nodejs.org/en/). When you installed angular and express you can run [run.bat](https://github.com/scg-unibe-ch/ese2018-team1/tree/master/Project/ESE-2018-Scaffolding-master/run.bat) to start up the Backend and Frontend. The Frontend will automatically start up the browser with the correct website. Make sure, that the node and ng commands are globally available.
- To restart the backend just close the backend cmd and start the runBackend batch script.


## Understanding project structure
- The main project folder contains two subfolders- frontend and backend. These two are projects on their own which you will run independently. 
- The backend folder contains express project that serves as a REST API, exposes endpoints to accept HTTP requests. For received HTTP requests, it in turn returns JSON data.
- The frontend folder contains Angular project, which makes HTTP requests to the backend and processes the JSON data received i.e. make changes if required and display it on the UI.
- Projects are separated in this way because in the future one can easily replace either of them if the team decides to use another technology e.g. React JS for frontend or Django REST framework for backend.



## run it in your local network
to run it any access the website from within your network, please refer to the "lokal hosten.txt" file
