import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  id: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
});

export const Users = mongoose.model("Users", usersSchema);
