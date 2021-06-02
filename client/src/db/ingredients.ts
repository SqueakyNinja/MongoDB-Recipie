import axios from "axios";

axios.defaults.baseURL = "http://localhost:9090/api";

export const getAllIngredients = async () => {
  const getAllIngredientsResponse = await axios.get(`/ingredients`);
  return getAllIngredientsResponse.data;
};
