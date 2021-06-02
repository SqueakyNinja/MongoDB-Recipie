import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Paper } from "@material-ui/core";
import RecipeDetails from "../RecipeDetails";
import styles from "./FetchRecipeDetails.module.scss";
import { getAllRecipes } from "../../db/recipes";

const FetchRecipeDetails = () => {
  const recipeId = useParams().id;
  const apiKey = "8080ada856dd4f439b4a065ae353d836";

  const [recipe, setRecipe] = useState({});

  const fetchRecipe = async () => {
    if (recipeId.length === 24) {
      const result = await getAllRecipes("", false, "", recipeId);
      setRecipe(result[0]);
    } else {
      const result = await axios(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
      setRecipe(result.data);
    }
  };

  useEffect(() => {
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper className={styles.paper}>
      <RecipeDetails recipe={recipe} />
    </Paper>
  );
};

export default FetchRecipeDetails;
