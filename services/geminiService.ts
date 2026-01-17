
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchPenjwenWeather = async (): Promise<WeatherData> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `پێشبینییەکی تەواو ورد و زانستی بۆ کەش و هەوای ١٠ ڕۆژی داهاتووی قەزای پێنجوێن ئامادە بکە. 
    
    زۆر گرنگ: سەرچاوەی سەرەکی زانیارییەکانت ئەم لینکە فەرمییەی MSN Weather بێت:
    https://www.msn.com/ar-ae/weather/forecast/in-%D8%A8%DB%8C%D9%86%D8%AC%D9%88%D9%8A%D9%86,%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A9-%D8%A7%D9%84%D8%B3%D9%84%D9%8A%D9%85%D8%A7%D9%86%D9%8A%D8%A9
    
    ڕێنماییەکان:
    - هەموو دەقەکان بە کوردییەکی پەتی و پاراو بن.
    - بە هیچ شێوەیەک وشەی لاری (Italic) یان ستایلی لار بەکارمەهێنە.
    - ناوی ڕێگای "سەیران" بگۆڕە بۆ "سەیرانبەن".
    - وتەیەکی زۆر جوان و هیوا بەخش بە کوردی بنووسە.
    
    زانیارییە پێویستەکان:
    ١. ئاماری وردی ئێستا (پلەی گەرمی، دۆخی ئاسمان، شێ، خێرایی با).
    ٢. ڕەوشی ڕێگاوبانەکان و شوێنە سەختەکانی هاتوچۆ لە کاتی بەفر و باران (بەتایبەت سەیرانبەن، ملەکەوە، بەرانە).
    ٣. گەڕانێکی مێژوویی کورت و پوخت بۆ ناوی 'پێنجوێن'.
    ٤. پێشبینی ١٠ ڕۆژی داهاتوو.
    ٥. ڕێنمایی و ئامۆژگاری تەندروستی گونجاو بۆ ئەم جۆرە کەشوهەوایە.
    
    تەنها وەک JSON وەڵام بدەرەوە.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          currentTemp: { type: Type.NUMBER },
          currentCondition: { type: Type.STRING },
          currentDate: { type: Type.STRING },
          humidity: { type: Type.NUMBER },
          windSpeed: { type: Type.NUMBER },
          currentRainChance: { type: Type.NUMBER },
          currentSnowChance: { type: Type.NUMBER },
          roadStatus: { type: Type.STRING },
          healthAdvice: { type: Type.STRING },
          inspirationalQuote: { type: Type.STRING },
          strongestEarthquake: {
            type: Type.OBJECT,
            properties: {
              magnitude: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["magnitude", "date"]
          },
          penjwenIdentity: {
            type: Type.OBJECT,
            properties: {
              hospitality: { type: Type.STRING },
              etymology: { type: Type.STRING }
            },
            required: ["hospitality", "etymology"]
          },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                date: { type: Type.STRING },
                tempHigh: { type: Type.NUMBER },
                tempLow: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                humidity: { type: Type.NUMBER },
                rainChance: { type: Type.NUMBER },
                snowChance: { type: Type.NUMBER },
                windSpeed: { type: Type.NUMBER },
                detailedDescription: { type: Type.STRING },
                icon: { type: Type.STRING }
              },
              required: ["day", "date", "tempHigh", "tempLow", "condition", "humidity", "rainChance", "snowChance", "windSpeed", "detailedDescription", "icon"]
            }
          }
        },
        required: ["currentTemp", "currentCondition", "currentDate", "humidity", "windSpeed", "currentRainChance", "currentSnowChance", "roadStatus", "healthAdvice", "inspirationalQuote", "strongestEarthquake", "penjwenIdentity", "forecast"]
      }
    }
  });

  return JSON.parse(response.text);
};
