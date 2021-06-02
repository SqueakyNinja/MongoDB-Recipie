import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "../index.module.scss";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button, TextField, FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import SortableList from "./SortableList";
import { useStore } from "../../../../store";
import { IngredientFromDb, RecipeStepProps } from "../types";
import { ExtendedIngredient } from "../../../../../../common";
import { combineClasses } from "../../../../utils";
import produce from "immer";
import { matchSorter } from "match-sorter";
import { getAllIngredients } from "../../../../db/ingredients";

const Step2 = ({ recipe, setRecipe, setExpanded, errors, setErrors }: RecipeStepProps) => {
  const { setSnackbar } = useStore();
  const [open, setOpen] = useState<boolean>(false);
  const [ingredientsOptions, setIngredientsOptions] = useState<IngredientFromDb[]>([]);
  const [unitShort, setUnitShort] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [editMode, setEditMode] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setUnitShort(e.target.value as string);
  };

  const handleIngredientChange = (e: ChangeEvent<{}>, value: string) => {
    if (value === "" || value.length < 3) {
      setOpen(false);
    } else if (value.length > 2 && !open) {
      setOpen(true);
    }
    setIngredient(value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleEditmode = () => {
    setEditMode(!editMode);
  };

  const addIngredient = () => {
    if (ingredient.length > 0) {
      const newAmount: number = Number(amount);
      const newIngredient: ExtendedIngredient = {
        name: ingredient,
        measures: {
          metric: {
            amount: newAmount,
            unitShort,
          },
        },
      };
      const updatedRecipe = produce(recipe, (newRecipe) => {
        if (recipe.extendedIngredients[0].name === "") {
          newRecipe.extendedIngredients[0] = newIngredient;
        } else {
          newRecipe.extendedIngredients.push(newIngredient);
        }
      });
      setRecipe(updatedRecipe);

      setIngredient("");
      setAmount("");
      setUnitShort("");
    } else {
      setSnackbar("Please enter an ingredient in the field below", "error");
    }
  };

  //IngredientsOptions:
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const result = await getAllIngredients();
        setIngredientsOptions(result.ingredients);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIngredients();
  }, []);

  const filterOptions = (options: IngredientFromDb[], state: FilterOptionsState<IngredientFromDb>) =>
    matchSorter(options, state.inputValue, { keys: ["name"] });

  return (
    <div className={styles.steps}>
      <div className="Step2">
        <Autocomplete
          forcePopupIcon={false}
          open={open}
          inputValue={ingredient}
          onInputChange={handleIngredientChange}
          onClose={() => {
            setOpen(false);
          }}
          filterOptions={filterOptions}
          getOptionSelected={(option: IngredientFromDb, value: IngredientFromDb) => option.name === value.name}
          getOptionLabel={(ingredient: any) => ingredient.name}
          options={ingredientsOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Ingredient"
              variant="outlined"
              name="name"
              InputProps={{
                ...params.InputProps,
                endAdornment: <>{params.InputProps.endAdornment}</>,
              }}
            />
          )}
        />

        <div className="Step2Measurement">
          <TextField
            className={styles.textfield}
            variant="outlined"
            label="Measurements, amount"
            type="number"
            name="amount"
            value={amount}
            onChange={handleAmountChange}
          />

          <FormControl variant="outlined" className={styles.textfield}>
            <InputLabel>Units</InputLabel>

            <Select label="Grouping" name="unitShort" value={unitShort} onChange={handleSelectChange}>
              {/* <MenuItem value="" disabled>
              Imperial
            </MenuItem>
            <MenuItem value="tsp">teaspoon (tsp)</MenuItem>
            <MenuItem value="tbsp">tablespoon (tbsp)</MenuItem>
            <MenuItem value="cup">cup (c)</MenuItem>
            <MenuItem value="oz">ounce (oz)</MenuItem>
            <MenuItem value="pt">pint (pt)</MenuItem>
            <MenuItem value="qt">quart (qt)</MenuItem>
            <MenuItem value="gal">gallon (gal)</MenuItem>
            <MenuItem value="lb">pound (lb)</MenuItem> */}
              <MenuItem value="" disabled>
                Metric
              </MenuItem>

              <MenuItem value="">None</MenuItem>
              <MenuItem value="tsp">teaspoon (tsp)</MenuItem>
              <MenuItem value="tbsp">tablespoon (tbsp)</MenuItem>
              <MenuItem value="ml">milliliter (ml)</MenuItem>
              <MenuItem value="cl">centiliter (cl)</MenuItem>
              <MenuItem value="dl">deciliter (dl)</MenuItem>
              <MenuItem value="l">liter (l)</MenuItem>
              <MenuItem value="g">grams (g)</MenuItem>
              <MenuItem value="kg">kilograms (kg)</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          color="primary"
          variant="contained"
          className={`${styles.secondaryButton} ${styles.addButton}`}
          onClick={addIngredient}
          disabled={editMode}
        >
          Add Ingredient
        </Button>
        <div className={styles.listOfIngredients}>
          {recipe.extendedIngredients && (
            <SortableList
              recipe={recipe}
              setRecipe={setRecipe}
              setIngredient={setIngredient}
              setAmount={setAmount}
              setUnitShort={setUnitShort}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          )}
        </div>

        <div className={styles.buttonContainer}>
          {recipe.extendedIngredients.length > 0 && recipe.extendedIngredients[0].name.length > 0 && (
            <Button
              className={combineClasses(styles.secondaryButton, styles.editButton, editMode && styles.doneButton)}
              variant="contained"
              onClick={handleEditmode}
            >
              {editMode ? "Done" : "Edit order"}
            </Button>
          )}

          <Button
            color="primary"
            variant="contained"
            className={`${styles.secondaryButton} ${styles.nextButton}`}
            onClick={() => setExpanded("panel3")}
            disabled={editMode}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
