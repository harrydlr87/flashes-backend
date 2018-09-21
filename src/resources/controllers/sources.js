import express from 'express';
import Source from '../models/source';
import { lightCurves, bayesianBlocks, HIDDiagram } from './mock/data';

export default express.Router()
  .get('/', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    Source.paginate({}, { page, limit }).then(sources => res.json(sources));
  })
  .get('/:id', (req, res, next) => {
    Source.findById(req.params.id, (err, source) => {
      if (err) return next(err);

      const sourceData = {
        ...source._doc,
        data: {
          lightCurves,
          bayesianBlocks,
          HIDDiagram,
        },
      };
      return res.json(sourceData);
    });
  });

