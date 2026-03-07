import { useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SignupForm } from "../components/SignupForm";
import { LoginForm } from "../components/LoginForm";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

  const handleTabChange = (value: string) => {
    setActiveTab(value as "signup" | "login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {activeTab === "signup" ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "signup"
              ? "Enter your information to get started"
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Log In
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="signup" className="mt-0">
            <SignupForm />
          </TabsContent>

          <TabsContent value="login" className="mt-0">
            <LoginForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}