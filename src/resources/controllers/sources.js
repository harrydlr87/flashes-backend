import express from 'express';
import mongoose from 'mongoose';
import Source from '../models/source';
import { bayesianBlocks, HIDDiagram } from './mock/data';

export default express.Router()
  .get('/', (req, res) => {
    const filters = {};
    const { name, type, mission, sources } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (name) {
      filters.source = { $regex: name, $options: 'ig' };
    }

    if (type) {
      filters.src_type = { $regex: type, $options: 'ig' };
    }

    if (mission) {
      filters.mission = { $regex: mission, $options: 'ig' };
    }

    if (sources) {
      filters._id = { $in: sources };
    }

    Source.paginate(filters, { page, limit, sort: { activityValue: -1 } }).then(sourcesData => res.json(sourcesData));
  })
  .get('/:id', (req, res, next) => {
    Source.findById(req.params.id, (err, source) => {
      if (err) return next(err);

      const sourceData = {
        ...source._doc,
        data: {
          lightCurves: source._doc.lc,
          bayesianBlocks,
          HIDDiagram,
        },
      };
      return res.json(sourceData);
    });
  })
  .post('/list', (req, res, next) => {
    const { sources } = req.body; // TODO refactor JSON parse
    const sourcesId = JSON.parse(sources).map(source => mongoose.Types.ObjectId(source));

    Source.find({ _id: { $in: sourcesId } }, { lc: 0 }, (err, sourcesData) => {
      if (err) return next(err);
      return res.json(sourcesData);
    });
  })
  .get('/field/:name', (req, res, next) => {
    Source.find().distinct(req.params.name, (err, fields) => {
      if (err) return next(err);
      return res.json(fields);
    });
  });
