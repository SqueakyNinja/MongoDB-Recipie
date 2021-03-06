import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import styles from "./app.module.scss";
import Settings from "./pages/Settings";
import { Paper } from "@material-ui/core";
import Account from "./pages/LoginSignup";
import Profile from "./pages/Profile";
import CreateRecipe from "./pages/Recipes/CreateRecipe";
import MyRecipes from "./pages/Recipes/MyRecipes";
import BrowseRecipe from "./pages/BrowseRecipe";
import FetchRecipeDetails from "./components/FetchRecipeDetails";

const Main = () => {
  return (
    <Paper className={styles.mainArea}>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/account/signup" component={Account} />
      <Route exact path="/account/login" component={Account} />
      <Route exact path="/recipes/create" component={CreateRecipe} />
      <Route exact path="/recipes/saved-recipes" component={MyRecipes} />
      <Route exact path="/recipe/:id" component={FetchRecipeDetails} />
      <Route exact path="/browse-recipe" component={BrowseRecipe} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/settings" component={Settings} />
    </Paper>
  );
};

export default Main;
