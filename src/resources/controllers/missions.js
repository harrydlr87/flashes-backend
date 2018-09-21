import express from 'express';
import Mission from '../models/mission';

export default express.Router()
  .get('/', (req, res, next) => {
    Mission.find((err, missions) => {
      if (err) return next(err);
      return res.json(missions);
    });
  });
