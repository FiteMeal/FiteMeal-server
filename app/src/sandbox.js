
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: "",   
// });

// const response = await openai.responses.create({
//     model: 'gpt-4.1',
//     input: `Tolong buatkan data JSON meal plan selama 3 hari (3/5/7 hari).  
// Detail format:

// - Format: JSON, tidak perlu penjelasan tambahan.
// - Struktur data per hari:
//   - "day": Nomor hari (1-X)
//   - "dailycalories": Total 1500 kcal.
//   - "breakfast":
//     - "name"
//     - "imageUrl": Kosong atau placeholder
//     - "calories": Sekitar 500
//     - "ingredients": Array bahan
//     - "recipes": Array langkah masak
//   - "lunch": *(Harus juga punya ingredients dan recipes)*
//   - "dinner": *(Harus juga punya ingredients dan recipes)*

// Rules tambahan:
// - Semua menu adalah masakan Indonesia.
// - Menu setiap hari harus beda.
// - Lunch dan Dinner harus sama lengkapnya seperti Breakfast (ada ingredients dan recipes).
// - Jangan ada narasi, output hanya JSON seperti ini :
//     [
//       {
//         name:"Foolan byin foolan",
//         userId: new ObjectId('123456789'),
//         plans:[output disini]
//       }  ]`,
// });

// console.log(response.output_text);
// const hasil = response.output_text

// console.log(typeof hasil,"ini tipe data <<<<<");

// 1. Tentukan tanggal mulai (start date)
// Menambahkan 'T00:00:00' membantu memastikan tanggal dimulai tepat tengah malam
// dan menghindari masalah perbedaan zona waktu.
const startDate = new Date('2025-06-26T00:00:00');
console.log(startDate,"<<<< ini start date");


// 2. Siapkan sebuah array kosong untuk menampung hasil tanggal
const rentangTanggal = [];

// 3. Lakukan perulangan sebanyak 7 kali untuk mendapatkan 7 hari
// Loop dimulai dari i = 0 (hari pertama) hingga i = 6 (hari ketujuh)
for (let i = 0; i < 7; i++) {
  // Buat objek Date baru berdasarkan startDate di setiap iterasi
  // Ini penting agar kita tidak mengubah nilai asli dari 'startDate'
  const tanggalHariIni = new Date(startDate);
  console.log(tanggalHariIni,'<<<<');
  
  
  // Gunakan setDate() untuk mengatur tanggal.
  // getDate() akan mengambil hari dari startDate (yaitu 26), lalu ditambah dengan i.
  // i = 0 -> 26 + 0 = 26 (Kamis, 26 Juni)
  // i = 1 -> 26 + 1 = 27 (Jumat, 27 Juni)
  // ...
  // i = 5 -> 26 + 5 = 31 -> oleh JavaScript akan dikonversi menjadi 1 Juli
  tanggalHariIni.setDate(startDate.getDate() + i);
  
  // Masukkan tanggal yang sudah dihitung ke dalam array
  rentangTanggal.push(tanggalHariIni);
}

// 4. Tampilkan hasilnya untuk verifikasi
console.log("Hasil dalam bentuk objek Date:");
console.log(rentangTanggal);

// Untuk tampilan yang lebih mudah dibaca oleh manusia
console.log("\nHasil dalam format yang lebih mudah dibaca (Bahasa Indonesia):");
rentangTanggal.forEach(tgl => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  console.log(tgl.toLocaleDateString('id-ID', options));
});
  // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const date = new Date()
const besok = new Date(date)

const besokbeneran = besok.setDate(date.getDate()+1)
besokbeneran.toLocaleDateString('id-ID')
console.log(besokbeneran,"ini besok beneran ");



