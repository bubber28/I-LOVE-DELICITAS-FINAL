import Stripe from 'stripe';
import { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer_email, success_url, cancel_url } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Adicione 'pix' aqui se configurado no Stripe Dashboard
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
            images: [item.image_url],
          },
          unit_amount: item.price_cents,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      customer_email,
      success_url,
      cancel_url,
    });

    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}