"use client";
import React, { useState } from 'react';
import { CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const PaymentForm = ({ appointmentId, amount, doctorName, patientName, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({});

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Format CVC to only allow numbers
  const formatCVC = (value) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  // Detect card type
  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'unknown';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Card number validation
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVC validation
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'CVC must be at least 3 digits';
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvc') {
      formattedValue = formatCVC(value);
    } else if (field === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').substring(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update appointment payment status
      const response = await fetch(`/api/appointments/${appointmentId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentId: `pay_${Date.now()}`,
          amount: amount,
          cardLast4: formData.cardNumber.slice(-4),
          cardType: getCardType(formData.cardNumber)
        }),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Failed to process payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cardType = getCardType(formData.cardNumber);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Secure Payment
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

      {/* Card Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Payment Information</h4>
        
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                errors.cardNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {cardType !== 'unknown' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className={`w-8 h-5 rounded text-xs font-bold flex items-center justify-center text-white ${
                  cardType === 'visa' ? 'bg-blue-600' : 
                  cardType === 'mastercard' ? 'bg-red-600' : 
                  cardType === 'amex' ? 'bg-green-600' : 'bg-gray-400'
                }`}>
                  {cardType === 'visa' ? 'VISA' : 
                   cardType === 'mastercard' ? 'MC' : 
                   cardType === 'amex' ? 'AMEX' : ''}
                </div>
              </div>
            )}
          </div>
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>
        
        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              maxLength="5"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                errors.expiryDate ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC *
            </label>
            <input
              type="text"
              value={formData.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              placeholder="123"
              maxLength="4"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                errors.cvc ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
              errors.cardholderName ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-700">Billing Address</h5>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.billingAddress}
              onChange={(e) => handleInputChange('billingAddress', e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="10001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Your payment is secure</p>
            <p>We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
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
          <strong>Test Mode:</strong> Use card number 4242 4242 4242 4242 with any future expiry date and any CVC for testing.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;