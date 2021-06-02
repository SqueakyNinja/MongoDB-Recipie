import { LoginRequest, NewUser } from "../../../common/index";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:9090/api";
// axios.defaults.baseURL = "https://reci-pie-server.herokuapp.com/api";

export const addNewUser = async (user: NewUser) => {
  const postUser = await axios.post("/users/signup", { user });
  return postUser;
};

export const sendLogin = async (user: LoginRequest) => {
  const loginResponse = await axios.post("/users/login", { user });
  return loginResponse.data;
};

export const getUser = async (user_id = "") => {
  const fetchUser = await axios.get(`/users?user_id=${user_id}`);
  return fetchUser.data;
};
