import mongoose from 'mongoose';
import logger from 'color-log';
import { uri } from '@Config/database';

/** Object to interact with database connection */
const Database = {
  connect: () => mongoose.connect(uri),
};

/** Connection events */
// When successfully connected
mongoose.connection.on('connected', () => {
  logger.info(`Mongoose default connection open to ${uri}`);
});

// If the connection throws an error
mongoose.connection.on('error', err => {
  logger.error(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

export default Database;
