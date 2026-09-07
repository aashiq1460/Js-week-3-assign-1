import express from 'express';
import multer from 'multer';

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

const upload = multer({dest: 'uploads/'});

catRouter.route('/').get(getCat);

catRouter.post('/', upload.single('cat'), postCat);

catRouter.get('/user/:id', getCatsByUserId);

catRouter
  .route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;