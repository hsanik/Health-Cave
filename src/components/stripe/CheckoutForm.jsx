"use client";
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

// Real Stripe Checkout Form Component
const CheckoutForm = ({ appointmentId, amount, doctorName, patientName, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const updatePaymentStatus = async (paymentIntentId) => {
    try {
      console.log('Manually updating payment status for appointment:', appointmentId);
      const response = await fetch(`/api/appointments/${appointmentId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentId: paymentIntentId,
          amount: amount,
        }),
      });

      if (response.ok) {
        console.log('Payment status updated successfully');
      } else {
        console.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?appointment_id=${appointmentId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      
      if (onError) {
        onError(error);
      }
    } else {
      // Payment succeeded - manually update the payment status
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await updatePaymentStatus(paymentIntent.id);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Secure Payment with Stripe
          </h3>
          <div className="flex items-center text-green-600">
            <Lock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">SSL Encrypted</span>
          </div>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <p><span className="font-medium">Doctor:</span> {doctorName}</p>
          <p><span className="font-medium">Patient:</span> {patientName}</p>
          <p><span className="font-medium">Amount:</span> <span className="text-lg font-bold">${amount}</span></p>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Payment Information</h4>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <PaymentElement 
            options={{
              layout: "tabs",
              paymentMethodOrder: ['card'],
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Your payment is secure</p>
            <p>Powered by Stripe. Your card details are encrypted and never stored on our servers.</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full flex items-center justify-center px-6 py-4 bg-[#435ba1] text-white font-semibold rounded-lg hover:bg-[#4c69c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-3" />
            Pay ${amount} Securely
          </>
        )}
      </button>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Test Mode:</strong> Use card number <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiry date and any CVC for successful payments.
        </p>
        <p className="text-blue-700 text-xs mt-2">
          Other test cards: <code className="bg-blue-100 px-1 rounded">4000 0000 0000 0002</code> (declined), 
          <code className="bg-blue-100 px-1 rounded ml-1">4000 0025 0000 3155</code> (requires authentication)
        </p>
      </div>
    </form>
  );
};

// Wrapper component that provides Stripe Elements
const StripePaymentForm = ({ clientSecret, stripePromise, ...props }) => {
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#435ba1',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret || !stripePromise) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#435ba1]" />
        <p className="text-gray-600">Initializing secure payment...</p>
      </div>
    );
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;