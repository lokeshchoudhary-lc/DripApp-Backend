const Drop = require('../models/Drop_Product_Model');

module.exports = {
  getDrops: async (req, res, next) => {
    try {
      const { category, date } = req.query;
      let sort = req.query.sort;
      let page = parseInt(req.query.page);

      if (sort === 'latest') {
        sort = 'dropTime';
      } else if (sort === 'old') {
        sort = '-dropTime';
      } else {
        sort = '';
      }

      if (!page) {
        page = 1;
      }

      const size = 20;
      const skip = (page - 1) * size;
      const filtersBody = {};

      if (category) {
        filtersBody.dropCategory = category;
      }
      if (date) {
        filtersBody.dropDate = date;
      }
      const drops = await Drop.find(filtersBody)
        .limit(20)
        .skip(skip)
        .sort(sort)
        .lean()
        .exec();
      res.send(drops);
    } catch (error) {
      next(error);
    }
  },
  getUserDrops: async (req, res, next) => {
    try {
      const { category, date } = req.query;
      let sort = req.query.sort;
      const { user_id } = req.payload;
      let page = parseInt(req.query.page);
      const filtersBody = {};

      if (sort === 'latest') {
        sort = 'dropTime';
      } else if (sort === 'old') {
        sort = '-dropTime';
      } else {
        sort = '';
      }

      filtersBody.createdBy = user_id;

      if (category) {
        filtersBody.dropCategory = category;
      }
      if (date) {
        filtersBody.dropDate = date;
      }

      if (!page) {
        page = 1;
      }

      const size = 20;
      const skip = (page - 1) * size;

      const drops = await Drop.find(filtersBody)
        .limit(20)
        .skip(skip)
        .sort(sort)
        .lean()
        .exec();
      res.send(drops);
    } catch (error) {
      next(error);
    }
  },
  createDrop: async (req, res, next) => {
    try {
      if (!req.body) {
        return createError.BadRequest('No Body Provided');
      }
      const { user_id } = req.payload;
      req.body.createdBy = user_id;
      const drop = new Drop(req.body);
      await drop.save();
      res.send(drop);
    } catch (error) {
      next(error);
    }
  },
  getOneDrop: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        return createError.BadRequest('No Parameter Provided');
      }
      const drop = await Drop.findById(id).lean().exec();
      if (!drop) {
        return res.status(404).send('No Data Found');
      }
      res.send(drop);
    } catch (error) {
      next(error);
    }
  },
  deleteDrop: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        return createError.BadRequest('No Paramter Provided');
      }
      await Drop.findByIdAndDelete(id).lean().exec();
      res.send('Drop Deleted Successfully');
    } catch (error) {
      next(error);
    }
  },
  updateDrop: async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!id) {
        return createError.BadRequest('No Paramter Provided');
      }
      if (!req.body) {
        return createError.BadRequest('No Body Provided');
      }

      const drop = await Drop.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        lean: true,
        runValidators: true,
      }).exec();

      res.send(drop);
    } catch (error) {
      next(error);
    }
  },
};
