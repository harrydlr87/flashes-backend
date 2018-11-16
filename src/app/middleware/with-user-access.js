import { getHeader } from '@Common/utils/request';
import { verifyToken } from '@Common/utils/access';

function withUserAccess(req, res, next) {
  const token = getHeader(req, 'x-access-token');
  const { forbidden } = res.boom;
  if (!token) {
    return next();
  }
  return verifyToken(token, (err, decoded) => {
    if (err) {
      return forbidden('Failed to authenticate token.');
    }
    // Save user id to request for further usage
    req.userId = decoded.id;
    return next();
  });
}

export default withUserAccess;
