import Book from '../models/bookModel.js';

export const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;

    const sort = req.query.sort || '-dateAdded';

    const books = await Book.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      status: 'success',
      result: books.length,
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Book not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Book not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'No book found with that ID',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getReadBooks = async (req, res) => {
  try {
    const read = await Book.find({ isRead: true });

    const stats = await Book.aggregate([
      {
        $match: { isRead: { $eq: true } },
      },
      {
        $group: {
          _id: null,
          totalPagesRead: { $sum: '$pages' },
        },
      },
      {
        $project: { _id: 0 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      result: read.length,
      data: {
        stats,
        books: read,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const search = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json({
      status: 'success',
      result: search.length,
      data: {
        books: search,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const readBooks = await Book.countDocuments({ isRead: true });
    const unreadBooks = totalBooks - readBooks;

    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
      {
        $project: {
          _id: 0,
          avgRating: { $round: ['$avgRating', 2] },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalBooks,
        readBooks,
        unreadBooks,
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
