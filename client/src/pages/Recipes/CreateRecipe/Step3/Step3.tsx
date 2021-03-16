import styles from "../index.module.scss";
import produce from "immer";
import { TextField, Button } from "@material-ui/core";
import { RecipeProps } from "../types";
import SortableListStep3 from "./SortableListStep3";
import { ChangeEvent, useState } from "react";

const Step3 = ({ recipe, setRecipe }: RecipeProps) => {
  const [firstAdd, setFirstAdd] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [step, setStep] = useState("");

  const addStep = () => {
    if (step.length > 0) {
      const newInstruction = {
        number: recipe.analyzedInstructions[0].steps.length + 1,
        step,
      };
      const updatedRecipe = produce(recipe, (newRecipe) => {
        if (firstAdd) {
          setFirstAdd(false);
          newRecipe.analyzedInstructions[0].steps[0].step = step;
          newRecipe.analyzedInstructions[0].steps[0].number = 1;
        } else {
          newRecipe.analyzedInstructions[0].steps.push(newInstruction);
        }
      });

      setRecipe(updatedRecipe);
      setStep("");
    } else {
      // setSnackbar("Please enter instructions in the field below", "error")
    }
  };

  return (
    <div>
      <div className="Step3">
        <TextField
          variant="outlined"
          label="Add Instructions"
          value={step}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setStep(e.target.value)}
        />

        <Button
          color="primary"
          variant="contained"
          className={styles.secondaryButton}
          onClick={addStep}
          disabled={editMode}
        >
          Add step
        </Button>
      </div>
      <div>
        {recipe.analyzedInstructions && (
          <SortableListStep3 recipe={recipe} setRecipe={setRecipe} editMode={editMode} setStep={setStep} />
        )}
        <Button variant="contained" color="primary" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done" : "Edit order"}
        </Button>
      </div>
    </div>
  );
};

export default Step3;