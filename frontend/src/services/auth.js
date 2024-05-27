import axios from "axios";
import { baseURL } from "../constants";
import { domParserFn } from "../helpers/util";

const baseName = "auth/";

export const loginUser = (email = "", password = "") => {
  return new Promise((resolve, reject) => {
    let url = baseURL + baseName + "login";
    axios
      .post(
        url,
        { username: email, password: password },
        { withCredentials: true }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        let message = domParserFn(err.response.data);
        reject(message);
      });
  });
};

export const registerUser = (email = "", password = "", confirmPassword) => {
  return new Promise((resolve, reject) => {
    let url = baseURL + baseName + "register";
    let data = {
      email: email,
      password: password,
      confirmPasswrod: confirmPassword,
    };
    axios
      .post(url, data, { withCredentials: true })
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err.response);
      });
  });
};

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    let url = baseURL + baseName + "get-current-user";
    axios
      .get(url, { withCredentials: true })
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err.response);
      });
  });
};

export const userLogout = () => {
  return new Promise((resolve, reject) => {
    let url = baseURL + baseName + "user-logout";
    axios
      .get(url, { withCredentials: true })
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err.response);
      });
  });
};
