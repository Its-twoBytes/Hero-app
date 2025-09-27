import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API key for Gemini is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = "gemini-2.5-flash";

export const getRewardSuggestions = async (kidNames: string) => {
  if (!API_KEY) return [];
  const prompt = `اقترح 5 مكافآت ممتعة ومناسبة للأطفال. ${kidNames ? `أسماء الأطفال هي ${kidNames}.` : ''} يجب أن تكون الاقتراحات متنوعة. لكل مكافأة، قدم اسمًا، ووصفًا قصيرًا، وتكلفة مقترحة بالنقاط (بين 50 و 500 نقطة).`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "اسم المكافأة" },
              description: { type: Type.STRING, description: "وصف قصير للمكافأة" },
              cost: { type: Type.INTEGER, description: "تكلفة المكافأة بالنقاط" },
            },
            required: ["name", "description", "cost"],
          },
        },
      },
    });
    const json = JSON.parse(response.text);
    return json;
  } catch (error) {
    console.error("Error fetching reward suggestions:", error);
    return [];
  }
};

export const getBehaviorSuggestions = async (type: 'good' | 'chore') => {
  if (!API_KEY) return [];
  const prompt = type === 'good'
    ? "اقترح 5 عادات وسلوكيات إيجابية للأطفال. لكل سلوك، قدم اسمًا وقيمة نقاط مقترحة (بين 5 و 25 نقطة)."
    : "اقترح 5 مهام منزلية مناسبة للأطفال. لكل مهمة، قدم اسمًا وقيمة نقاط مقترحة (بين 10 و 30 نقطة).";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "اسم السلوك أو المهمة" },
              points: { type: Type.INTEGER, description: "قيمة النقاط" },
            },
            required: ["name", "points"],
          },
        },
      },
    });
    const json = JSON.parse(response.text);
    return json;
  } catch (error) {
    console.error("Error fetching behavior suggestions:", error);
    return [];
  }
};

export const getEmojiSuggestions = async (name: string) => {
  if (!API_KEY) return [];
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `اقترح 3 رموز تعبيرية (emojis) مناسبة لما يلي: "${name}". قدم الرموز فقط.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emojis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "قائمة من 3 رموز تعبيرية."
            },
          },
          required: ["emojis"],
        },
      },
    });
    const json = JSON.parse(response.text);
    return json.emojis || [];
  } catch (error) {
    console.error("Error fetching emoji suggestions:", error);
    return [];
  }
};
