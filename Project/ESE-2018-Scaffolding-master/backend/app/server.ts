// import everything from express and assign it to the express variable
import express from 'express';
import ExpressSession from 'express-session';
const cors = require('cors');

// import all the controllers. If you add a new controller, make sure to import it here as well.
import {JobController, UserController} from './controllers';
import {Sequelize} from 'sequelize-typescript';
import {Job} from './models/job.model';
import {User} from './models/user.model';

const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});
sequelize.addModels([Job, User]);

// create a new express application instance
const app: express.Application = express();
app.use(express.json());

app.use(cors({origin: [
    'http://localhost:4200'
  ], credentials: true}));

app.use(ExpressSession({
  secret: 'omfg, its a secret!',
  resave: false,
  saveUninitialized: true
}));

// define the port the express app will listen on
let port = 3000;
if (process.env.PORT !== undefined) {
  port = parseInt(process.env.PORT);
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/job', JobController);
app.use('/login', UserController);


sequelize.sync().then(() => {
// start serving the application on the given port
  app.listen(port, '0.0.0.0', () => {
    // success callback, log something to console as soon as the application has started
    console.log(`Listening at http://localhost:${port}/`);
  });
});
