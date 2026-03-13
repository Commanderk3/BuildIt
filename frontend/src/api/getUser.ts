import axios from "axios";

const token = localStorage.getItem("token");

export async function getUserDetails() {
  try {
    const res = await axios.get("http://localhost:3000/user/me", {
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
