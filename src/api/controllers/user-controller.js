import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postUser = async (req, res) => {
  try {
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
    res.sendStatus(500);
  }
};

const putUser = async (req, res) => {
  try {
    const result = await modifyUser(req.body, req.params.id);

    if (result) {
      res.json({message: 'User item updated.'});
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await removeUser(req.params.id);

    if (result) {
      res.json({message: 'User item deleted.'});
    } else {
      res.sendStatus(404);
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