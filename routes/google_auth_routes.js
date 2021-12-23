const Router = require('express').Router();

const { googleAuth } = require('../controllers/google_auth_controller');

Router.get('/google', googleAuth);

module.exports = Router;
