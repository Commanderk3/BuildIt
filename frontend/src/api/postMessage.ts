import axios from "axios";

type ApiResponse = {
  llmResponse: {
    to: string;
    message: string;
  };
};

type DeleteResponse = {
  message: string;
};

const API = "http://localhost:3000/project";

async function sendNewProjectQuery(query: string) {
  try {
    const token = localStorage.getItem("token");
    console.log(token);

    const res = await axios.post<ApiResponse>(
      `${API}/newProject`,
      { data: query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

async function sendUserQuery(query: string, projectId: string) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post<ApiResponse>(
      `${API}/ask/${projectId}`,
      { data: query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data.llmResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

async function deleteProject(projectId: string) {
  console.log(projectId);
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete<DeleteResponse>(
      `${API}/delete/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
}

export { sendUserQuery, sendNewProjectQuery, deleteProject };
