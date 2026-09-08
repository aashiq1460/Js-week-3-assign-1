import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

import bcrypt from 'bcrypt';

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const result = await addUser(req.body);

    if (result) {
      res.status(201).json({
        message: 'New user added.',
        result,
      });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        message: 'Username already exists.',
      });
      return;
    }

    res.sendStatus(500);
  }
};

const putUser = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    if (
      loggedInUser.user_id !== userId &&
      loggedInUser.role !== 'admin'
    ) {
      return res.sendStatus(403);
    }

    const result = await modifyUser(req.body, req.params.id);

    if (result) {
      res.json({
        message: 'User updated.',
      });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
const deleteUser = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    if (
      loggedInUser.user_id !== userId &&
      loggedInUser.role !== 'admin'
    ) {
      return res.sendStatus(403);
    }

    const result = await removeUser(req.params.id);

    if (result) {
      res.json({
        message: 'User deleted.',
      });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
};