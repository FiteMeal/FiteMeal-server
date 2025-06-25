
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "",   
});

const response = await openai.responses.create({
    model: 'gpt-4.1',
    input: `Tolong buatkan data JSON meal plan selama 3 hari (3/5/7 hari).  
Detail format:

- Format: JSON, tidak perlu penjelasan tambahan.
- Struktur data per hari:
  - "day": Nomor hari (1-X)
  - "dailycalories": Total 1500 kcal.
  - "breakfast":
    - "name"
    - "imageUrl": Kosong atau placeholder
    - "calories": Sekitar 500
    - "ingredients": Array bahan
    - "recipes": Array langkah masak
  - "lunch": *(Harus juga punya ingredients dan recipes)*
  - "dinner": *(Harus juga punya ingredients dan recipes)*

Rules tambahan:
- Semua menu adalah masakan Indonesia.
- Menu setiap hari harus beda.
- Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
- Jangan ada narasi, output hanya JSON seperti ini :
    [
      {
        name:"Foolan byin foolan",
        userId: new ObjectId('123456789'),
        plans:[output disini]
      }  ]`,
});

console.log(response.output_text);
const hasil = response.output_text

console.log(typeof hasil,"ini tipe data <<<<<");
