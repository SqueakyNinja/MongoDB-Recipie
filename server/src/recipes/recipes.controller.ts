import axios from "axios";
import express from "express";
import { Mongoose } from "mongoose";
import { Recipe } from "../../../common";
import { RecipesResponse } from "../../../common/responses";
import { Recipes, UsersRecipesMap } from "./recipes.model";

export const getRecipes: express.RequestHandler<
  {},
  RecipesResponse,
  {},
  { userId: string; getSavedRecipes: string; searchStr: string; recipeId: string }
> = async (req, res) => {
  const getSavedRecipes = req.query.getSavedRecipes === "true";
  try {
    if (!!req.query.userId && !getSavedRecipes) {
      const recipes = await Recipes.find({ createdBy: req.query.userId });
      res.send({ recipes });
    } else if (!!req.query.userId && getSavedRecipes) {
      console.log("getting saved recipes");

      const recipes = await Recipes.aggregate([
        { $addFields: { recipe_id: { $toString: "$_id" } } },
        {
          $lookup: {
            from: "usersrecipesmaps",
            localField: "recipe_id",
            foreignField: "recipeId",
            as: "userRecipeMap",
          },
        },
        { $match: { userRecipeMap: { $elemMatch: { userId: req.query.userId } } } },
      ]);

      res.send({ recipes });
    } else if (!!req.query.searchStr.length) {
      const regex = new RegExp(`(^|[\s])(${req.query.searchStr})`, "gim");
      const recipes = await Recipes.find({ title: regex });
      res.send({ recipes });
    } else if (!!req.query.recipeId) {
      const recipes = await Recipes.find({ _id: req.query.recipeId });
      res.send({ recipes });
    } else {
      const recipes = await Recipes.find({});
      res.send({ recipes });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addNewRecipe: express.RequestHandler<{}, {}, { recipe: Recipe }> = async (req, res) => {
  try {
    const parsedRecipe = {
      title: req.body.recipe.title,
      image: req.body.recipe.image,
      analyzedInstructions: JSON.stringify(req.body.recipe.analyzedInstructions),
      dishTypes: JSON.stringify(req.body.recipe.dishTypes),
      sourceName: req.body.recipe.sourceName,
      servings: req.body.recipe.servings,
      readyInMinutes: req.body.recipe.readyInMinutes,
      extendedIngredients: JSON.stringify(req.body.recipe.extendedIngredients),
      createdBy: req.body.recipe.createdBy,
    };

    const newRecipe = await Recipes.create(parsedRecipe);
    console.log(newRecipe);
    const recipeId = newRecipe._id;
    res.status(201).send(recipeId);
  } catch (error) {
    res.status(400).send(JSON.stringify({ message: error.message }));
  }
};

export const postNewUrl: express.RequestHandler<{}, {}, { recipeId: string; newURL: string }> = async (req, res) => {
  try {
    const { recipeId, newURL } = req.body;
    const response = await Recipes.updateOne({ _id: recipeId }, { image: newURL });
    res.status(204).send({ status: "Image url updated." });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const postFavourite: express.RequestHandler<{}, {}, { userId: string; recipeId?: string; apiId?: number }> =
  async (req, res) => {
    try {
      const { userId, recipeId, apiId } = req.body;
      console.log(userId);
      console.log(recipeId);
      console.log(apiId);
      let fetchedRecipeId = recipeId;
      if (apiId) {
        const existingRecipe = await Recipes.find({ apiId: apiId });
        if (!!existingRecipe.length) {
          fetchedRecipeId = existingRecipe[0]._id;
          console.log(fetchedRecipeId);
        } else {
          const apiKey = "8080ada856dd4f439b4a065ae353d836";
          const { data } = await axios(`https://api.spoonacular.com/recipes/${apiId}/information?apiKey=${apiKey}`);
          const newRecipe = {
            title: data.title,
            sourceName: data.sourceName ? `${data.sourceName}, ${data.sourceUrl}` : data.sourceUrl,
            servings: data.servings,
            readyInMinutes: data.readyInMinutes,
            extendedIngredients: JSON.stringify(data.extendedIngredients),
            image: data.image,
            dishTypes: JSON.stringify(data.dishTypes),
            analyzedInstructions: JSON.stringify(data.analyzedInstructions),
            apiId,
          };
          const addRecipe = await Recipes.create(newRecipe);

          console.log(addRecipe);
          fetchedRecipeId = addRecipe._id;
        }
      }

      // Add or remove favourite recipe for a user

      const count = await UsersRecipesMap.find({ recipeId: fetchedRecipeId, userId });
      if (count.length) {
        await UsersRecipesMap.deleteOne({ recipeId: fetchedRecipeId, userId });
      } else {
        await UsersRecipesMap.create({ recipeId: fetchedRecipeId, userId });
      }
      res.status(201).send({ status: "added" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error.message });
    }
  };

export const getFavourite: express.RequestHandler<{}, {}, {}, { userId: string; recipeId?: string }> = async (
  req,
  res
) => {
  try {
    const { userId, recipeId } = req.query;
    const favouriteStatus = await UsersRecipesMap.find({ userId, recipeId });
    res.status(200).send({ status: favouriteStatus });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};
