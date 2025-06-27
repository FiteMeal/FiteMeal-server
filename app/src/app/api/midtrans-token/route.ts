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
          name: "FiteMeal Premium Account",
          brand: "FiteMeal",
          category: "Health",
          merchant_name: "Fitemeal",
          url: "http://toko/toko1?item=abc",
        },
      ],
    };

    const authString = Buffer.from(
      process.env.MIDTRANS_SERVER_KEY + ":"
    ).toString("base64");
    const data = await fetch(
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

    const midtransToken = await data.json();

    return Response.json({ midtransToken }, { status: 201 });
  } catch (error) {
    console.log(error);
    const { message, status } = errorHandler(error);

    return Response.json({ message }, { status });
  }
}
