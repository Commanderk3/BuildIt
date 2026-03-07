import User from "../models/User.js";
import Chat from "../models/Chat.js";

async function createNewProject(userId: string, projectId: string) {
  

  const project = {
    projectId,
    title: "New Project",
    description: "Make plans for your project",
    mode: "planner",
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
  responseText: string
) {
  try {

    const chat = await Chat.findOneAndUpdate(
      { 
        userId, 
        projectId
      },
      {
        $push: {
          messages: {
            $each: [
              { sender: "user", content: userQuery, createdAt: Date.now() },
              { sender: "assistant", content: responseText, createdAt: Date.now() }
            ]
          }
        }
      },
      { upsert: true, new: true }
    );
    
    return chat;
  } catch (error) {
    console.error('Error updating chat history:', error);
    throw error;
  }
}
export { createNewProject, updateChatHistory };
