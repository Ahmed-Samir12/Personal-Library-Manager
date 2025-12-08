import express from 'express';
import * as BookController from './../controllers/bookController.js';

const router = express.Router();

router.route('/status/read').get(BookController.getReadBooks);
router.route('/search').get(BookController.searchBooks);
router.route('/stats').get(BookController.getStats);

router
  .route('/')
  .get(BookController.getAllBooks)
  .post(BookController.createBook);

router
  .route('/:id')
  .get(BookController.getBook)
  .patch(BookController.updateBook)
  .delete(BookController.deleteBook);

export default router;
