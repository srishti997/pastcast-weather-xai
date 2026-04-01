// src/services/messageClient.ts

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export async function sendMessage(text: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Network error");
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    return "AI server error. Please try again.";
  }
}
