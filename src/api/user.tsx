import { User } from "../lib/store";
import { lower } from "../lib/utils";
import { fetchAPI } from "./config";

export const getDataUsers = async () => {
  return fetchAPI<User[]>("https://67ab24b265ab088ea7e8d842.mockapi.io/users");
};

export const checkSession = async (email: string, password: string) => {
  const res = await getDataUsers();
  if (!res.ok) {
    throw res.error || "";
  }

  // validate username or password
  if (res.data?.length) {
    const user = res.data.filter(
      (v) => lower(v.email) == lower(email) && v.password == password
    )[0];

    if (user) {
      return user;
    }
  }
  throw "Sorry, account not found, make sure your username or email and password are correct.";
};
