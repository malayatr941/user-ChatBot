import mongoose, { ConnectOptions } from 'mongoose';
let database: mongoose.Connection;

export const connect = async () => {
  // add your own uri below
  if (database) {
    return;
  }
  await mongoose
    .connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.log(`Database connection failed`, err);
    });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
