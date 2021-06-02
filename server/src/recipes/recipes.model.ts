import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema({
  id: { type: String },
  title: { type: String },
  image: { type: String },
  analyzedInstructions: { type: String },
  dishTypes: { type: String },
  sourceName: { type: String },
  servings: { type: String },
  readyInMinutes: { type: String },
  extendedIngredients: { type: String },
  apiId: { type: String },
  createdBy: { type: String },
});

export const Recipes = mongoose.model("Recipes", recipeSchema);
