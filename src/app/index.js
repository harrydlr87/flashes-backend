import express from 'express';
import path from 'path';
import logger from 'morgan';
import boom from 'express-boom';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Resources from '../resources';
import Server from './server';
import MongoDB from './database';
import allowCrossDomain from './middleware/allow-cross-domain';

// Create Express instance Express
const app = express();

// Set up initial middleware group
app.use(allowCrossDomain);
app.use(boom());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to the database
MongoDB.connect();

// Set resources middleware
Resources(app);

// Start http Server
Server(app);

