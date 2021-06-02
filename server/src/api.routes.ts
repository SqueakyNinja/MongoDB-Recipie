import express from "express";
import { getIngredients } from "./controllers/ingredientController";
import {
  addNewRecipe,
  getFavourite,
  // addNewRecipe,
  getRecipes,
  postFavourite,
  postNewUrl,
  // postFavourite,
  // getFavourite,
  // postNewUrl,
} from "./recipes/recipes.controller";
import { getAllUsers, getUserById, loginUser, newUser } from "./users/users.controllers";

// import { getAllUsers, getUserById, loginUser, newUser, removeUser, updateUser } from "./users/users.controllers";

const apiRouter = express.Router();

apiRouter.get("/users", getAllUsers);

apiRouter.get("/users/:user_id", getUserById);

apiRouter.post("/users/signup", newUser);

apiRouter.post("/users/login", loginUser);

apiRouter.get("/recipes", getRecipes);

apiRouter.post("/recipes/add", addNewRecipe);

apiRouter.post("/recipes/update", postNewUrl);

apiRouter.route("/recipes/favourite").post(postFavourite).get(getFavourite);

apiRouter.get("/ingredients", getIngredients);

export default apiRouter;
