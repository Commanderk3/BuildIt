import axios from "axios";

type ApiResponse = {
  response: {
    to: string;
    message: string;
  };
};

async function sendUserQuery(query: string) {
  const res = await axios.post<ApiResponse>(
    "http://localhost:3000/ask",
    { data: query },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  console.log(res);
  return res.data;
}

export default sendUserQuery;
