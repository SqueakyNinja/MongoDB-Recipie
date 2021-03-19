import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography, Button } from "@material-ui/core";
import styles from "./index.module.scss";
import Step1 from "./Step1/Step1";
import Step2 from "./Step2/Step2";
import Step3 from "./Step3/Step3";
import { sendRecipe } from "../../../api/recipes";
import { Recipe } from "../../../../../common";
import { useStore } from "../../../store";
import { useHistory } from "react-router";
import { Errors, FileWithPreview } from "./types";
import RecipeDetails from "../../../components/RecipeDetails/RecipeDetails";
import { combineClasses } from "../../../utils";
import ScanRecipe from "../ScanRecipe";
import { storage } from "../../../firebase";

const CreateRecipe = () => {
  const [openUpload, setOpenUpload] = useState(true);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { currentUser, setSnackbar } = useStore();
  const [expanded, setExpanded] = useState("panel1");
  const history = useHistory();
  const [errors, setErrors] = useState<Errors>({});
  const [recipe, setRecipe] = useState<Recipe>({
    title: "",
    sourceName: "",
    servings: 0,
    readyInMinutes: 0,
    extendedIngredients: [
      {
        name: "",
        measures: {
          metric: {
            amount: 0,
            unitShort: "",
          },
        },
      },
    ],
    image: "",
    dishTypes: [],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          {
            number: 1,
            step: "",
          },
        ],
      },
    ],
    createdBy: currentUser.id,
  });

  const handleChange = (panel: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = async () => {
    try {
      const recipeId = await sendRecipe(recipe);
      if (files.length > 0) {
        let fileType = "";
        if (files[0].name.endsWith("jpeg")) {
          fileType = "jpeg";
        } else if (files[0].name.endsWith("png")) {
          fileType = "png";
        }
        if (fileType !== "") {
          const uploadImage = await storage.ref(`/recipe-images/${recipeId.recipeId}.${fileType}`).put(files[0]);
          if (uploadImage.state === "success") {
            const getURL = await storage
              .ref()
              .child(`/recipe-images/${recipeId.recipeId}.${fileType}`)
              .getDownloadURL();
            setRecipe({ ...recipe, image: getURL });
            setSnackbar("Recipe successfully added", "success");
          } else {
            console.log("File upload failed");
          }
        } else {
          console.log("Invalid file type");
        }
      } else {
        setSnackbar("Recipe successfully added", "success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser.id.length === 0) {
      setSnackbar("Please login to use this feature", "info");
      history.push("/account/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  return (
    <div className={styles.root}>
      <ScanRecipe recipe={recipe} setRecipe={setRecipe} openUpload={openUpload} setOpenUpload={setOpenUpload} />
      <div>
        <h1>Create your own recipe</h1>
        <Button onClick={handleOpenUpload}>Scan Recipe</Button>
      </div>
      <div className={styles.flexContainer}>
        <div className={styles.accordionBox}>
          <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} className={styles.accordion}>
            <AccordionSummary
              className={combineClasses(styles.accordionHeader, expanded === "panel1" && styles.active)}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={styles.heading}>1. Name, portions, time, picture</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Step1
                setExpanded={setExpanded}
                recipe={recipe}
                setRecipe={setRecipe}
                errors={errors}
                setErrors={setErrors}
                files={files}
                setFiles={setFiles}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")} className={styles.accordion}>
            <AccordionSummary
              className={combineClasses(styles.accordionHeader, expanded === "panel2" && styles.active)}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={styles.heading}>2. Ingredients</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Step2
                setExpanded={setExpanded}
                recipe={recipe}
                setRecipe={setRecipe}
                errors={errors}
                setErrors={setErrors}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === "panel3"} onChange={handleChange("panel3")} className={styles.accordion}>
            <AccordionSummary
              className={combineClasses(styles.accordionHeader, expanded === "panel3" && styles.active)}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={styles.heading}>3. Instructions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Step3 recipe={recipe} setRecipe={setRecipe} />
            </AccordionDetails>
          </Accordion>
        </div>

        <div className={styles.recipeDetailsBox}>
          <RecipeDetails recipe={recipe} />
        </div>
      </div>

      <div className={styles.submitButtonDiv}>
        <Button
          color="primary"
          variant="contained"
          className={`${styles.secondaryButton} ${styles.submitButton}`}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateRecipe;
