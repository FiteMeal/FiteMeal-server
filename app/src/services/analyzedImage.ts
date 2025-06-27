import openai from "@/lib/openai";

export async function extractIngredientsFromImage(photoUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", 
    messages: [
      {
        role: "system",
        content: "Kamu adalah ahli nutrisi yang dapat mengenali isi kulkas dari gambar."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Berikan daftar bahan makanan yang terlihat dalam foto ini." },
          { type: "image_url", image_url: { url: photoUrl } }
        ]
      }
    ],
    max_tokens: 500
  });

  const text = response.choices[0]?.message?.content ?? "";
  return text;
}
