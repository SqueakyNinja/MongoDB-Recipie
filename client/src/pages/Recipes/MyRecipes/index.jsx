import { useEffect, useState } from "react";
import { getAllRecipes } from "../../../db/recipes";
import MealGrid from "../../../components/MealGrid";
import { useStore } from "../../../store";
import styles from "./index.module.scss";
import { Paper } from "@material-ui/core";
import { useHistory } from "react-router";

const MyRecipes = () => {
  const { currentUser, setSnackbar } = useStore();
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const myData = await getAllRecipes(currentUser.id);
        setMyRecipes(myData);
        const savedData = await getAllRecipes(currentUser.id, true);

        setSavedRecipes(savedData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getRecipes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser.id.length === 0) {
      setSnackbar("Please login to use this feature", "info");
      history.push("/account/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (loading) return <> </>;

  return (
    <Paper className={styles.myRecipesContainer}>
      <div>
        <h2 className={styles.header}>Created Recipes</h2>
        {myRecipes.length > 0 ? <MealGrid recipes={myRecipes} /> : <p>You have not created any recipes yet...</p>}
      </div>
      <div>
        <h2 className={styles.header}>Saved Recipes</h2>
        <MealGrid recipes={savedRecipes} />
      </div>
    </Paper>
  );
};

export default MyRecipes;
