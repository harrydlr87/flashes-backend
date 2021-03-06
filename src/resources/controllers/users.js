import express from 'express';
import bcrypt from 'bcryptjs';
import privateAccess from '@Middleware/private-access';
import { createToken } from '@Common/utils/access';
import { code } from '@Common/enums/mongo-error-codes';
import User from '../models/user';

export default express.Router()
  .post('/register', (req, res) => {
    const { password, name, email } = req.body;
    const { forbidden, badImplementation } = res.boom;

    User.create({ name, email, password: bcrypt.hashSync(password, 8) },
      (err, user) => {
        if (err) {
          return err.code === code.DUPLICATED_KEY
            ? forbidden('Email already registered')
            : badImplementation();
        }
        // Create a token
        const token = createToken({ id: user._id });
        return res.status(200).send({ auth: true, token });
      });
  })
  .post('/login', (req, res) => {
    const { password, email } = req.body;
    const { notFound, badImplementation, unauthorized } = res.boom;

    User.findOne({ email }, (err, user) => {
      if (err) {
        return badImplementation();
      }
      if (!user) {
        return notFound();
      }

      // Compare the received password with the saved one
      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return unauthorized();
      }

      // If the credentials are valid return the access token
      const token = createToken({ id: user._id });
      return res.status(200).send({ auth: true, token });
    });
  })
  .post('/unsubscribe', privateAccess, (req, res) => {
    const userId = req.userId;
    const { sourceId } = req.body;
    const { badImplementation, badRequest } = res.boom;

    if (!sourceId) {
      return badRequest();
    }

    User.findOneAndUpdate({ _id: userId }, { $pull: { subscribedSources: sourceId } }, err => {
      if (err) {
        return badImplementation();
      }

      return res.status(200).send({ sourceId });
    });
  })
  .post('/subscribe', privateAccess, (req, res) => {
    const userId = req.userId;
    const { sourceId } = req.body;
    const { badImplementation, badRequest } = res.boom;

    if (!sourceId) {
      return badRequest();
    }

    User.findOneAndUpdate({ _id: userId }, { $push: { subscribedSources: sourceId } }, err => {
      if (err) {
        return badImplementation();
      }

      return res.status(200).send({ sourceId });
    });
  })
  .get('/user-data', privateAccess, (req, res) => {
    const userId = req.userId;
    const { badImplementation } = res.boom;
    User.findById(userId, (err, user) => {
      if (err) {
        return badImplementation();
      }

      return res.status(200).send(user);
    });
  })
  .get('/subscriptions', privateAccess, (req, res) => {
    const userId = req.userId;
    const { notFound, badImplementation } = res.boom;

    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return badImplementation();
      }
      if (!user) {
        return notFound();
      }

      const { subscribedSources } = user;
      return res.status(200).send({ subscribedSources });
    });
  });
