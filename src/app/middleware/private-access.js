import { getHeader } from '@Common/utils/request';
import { verifyToken } from '@Common/utils/access';

function privateAccess(req, res, next) {
  const token = getHeader(req, 'x-access-token');
  const { forbidden, badRequest } = res.boom;
  if (!token) {
    return badRequest('No token provided.');
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

export default privateAccess;
