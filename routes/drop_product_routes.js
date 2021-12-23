const Router = require('express').Router();

const {
  getDrops,
  createDrop,
  deleteDrop,
  updateDrop,
  getOneDrop,
  getUserDrops,
} = require('../controllers/drop_product_controller');

Router.get('/', getDrops);
Router.get('/user', getUserDrops);
Router.get('/:id', getOneDrop);
Router.post('/', createDrop);
Router.put('/:id', updateDrop);
Router.delete('/:id', deleteDrop);

module.exports = Router;
