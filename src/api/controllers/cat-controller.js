import {
  addCat,
  findCatById,
  findCatsByUserId,
  listAllCats,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res, next) => {
  try {
    const cats = await listAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      const error = new Error('Cat not found');
      error.status = 404;
      return next(error);
    }

    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }

    const catData = {
      ...req.body,
      filename: req.file.filename,
    };

    const result = await addCat(catData);

    if (!result) {
      const error = new Error('Could not add cat');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New cat added.',
      result,
    });
  } catch (error) {
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const result = await modifyCat(
      req.body,
      req.params.id,
      res.locals.user
    );

    if (!result) {
      const error = new Error('Not allowed to update this cat');
      error.status = 403;
      return next(error);
    }

    res.json({
      message: 'Cat updated.',
    });
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const result = await removeCat(
      req.params.id,
      res.locals.user
    );

    if (!result) {
      const error = new Error('Not allowed to delete this cat');
      error.status = 403;
      return next(error);
    }

    res.json({
      message: 'Cat deleted.',
    });
  } catch (error) {
    next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  try {
    const cats = await findCatsByUserId(req.params.id);
    res.json(cats);
  } catch (error) {
    next(error);
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