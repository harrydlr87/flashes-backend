// import privateAccess from '@Middleware/private-access';
import Missions from './controllers/missions';
import Sources from './controllers/sources';

export default function (app) {
  app.use('/api/v1/missions', Missions);
  app.use('/api/v1/sources', Sources);
}
