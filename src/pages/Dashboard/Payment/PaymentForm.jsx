import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { Form, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

    const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const {parcelId} = useParams();
    const axiosSecure = useAxiosSecure();


   const [error, setError] = useState('');


   const { isPending, data: parcelInfo = {} } = useQuery ({
      queryKey: ['parcels', parcelId],
      queryFn: async() =>{
         const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
      }
   })

   if(isPending){
      return '....loading'
   }

   console.log(parcelInfo);
   
    const handleSubmit = async (e) => {
        e.preventDefault();
         if(!stripe || !elements){
            return;
         }

         const card = elements.getElement(CardElement);
         if(!card){
            return;
         }

         const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card
         })

         if(error){
           setError(error.message);
         }
         else{
            setError('');
            console.log('paymentMethod', paymentMethod)
         }
    }
    return (
        <div>
            <form className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
            <CardElement className='p-2 border rounded' />
                 <button  className="btn btn-primary w-full" type="submit" disabled={!stripe}>
        Pay Now
      </button>
      {
        error && <p className='text-red-500'> {error}</p>
      }
           
            </form>
        </div>
    );
};

export default PaymentForm;