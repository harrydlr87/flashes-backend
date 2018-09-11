import express from 'express';
import Module from '../models/mission';

export default express.Router()
  .get('/', (req, res, next) => {
    Module.find((err, missions) => {
      if (err) return next(err);
      return res.json(missions);
    });
  });
