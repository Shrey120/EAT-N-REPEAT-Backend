const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51NdCYxSERmmQORdUKjHq4k27cYpnzQX38SSeJBmkG9V5z2nwL4vvDEErMvxktvzW0u1VdLcmASALye4azznxdQNS00GbZUSMj4"
);

app.use(express.json());
app.use(cors());

require("dotenv").config();
//checkout Api
app.post("/api/create-checkout", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.BASE_URL}`,
    cancel_url: `${process.env.BASE_URL}`,
  });

  res.json({ id: session.id });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
