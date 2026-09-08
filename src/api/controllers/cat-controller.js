import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);

    if (cat) {
      res.json(cat);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const postCat = async (req, res) => {
  try {
    console.log('body:', req.body);
    console.log('file:', req.file);

    const catData = {
      ...req.body,
      filename: req.file ? req.file.filename : null,
    };

    const result = await addCat(catData);

    if (result) {
      res.status(201).json({
        message: 'New cat added.',
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

const putCat = async (req, res) => {
  try {
    const result = await modifyCat(
      req.body,
      req.params.id,
      res.locals.user
    );

    if (result) {
      res.json({
        message: 'Cat updated.',
      });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const deleteCat = async (req, res) => {
  try {
    const result = await removeCat(
      req.params.id,
      res.locals.user
    );

    if (result) {
      res.json({
        message: 'Cat deleted.',
      });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
const getCatsByUserId = async (req, res) => {
  try {
    const cats = await findCatsByUserId(req.params.id);

    res.json(cats);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
};