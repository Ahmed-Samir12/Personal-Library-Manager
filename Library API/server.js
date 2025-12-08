import mongoose from 'mongoose';
import app from './app.js';

const connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Data Base connected successfully');
  } catch (err) {
    console.log(err.message);
  }
};

connection();

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}`);
});
