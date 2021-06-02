import express from "express";
import asyncHandler from "express-async-handler";
import { LoginRequest, User } from "../../../common";
import { Users } from "./users.model";

export const getUserById: express.RequestHandler<{ user_id: string }> = async (req, res) => {
  const { user_id } = req.params;
  const user = await Users.find({ id: user_id }, { username: 1, _id: 0 });
  res.send({ user });
};

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await Users.find();
    res.send({ users });
  } catch (error) {
    console.log(error);
  }
});

export const newUser: express.RequestHandler<{}, {}, { user: Pick<User, "username" | "email" | "password"> }> = async (
  req,
  res
) => {
  try {
    const user = {
      username: req.body.user.username,
      email: req.body.user.email,
      password: req.body.user.password,
    };
    const reqNewUser = await Users.create(user);
    const response = { message: "Registration successful, logging in new user and redirecting to homepage" };
    res.status(201).send({ response });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const loginUser: express.RequestHandler<{}, {}, { user: LoginRequest }> = async (req, res) => {
  try {
    const user = {
      username: req.body.user.username,
      password: req.body.user.password,
    };
    const loginResponse = await Users.find({ username: user.username, password: user.password });
    let response = {
      username: loginResponse[0].username,
      id: loginResponse[0]._id,
      message: "Login Successful, redirecting to homepage",
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
