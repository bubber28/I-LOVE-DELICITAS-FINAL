import { loadStripe } from '@stripe/stripe-js';

// Substitua pela sua chave publicável real do Stripe
export const stripePromise = loadStripe('pk_test_your_publishable_key');