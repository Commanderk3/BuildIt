import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SyntheticEvent } from "react";
import { toast } from "sonner";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useUser } from "../contexts/UserContext";

import { sendOtp, verifyOtp, registerUser } from "@/api/auth";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSendOtp = async () => {
    if (!email) {
      return toast.error("Enter email first");
    }

    try {
      const res = await sendOtp(email);
      const message = res.data.message;
      setOtpSent(true);
      toast.success(message);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return toast.error("Enter OTP");
    }

    try {
      const res = await verifyOtp(email, otp);
      const message = res.data.message;
      setOtpVerified(true);
      toast.success(message);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpVerified) {
      return toast.error("Verify OTP first");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setIsLoading(true);

      const res = await registerUser(username, email, password);

      if (typeof res.token === "string") {
        localStorage.setItem("token", res.token);
      }

      setUser(res.user)

      toast.success("Signup successful");

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);

      navigate("/projects");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-username">Username</Label>
          <Input
            id="signup-username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpVerified}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <Input
            id="signup-confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {!otpSent && (
          <Button
            type="button"
            className="w-full"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            Send OTP
          </Button>
        )}

        {otpSent && !otpVerified && (
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <div className="flex gap-2">
              <Input
                id="otp"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        {otpVerified && (
          <p className="text-green-600 text-sm">
            ✓ Email verified successfully
          </p>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="/terms" className="text-primary hover:underline">
              terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              privacy policy
            </a>
          </Label>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !otpVerified}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </CardFooter>
    </form>
  );
}
