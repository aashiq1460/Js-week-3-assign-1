import express from 'express';
import {body} from 'express-validator';

import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(getUser)
  .post(
    body('email')
      .trim()
      .isEmail()
      .withMessage('must be a valid email'),

    body('username')
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('must be 3-20 characters')
      .isAlphanumeric()
      .withMessage('must contain only letters and numbers'),

    body('password')
      .trim()
      .isLength({min: 8})
      .withMessage('must be at least 8 characters'),

    validationErrors,
    postUser
  );

userRouter
  .route('/:id')
  .get(getUserById)
  .put(
    authenticateToken,

    body('name')
      .optional()
      .trim()
      .isLength({min: 2, max: 50})
      .withMessage('must be 2-50 characters'),

    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('must be 3-20 characters')
      .isAlphanumeric()
      .withMessage('must contain only letters and numbers'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('must be a valid email'),

    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('must be user or admin'),

    validationErrors,
    putUser
  )
  .delete(
    authenticateToken,
    deleteUser
  );

export default userRouter;