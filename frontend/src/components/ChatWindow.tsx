import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

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
        renderCode(llmResponse.message, projectId);
        return;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        content: llmResponse.message,
        createdAt: Date.now(),
      };

      setMsgHistory((prev) => [...prev, botMessage]);
      console.log("messages", msgList);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${projectId}`);
    console.log(storedMessages, projectId);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages);
        setMsgHistory(parsed);
      } catch (error) {
        console.error("Failed to parse stored messages:", error);
        setMsgHistory([]);
      }
    } else {
      setMsgHistory([]);
    }
  }, []);

  useEffect(() => {
    if (!projectId) return;
    if (msgList.length > 0) {
      // Only save if there are messages
      localStorage.setItem(`chat_${projectId}`, JSON.stringify(msgList));
    }
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
          {msgList.map((msg) => (
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
            if (inputValue.trim()) handleSendMessage();
          }}
          className="flex items-end gap-2 max-w-4xl mx-auto"
        >
          <TextareaAutosize
            maxRows={5}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            // Using shadcn's default textarea classes for a consistent look
            className="flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim()}
            className="shrink-0 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
