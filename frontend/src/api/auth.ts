import axios from "axios";

const API = "http://localhost:3000";

const sendOtp = async (email: string) => {
  try {
    const res = await axios.post(`${API}/auth/send-otp`, { email });
    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || "Failed to send OTP";
      throw new Error(message);
    }
    throw new Error("Unknown error sending OTP");
  }
};

const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await axios.post(`${API}/auth/verify-otp`, {
      email,
      otp,
    });
    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP";
      throw new Error(message);
    }
    throw new Error("Unknown error verifying OTP");
  }
};

const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const res = await axios.post(`${API}/auth/signup`, {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      throw new Error(message);
    }
    throw new Error("Unknown signup error");
  }
};

const loginUser = async (
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post(`${API}/auth/login`, {
      email,
      password,
    });
    console.log(response);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
    throw new Error("Unknown login error");
  }
};

export { sendOtp, verifyOtp, registerUser, loginUser, API };
