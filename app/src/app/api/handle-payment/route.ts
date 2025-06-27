// src/app/api/midtrans-notification/route.ts

import Transaction from "@/db/models/Transaction"; // Asumsi path model Anda
import User from "@/db/models/User"; // Anda perlu membuat model User ini
import { createHash } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    console.log("Received Midtrans notification:", notification);

    // 1. Verifikasi Signature Key untuk Keamanan
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    const hash = createHash("sha512")
      .update(
        notification.order_id +
          notification.status_code +
          notification.gross_amount +
          serverKey
      )
      .digest("hex");

    if (hash !== notification.signature_key) {
      console.error("Invalid signature key");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    // 2. Dapatkan status transaksi dari notifikasi
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    // 3. Cari transaksi di database Anda
    const transaction = await Transaction.where("orderId", orderId).first();

    if (!transaction) {
      console.error(`Transaction with order ID ${orderId} not found.`);
      // Tetap kembalikan 200 agar Midtrans tidak mengirim ulang
      return NextResponse.json({ message: "Transaction not found" }, { status: 200 });
    }

    // Hindari pemrosesan ganda (Idempotency)
    if (transaction.status === 'success' || transaction.status === 'settlement') {
      console.log(`Transaction ${orderId} has already been processed.`);
      return NextResponse.json({ message: "Transaction already processed" }, { status: 200 });
    }

    if (transaction.userId) {
  const user = await User.where("_id", transaction.userId).first();
  
  if (!user) {
    console.error(`User ${transaction.userId} not found`);
    return NextResponse.json(
      { message: "User not found" }, 
      { status: 200 }
    );
  }
  
  // Log if user is already premium (for monitoring)
  if (user.isPremium && transactionStatus === 'settlement') {
    console.warn(`User ${transaction.userId} is already premium`);
  }
}

    // 4. Update status berdasarkan notifikasi Midtrans
    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        // Pembayaran dengan kartu kredit berhasil
        await updateTransactionToSuccess(orderId, transaction.userId);
      }
    } else if (transactionStatus == "settlement") {
      // Pembayaran non-kartu kredit (GoPay, Transfer Bank, dll.) berhasil
      await updateTransactionToSuccess(orderId, transaction.userId);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // Pembayaran gagal
      await Transaction.where("orderId", orderId).update({ status: "failed" });
      console.log(`Transaction ${orderId} failed.`);
    }

    // 5. Beri tahu Midtrans bahwa notifikasi sudah diterima
    return NextResponse.json({ message: "Notification processed" }, { status: 200 });
    
  } catch (error) {
    console.error("Error processing Midtrans notification:", error);
    // Kembalikan status 500 jika ada error internal, tapi idealnya tangani semua kasus
    // dan tetap kembalikan 200 ke Midtrans jika memungkinkan.
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Helper function untuk menghindari repetisi kode
async function updateTransactionToSuccess(orderId: string, userId: string) {
  // Update status transaksi menjadi 'success'
  await Transaction.where("orderId", orderId).update({ status: "success" });
  console.log(`Transaction ${orderId} status updated to success.`);

  // Update field isPremium pada user menjadi true
  // Pastikan Anda memiliki model User yang bisa di-query
  await User.where("_id", userId).update({ isPremium: true });
  console.log(`User ${userId} is now a premium user.`);
}