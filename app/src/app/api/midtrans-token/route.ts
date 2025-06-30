import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";
import Transaction from "@/db/models/Transaction";

export async function POST(req: Request) {
  try {
    const userEmail = req.headers.get("x-user-email");
    const userId = req.headers.get("x-user-id");
    
    if (!userEmail) {
      throw new CustomError(`Unauthorized! Please login first!`, 401)
    }

    const { amount, orderId } = await req.json();

    const existingTransaction = await Transaction.where(
      "orderId",
      orderId
    ).first();
    if (existingTransaction) {
      throw new CustomError(`Order ID ${orderId} already exists`, 400);
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: "ITEM1",
          price: amount,
          quantity: 1,
          name: "FiteMeal Premium Plan",
        },
      ],
      customer_details: {
        last_name: "ini harusnya name user yang login",
        email: "iniemailuseryanglogin@mail.com",
      },
    };

    const authString = Buffer.from(
      process.env.MIDTRANS_SERVER_KEY + ":"
    ).toString("base64");

    const resp = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(parameter),
      }
    );

    const midtransResp = await resp.json();
    console.log(midtransResp);

    if (!resp.ok) {
      const errorMessage = midtransResp.error_messages
        ? midtransResp.error_messages.join(", ")
        : midtransResp.message || "Midtrans API Error";

      throw new CustomError(`Midtrans Error: ${errorMessage}`, resp.status);
    }

    const transactionData = {
      orderId: orderId,
      amount: amount,
      status: "pending",
      midtransToken: midtransResp.token,
      userId: userId,
      redirectUrl: midtransResp.redirect_url,
    };

    await Transaction.insert(transactionData);
    console.log(`Transaction ${orderId} saved to database`);

    return Response.json(
      {
        orderId: orderId,
        midtransToken: midtransResp.token,
        paymentMethodLink: midtransResp.redirect_url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    const { message, status } = errorHandler(error);

    return Response.json({ message }, { status });
  }
}
