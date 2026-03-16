import axios from "axios";

type LlmResponse =
  | {
      to: "user";
      message: string;
    }
  | {
      to: "builder";
      message: string;
      projectName: string;
      description: string;
    };
    
type ApiResponse = {
  project: Project;
  llmResponse: LlmResponse;
};

type Project = {
  projectId: string;
  title: string;
  description: string;
  mode: string;
};

type DeleteResponse = {
  message: string;
};

type Message = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  createdAt: number;
};

const API = "https://l012eckn68.execute-api.ap-south-1.amazonaws.com/project";

async function sendNewProjectQuery(messages: Message[]) {
  try {
    const token = localStorage.getItem("token");
    console.log(token);

    const res = await axios.post<ApiResponse>(
      `${API}/newProject`,
      { messages }, // send messages array
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

async function sendUserQuery(msgList: Message[], projectId: string) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post<ApiResponse>(
      `${API}/ask/${projectId}`,
      { messages: msgList },
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
