import Missions from './controllers/missions';
import Sources from './controllers/sources';
import Users from './controllers/users';

export default function (app) {
  app.use('/api/v1/missions', Missions);
  app.use('/api/v1/sources', Sources);
  app.use('/api/v1/users', Users);
}
