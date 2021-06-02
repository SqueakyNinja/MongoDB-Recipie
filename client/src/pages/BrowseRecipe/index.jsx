import { useState, useEffect } from "react";
import Search from "../../components/Search";
import styles from "./BrowseRecipe.module.scss";
import axios from "axios";
import MealGrid from "../../components/MealGrid";
import Filter from "./Filter";
import { useStore } from "../../store";
import { Paper } from "@material-ui/core";
import { getAllRecipes } from "../../db/recipes";
import { matchSorter } from "match-sorter";

const BrowseRecipe = () => {
  const [checked, setChecked] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const { query, setQuery } = useStore();
  const [type, setType] = useState([]);
  const [cuisine, setCuisine] = useState([]);
  const [diet, setDiet] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);

      switch (value.param) {
        case "type":
          setType([...type, value.value]);
          break;

        case "cuisine":
          setCuisine([...cuisine, value.value]);
          break;

        case "diet":
          setDiet([...diet, value.value]);
          break;

        default:
          break;
      }
    } else {
      newChecked.splice(currentIndex, 1);

      switch (value.param) {
        case "type":
          const newTypes = type.filter((x) => x !== value.value);
          setType(newTypes);
          break;

        case "cuisine":
          const newCuisines = cuisine.filter((x) => x !== value.value);
          setCuisine(newCuisines);
          break;

        case "diet":
          const newDiets = diet.filter((x) => x !== value.value);
          setDiet(newDiets);
          break;
        default:
          break;
      }
    }

    setChecked(newChecked);
  };

  const fetchRecipes = async () => {
    const typeString = type.join(",");
    const dietString = diet.join(",");
    const cuisineString = cuisine.join(",");

    const result = await axios("https://api.spoonacular.com/recipes/complexSearch", {
      params: {
        apiKey: "34a95b9efbbe41dbaa0ba4b9d0d76287",
        // apiKey: "8080ada856dd4f439b4a065ae353d836",
        query: query,
        number: 8,
        sort: "popularity",
        type: typeString,
        diet: dietString,
        cuisine: cuisineString,
      },
    });
    if (query.length === 0) {
      return setRecipes(result.data.results);
    } else {
      const savedRecipes = await getAllRecipes("", false, query);
      const savedApiRecipes = savedRecipes.filter((recipe) => recipe.apiId !== null);
      const filteredRecipes = result.data.results.filter(
        (recipe) => savedApiRecipes.map((recipe) => recipe.apiId).includes(recipe._id) === false
      );
      const allRecipes = [...filteredRecipes, ...savedRecipes];
      const results = (options, query) => matchSorter(options, query, { keys: ["title"] });
      setRecipes(results(allRecipes, query));
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      const timeoutVar = setTimeout(() => {
        fetchRecipes();
      }, 500);

      return () => clearTimeout(timeoutVar);
    } else {
      fetchRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, checked]);

  return (
    <Paper elevation={3} className={styles.browseContainer}>
      <div className={styles.searchBox}>
        <Search query={query} setQuery={setQuery} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.filters}>
          <Filter handleToggle={handleToggle} checked={checked} />
        </div>
        <div className={styles.searchResults}>
          <MealGrid recipes={recipes} />
        </div>
      </div>
    </Paper>
  );
};

export default BrowseRecipe;
