import express from 'express';
import {body} from 'express-validator';

import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
import {upload} from '../../middlewares/upload.js';

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter
  .route('/')
  .get(getCat)
  .post(
    authenticateToken,
    upload.single('cat'),

    body('cat_name')
      .trim()
      .isLength({min: 3, max: 50})
      .withMessage('must be 3-50 characters'),

    body('weight')
      .isFloat()
      .withMessage('must be a number'),

    body('owner')
      .isInt()
      .withMessage('must be an integer'),

    body('birthdate')
      .isISO8601()
      .withMessage('must be a valid date'),

    validationErrors,
    postCat
  );

catRouter.get('/user/:id', getCatsByUserId);

catRouter
  .route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,

    body('cat_name')
      .optional()
      .trim()
      .isLength({min: 3, max: 50})
      .withMessage('must be 3-50 characters'),

    body('weight')
      .optional()
      .isFloat()
      .withMessage('must be a number'),

    body('owner')
      .optional()
      .isInt()
      .withMessage('must be an integer'),

    body('filename')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('must not be empty'),

    body('birthdate')
      .optional()
      .isISO8601()
      .withMessage('must be a valid date'),

    validationErrors,
    putCat
  )
  .delete(
    authenticateToken,
    deleteCat
  );

export default catRouter;