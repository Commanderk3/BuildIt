import axios from "axios";

const token = localStorage.getItem("token");

export async function getUserDetails() {
  const res = await axios.get("http://localhost:3000/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data);
  return res.data;
}

