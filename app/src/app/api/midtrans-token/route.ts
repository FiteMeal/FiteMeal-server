import { CustomError } from "@/db/helpers/CustomError";
import errorHandler from "@/db/helpers/errorHandler";

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();

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
    return Response.json(
      {
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
