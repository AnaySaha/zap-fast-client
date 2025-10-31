import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth'; // ✅ Added user hook

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get logged-in user info

  const [error, setError] = useState('');

  // ✅ Fetch parcel info
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ['parcels', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <p>...loading</p>;
  }

  // ✅ Ensure amount is a number (handles MongoDB Decimal128 case)
  const amount = parseFloat(parcelInfo.cost?.$numberDecimal || parcelInfo.cost || 0);
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // Step 1: Create Payment Method
    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (methodError) {
      setError(methodError.message);
      return;
    } else {
      setError('');
      console.log('✅ Payment method created:', paymentMethod);
    }

    try {
      // Step 2: Create Payment Intent from backend
      const intentRes = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        parcelId,
      });
console.log(intentRes);

      const clientSecret = intentRes.data.clientSecret;

      // Step 3: Confirm Card Payment
      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email || 'no-email@unknown.com',
          },
        },
      });

      if (confirmResult.error) {
        setError(confirmResult.error.message);
        return;
      }

      if (confirmResult.paymentIntent?.status === 'succeeded') {
        const transactionId = confirmResult.paymentIntent.id;

        // Step 4: Save payment history to DB
        const paymentData = {
          parcelId,
          email: user.email,
          amount,
          transactionId,
          paymentMethod: confirmResult.paymentIntent.payment_method_types,
        };

        const paymentRes = await axiosSecure.post('/payments', paymentData);

        if (paymentRes.data.insertedId) {
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
            confirmButtonText: 'Go to My Parcels',
          });


          navigate('/dashboard/myParcels');
        }
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError(err.message || 'Payment failed');
    }
  };

  return (
    <div>
      <form
        className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto space-y-4"
        onSubmit={handleSubmit}
      >
        <CardElement className="p-2 border rounded" />
        <button className="btn btn-primary w-full" type="submit" disabled={!stripe}>
          Pay ${amount}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
