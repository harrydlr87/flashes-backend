import express from 'express';
import Source from '../models/source';
import { lightCurves, bayesianBlocks, HIDDiagram } from './mock/data';

export default express.Router()
  .get('/', (req, res) => {
    const filters = {};
    const { name, type, mission } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (name) {
      filters.source = { $regex: name, $options: 'ig' };
    }

    if (type) {
      filters.src_type = { $regex: type, $options: 'ig' };
    }

    if (mission) {
      filters.tool_name = { $regex: mission, $options: 'ig' };
    }

    Source.paginate(filters, { page, limit, sort: { activityValue: -1 } }).then(sources => res.json(sources));
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
  })
  .get('/field/:name', (req, res, next) => {
    Source.find().distinct(req.params.name, (err, fields) => {
      if (err) return next(err);
      return res.json(fields);
    });
  });
