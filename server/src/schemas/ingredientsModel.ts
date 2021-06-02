import mongoose, { Schema } from "mongoose";

const ingredientsSchema = new Schema({
  id: { type: String },
  name: { type: String },
  api_id: { type: String },
});

export const Ingredients = mongoose.model("Ingredients", ingredientsSchema);
