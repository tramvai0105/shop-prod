import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    image: String,
  });

export const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  privileges: Boolean,
});

export const User = mongoose.model('User', userSchema);