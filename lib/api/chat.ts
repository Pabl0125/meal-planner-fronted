export interface ChatAction {
  type: "ASSIGN" | "CLEAR_MEAL" | "CLEAR_WEEK";
  day?: string;
  meal?: string;
  dishName?: string;
}

export interface ChatResponse {
  text: string;
  actions: ChatAction[];
}

export const sendChatMessage = async (
  message: string,
  context: string,
  sessionId?: string
): Promise<ChatResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  
  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      context,
      sessionId
    })
  });

  if (!res.ok) {
    let errorMessage = "Failed to communicate with AI Chat";
    let serverDetail = "";
    try {
      serverDetail = await res.text();
    } catch (e) {
      // ignore if body cannot be read
    }

    switch (res.status) {
      case 400:
        errorMessage = `Bad Request (400): The request was invalid. ${serverDetail}`;
        break;
      case 404:
        errorMessage = "Not Found (404): The AI chat endpoint could not be found.";
        break;
      case 429:
        errorMessage = "Too Many Requests (429): Please wait a moment before sending another message.";
        break;
      case 500:
        errorMessage = `Internal Server Error (500): The AI server encountered an unexpected condition`;
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = `Service Unavailable (${res.status}): The AI service is temporarily unreachable or offline.`;
        break;
      default:
        errorMessage = `HTTP Error ${res.status} (${res.statusText}): ${serverDetail}`;
    }

    throw new Error(errorMessage.trim());
  }

  return res.json();
};
