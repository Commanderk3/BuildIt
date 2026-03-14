import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";

import { sendUserQuery } from "@/api/postMessage";
import { useBuild } from "@/contexts/BuildContext";

type Sender = "user" | "assistant";

type Message = {
  id: string;
  sender: Sender;
  content: string;
  createdAt: number;
};

type Messages = Message[];

export const ChatWindow = () => {
  const { projectId, updateTitle, renderCode } = useBuild();

  const [msgList, setMsgHistory] = useState<Messages>([]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      createdAt: Date.now(),
    };

    setMsgHistory((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const updatedHistory = [...msgList, userMessage];
      const llmResponse = await sendUserQuery(updatedHistory, projectId);

      if (llmResponse.to === "builder") {
        updateTitle(llmResponse.projectName);
        renderCode(llmResponse.message);
        return;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: llmResponse.message,
        createdAt: Date.now(),
      };

      setMsgHistory((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {

    if (!projectId) return;

    const storedMessages = localStorage.getItem(`chat_${projectId}`);

    if (storedMessages) {
      setMsgHistory(JSON.parse(storedMessages));
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    localStorage.setItem(`chat_${projectId}`, JSON.stringify(msgList));
  }, [msgList, projectId]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className="w-full rounded-[0px] max-w-md mx-auto h-[90vh] flex flex-col overflow-hidden p-0 gap-0"
      style={{ height: "90vh" }}
    >
      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          {msgList.map((msg, index) => (
            <div key={msg.id}>
              <div
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Message Bubble */}
                <div
                  className={`flex flex-col max-w-[70%] ${msg.sender === "user" ? "items-end" : ""}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm max-w-[280px] break-words">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>

              {/* Separator between messages */}

              <Separator className="my-3 opacity-50" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
