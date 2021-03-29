import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { FixedSizeList } from "react-window";
import { Paper } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Search from "../MealGenerator/Search";
import { CuisineData, DietData, TypeData } from "./FilterData";
import styles from "./BrowseRecipe.module.scss";
import axios from "axios";
import MealGrid from "../MealGenerator/MealGrid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const BrowseRecipe = () => {
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");

  const fetchRecipes = async () => {
    const result = await axios(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          apiKey: "34a95b9efbbe41dbaa0ba4b9d0d76287",
          // apiKey: "8080ada856dd4f439b4a065ae353d836",
          query: query,
          number: 2,
          sort: "popularity",
          type: type,
          cuisine: cuisine,
          diet: diet,
        },
      }
    );
    setRecipes(result.data.results);
    /*const savedRecipes = await getAllRecipes("", false, query);
    const savedApiRecipes = savedRecipes.recipes
      .filter((recipe) => recipe.apiId !== null)
      .map((recipe) => recipe.apiId);
    const filteredRecipes = result.data.results.filter((recipe) => {
      return savedApiRecipes.includes(recipe.id) === false;
    });
    const sortedRecipes = [...filteredRecipes, ...savedRecipes.recipes].sort();
    console.log(sortedRecipes);
    setRecipes(sortedRecipes);*/
  };

  useEffect(() => {
    if (query.length > 0) {
      const timeoutVar = setTimeout(() => {
        fetchRecipes();
      }, 500);

      return () => clearTimeout(timeoutVar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <div className={styles.browseContainer}>
      <div className={styles.searchBox}>
        <Search query={query} setQuery={setQuery} />
        <button onClick={() => console.log(recipes)}>klicka</button>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.filters}>
          <Paper className={styles.filterPaper}>
            <h1>Filter your search</h1>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Type</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <List>
                    {TypeData.map((value) => {
                      const labelId = `checkbox-list-label-${value.value}`;

                      return (
                        <ListItem
                          key={value.value}
                          role={undefined}
                          dense
                          button
                          onClick={handleToggle(value)}
                          className={styles.eachListItems}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(value) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                              className={styles.eachListItemsCheckbox}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={value.title} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Cuisine</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <List>
                    {CuisineData.map((value) => {
                      const labelId = `checkbox-list-label-${value.value}`;

                      return (
                        <ListItem
                          key={value.value}
                          role={undefined}
                          dense
                          button
                          onClick={handleToggle(value)}
                          className={styles.eachListItems}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(value) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                              className={styles.eachListItemsCheckbox}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={value.title} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Diet</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <List>
                    {DietData.map((value) => {
                      const labelId = `checkbox-list-label-${value.value}`;

                      return (
                        <ListItem
                          key={value}
                          role={undefined}
                          dense
                          button
                          onClick={handleToggle(value)}
                          className={styles.eachListItems}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checked.indexOf(value) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
                              className={styles.eachListItemsCheckbox}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={value.title} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>{" "}
        </div>
        <div className={styles.searchResults}>
          <MealGrid recipes={recipes} />
        </div>
      </div>
    </div>
  );
};

export default BrowseRecipe;
