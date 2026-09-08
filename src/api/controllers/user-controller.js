import bcrypt from 'bcrypt';

import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const result = await addUser(req.body);

    if (!result) {
      const error = new Error('Could not add user');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      error.status = 409;
    }

    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    if (
      loggedInUser.user_id !== userId &&
      loggedInUser.role !== 'admin'
    ) {
      const error = new Error('Not allowed to update this user');
      error.status = 403;
      return next(error);
    }

    const result = await modifyUser(req.body, req.params.id);

    if (!result) {
      const error = new Error('Could not update user');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'User updated.',
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    if (
      loggedInUser.user_id !== userId &&
      loggedInUser.role !== 'admin'
    ) {
      const error = new Error('Not allowed to delete this user');
      error.status = 403;
      return next(error);
    }

    const result = await removeUser(req.params.id);

    if (!result) {
      const error = new Error('Could not delete user');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'User deleted.',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
};