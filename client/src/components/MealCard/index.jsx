import { useHistory } from "react-router-dom";
import { IconButton, CardContent, Card } from "@material-ui/core";
import { useStore } from "../../store";
import { checkFavourite, saveFavouriteRecipe } from "../../db/recipes";
import styles from "./MealCard.module.scss";
import { combineClasses, textEllipsis } from "../../utils";
import { useEffect, useState } from "react";

const MealCard = ({ meal }) => {
  const history = useHistory();
  const { setSnackbar, currentUser } = useStore();
  const [favouriteStatus, setFavouriteStatus] = useState(false);
  const [useEffectActivator, setUseEffectActivator] = useState(false);

  const handleClick = () => {
    if (meal._id?.length === 24) {
      history.push(`/recipe/${meal._id}`);
    } else {
      history.push(`/recipe/${meal.id}`);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      if (meal._id.length === 24) {
        await saveFavouriteRecipe(currentUser.id, meal._id, null);
        setUseEffectActivator(!useEffectActivator);
      } else {
        await saveFavouriteRecipe(currentUser.id, null, meal.id);
        setUseEffectActivator(!useEffectActivator);
      }
      if (favouriteStatus) {
        setSnackbar("Successfully removed recipe to My Recipes", "success");
      } else {
        setSnackbar("Successfully added recipe to My Recipes", "success");
      }
    } catch (error) {
      console.log(error);
      setSnackbar("Something went wrong, please contact site administrator", "error");
    }
  };

  useEffect(() => {
    const status = async () => {
      // if (meal._id.length === 36 || meal._id.length === 24) {
      // const getFavouriteStatus = await checkFavourite(currentUser.id, meal._id, "");
      // console.log(getFavouriteStatus);
      // setFavouriteStatus(getFavouriteStatus.status);
      // } else {
      //   setFavouriteStatus(false);
      // }
    };
    status();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useEffectActivator, meal]);

  return (
    <div key={meal._id} className={styles.MealCard}>
      <Card elevation={3} className={styles.card}>
        <CardContent className={styles.content} onClick={handleClick}>
          <img src={meal.image} alt={meal.description} />
          <h2>{textEllipsis(meal.title, 40)}</h2>
          {currentUser.id.length > 0 && (
            <IconButton className={styles.favouriteIcon} onClick={handleSave}>
              <i className={combineClasses(styles.save && favouriteStatus ? "fas fa-heart" : "far fa-heart")}></i>
            </IconButton>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MealCard;
