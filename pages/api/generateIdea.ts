import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(process.env.OPENAI_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const response = completion.choices[0].message.content;
    res.status(200).json({ message: response });
  } catch (error: unknown) {
    console.error("An error occurred:", error);
    if (error instanceof Error) {
      console.error("Error with OpenAI API:", error.message);
      if (error.message.includes("429")) {
        res.status(429).json({
          error: "Quota exceeded",
          details:
            "You have exceeded your current quota. Please check your plan and billing details.",
        });
      } else {
        res
          .status(500)
          .json({ error: "Internal Server Error", details: error.message });
      }
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        details: "Unknown error occurred",
      });
    }
  }
}
