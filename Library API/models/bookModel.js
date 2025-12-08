import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'A book must have author'],
      trim: true,
    },
    pages: {
      type: Number,
      min: [1, 'Page must be at least 1'],
    },
    genre: {
      type: String,
      enum: {
        values: [
          'fiction',
          'non-fiction',
          'science',
          'biography',
          'historical',
          'other',
        ],
        default: 'other',
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be between 1-5'],
      max: [5, 'Rating must be between 1-5'],
    },
    notes: String,
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    dateFinished: Date,
  },
  {
    timestamps: true,
  }
);

bookSchema.pre('save', function (next) {
  if (this.isRead && !this.dateFinished) {
    this.dateFinished = Date.now();
  }

  if (this.rating && !this.isRead) {
    return next(new Error("Cannot rate a book that hasn't been read"));
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
