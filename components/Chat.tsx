"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "user", content: "Digite sua ideia sobre startups" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/generateIdea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error} - ${errorData.details}`);
      }

      const data = await response.json();

      setChatMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: inputValue },
        { role: "assistant", content: data.message },
      ]);

      setInputValue("");
    } catch (error) {
      console.error("Error generating startup idea:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-[440px] ">
        <CardHeader>
          <CardTitle>Startup IA</CardTitle>
          <CardDescription>Uma IA que gera idéias de Startups</CardDescription>
        </CardHeader>

        <CardContent>
          <ScrollArea className="min-h-[300px] w-full space-y-4 pr-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className="flex space-y-4 text-slate-600 gap-3 text-sm"
              >
                <Avatar>
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                  <AvatarImage
                    src={
                      message.role === "user"
                        ? "https://cdn-icons-png.flaticon.com/512/9368/9368284.png"
                        : "https://img.freepik.com/vetores-premium/projeto-de-vetor-de-icone-de-ia-de-inteligencia-artificial_16734-1298.jpg"
                    }
                  />
                </Avatar>

                <p className="leading-relaxed">
                  <span className="block font-bold text-slate-800">
                    {message.role === "user" ? "Você" : "IA"}
                  </span>
                  {message.content}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>

        <CardFooter>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <Input
              placeholder="Mensagem IA"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
};

export default Chat;
