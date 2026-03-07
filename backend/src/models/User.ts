import mongoose, { Document, Schema } from "mongoose";

interface IProject {
  projectId: string;
  title: string;
  description: string;
  mode: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  projects: IProject[];
}

const ProjectSchema: Schema = new Schema({
  projectId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ["planner", "builder"],
    default: "planner",
  },
});

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    projects: [ProjectSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);