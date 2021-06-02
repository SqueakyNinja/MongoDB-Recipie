import asyncHandler from "express-async-handler";
import { Ingredients } from "../schemas/ingredientsModel";

export const getIngredients = asyncHandler(async (req, res) => {
  try {
    console.log(Ingredients);
    const ingredients = await Ingredients.find({});
    res.send({ ingredients });
  } catch (err) {
    console.log(err);
  }
});
