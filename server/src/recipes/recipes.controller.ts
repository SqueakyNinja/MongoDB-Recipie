import express from "express";
import { Recipe } from "../../../common";
import { RecipesResponse } from "../../../common/responses";
import { selectAllRecipes, tryAddRecipe, updateFavouriteStatus } from "./recipes.model";

export const allRecipes: express.RequestHandler<
  {},
  RecipesResponse,
  {},
  { userId: string; getSavedRecipes: string; searchStr: string }
> = async (req, res) => {
  const getSavedRecipes = req.query.getSavedRecipes === "true";
  const recipes = await selectAllRecipes(req.query.userId, getSavedRecipes, req.query.searchStr);

  res.send({ recipes });
};

export const addNewRecipe: express.RequestHandler<{}, {}, { recipe: Recipe }> = async (req, res) => {
  try {
    const reqNewRecipe = await tryAddRecipe(req.body.recipe);
    res.status(201).send({ reqNewRecipe });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const postFavourite: express.RequestHandler<
  {},
  {},
  { userId: string; recipeId?: string; apiId?: number }
> = async (req, res) => {
  try {
    const { userId, recipeId, apiId } = req.body;
    const favouriteStatus = await updateFavouriteStatus(userId, recipeId, apiId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};