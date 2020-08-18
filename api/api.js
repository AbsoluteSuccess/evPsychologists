const express = require('express');
const apiRouter = express.Router();

const accountRouter = require('./routes/account');
apiRouter.use('/account', accountRouter);
const reviewRouter = require('./routes/review');
apiRouter.use('/review', reviewRouter);

module.exports = apiRouter;