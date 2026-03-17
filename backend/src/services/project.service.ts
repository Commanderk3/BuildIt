import User from "../models/User.js";
import Chat from "../models/Chat.js";

async function createNewProject(
  userId: string,
  projectId: string,
  projectName: string,
  description: string,
  mode: "planner" | "builder"
) {
  const project = {
    projectId,
    title: projectName,
    description,
    mode,
  };

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.projects.push(project);
  await user.save();

  return project;
}

async function updateChatHistory(
  userId: string,
  projectId: string,
  userQuery: string,
  responseText: string,
) {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        userId,
        projectId,
      },
      {
        $push: {
          messages: {
            $each: [
              { sender: "user", content: userQuery, createdAt: Date.now() },
              {
                sender: "assistant",
                content: responseText,
                createdAt: Date.now(),
              },
            ],
          },
        },
      },
      { upsert: true, new: true },
    );

    return chat;
  } catch (error) {
    console.error("Error updating chat history:", error);
    throw error;
  }
}

async function updateNameProject(
  userId: string,
  projectId: string,
  newTitle: string,
  newDescription: string,
  mode: "planner" | "builder"
) {
  try {
    const result = await User.updateOne(
      { _id: userId, "projects.projectId": projectId },
      {
        $set: {
          "projects.$.title": newTitle,
          "projects.$.description": newDescription,
          "projects.$.mode": mode
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error("Project not found");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export { createNewProject, updateNameProject, updateChatHistory };
