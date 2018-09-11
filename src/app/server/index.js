import http from 'http';
import logger from 'color-log';
import { port } from '@Config/server';

/** Starts the http process with the given Express application instance */
export default function (app) {
  app.set('port', port);
  http.createServer(app).listen(port, () => logger.info(`Server listening to ${port}`));
}
