import express from 'express';
import bcrypt from 'bcryptjs';
import { createToken } from '@Common/utils/access';
import User from '../models/user';

export default express.Router()
  .post('/register', (req, res) => {
    const { password, name, email } = req.body;
    const { badImplementation } = res.boom;

    User.create({ name, email, password: bcrypt.hashSync(password, 8) },
      (err, user) => {
        if (err) {
          return badImplementation();
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
  });
