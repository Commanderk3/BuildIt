// models/Chat.ts
import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: string;  // Changed to string to match User schema
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  projectId: {
    type: String,  // Changed from ObjectId to String
    required: true,
    index: true,
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

export default mongoose.model<IChat>("Chat", ChatSchema);