// import privateAccess from '@Middleware/private-access';
import Missions from './controllers/missions';

export default function (app) {
  app.use('/api/v1/missions', Missions);
}
