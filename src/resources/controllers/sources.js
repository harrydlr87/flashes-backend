import express from 'express';
import mongoose from 'mongoose';
import withUserAccess from '@Middleware/with-user-access';
import Source from '../models/source';
import User from '../models/user';
import { bayesianBlocks, HIDDiagram } from './mock/data';

export default express.Router()
  .get('/', withUserAccess, (req, res) => {
    const userId = req.userId;
    const filters = {};
    const { name, type, mission, subscribedSources } = req.query;
    const { badImplementation } = res.boom;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const sendPaginatedContent = filtersOptions => Source.paginate(filtersOptions, { page, limit, sort: { activityValue: -1 } })
      .then(sources => res.json(sources));

    if (name) {
      filters.source = { $regex: name, $options: 'ig' };
    }

    if (type) {
      filters.src_type = { $regex: type, $options: 'ig' };
    }

    if (mission) {
      filters.mission = { $regex: mission, $options: 'ig' };
    }

    if (subscribedSources && userId) {
      User.findById(userId, (err, user) => {
        if (err) {
          return badImplementation();
        }
        filters._id = { $in: user.subscribedSources };
        return sendPaginatedContent(filters);
      });
    } else {
      return sendPaginatedContent(filters);
    }
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
