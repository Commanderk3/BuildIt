import axios from "axios";
import { API } from "./auth";

const token = localStorage.getItem("token");

export async function getUserDetails() {
  try {
    const res = await axios.get(`${API}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error ", error);
    throw new Error("User details fetch failed");
  }
}
