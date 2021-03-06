export interface Recipe {
  id?: string;
  title: string;
  sourceName: string;
  servings: number;
  readyInMinutes: number;
  extendedIngredients: ExtendedIngredient[];
  image: string;
  dishTypes: string[];
  analyzedInstructions: AnalysedInstructions[];
  createdBy?: string;
  apiId?: number;
}

export interface ExtendedIngredient {
  name: string;
  measures: {
    metric: {
      amount: number;
      unitShort: string;
    };
  };
}
export interface AnalysedInstructions {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export type UserObj = Pick<User, "id" | "username">;

export type LoginRequest = Pick<User, "username" | "password">;

export type NewUser = Pick<User, "username" | "email" | "password">;
export interface UsersRecipesMap {
  id: string;
  userId: string;
  recipeId: string;
}

export interface IngredientsForRecipe {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  amount: number;
  unitsOfMeassure: string;
}
export interface Ingredients {
  id: string;
  name: string;
  api_id: string;
}
