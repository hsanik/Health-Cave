'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-[#435ba1] mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-300">Loading Map...</p>
      </div>
    </div>
  )
})

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: ''
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 w-full flex items-center justify-center rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#435ba1] via-[#4c69c6] to-[#43d5cb]"></div>

        <div className="relative z-10 max-w-4xl px-6 lg:px-16 text-center">
          <header>
            <h1 className="text-[#43d5cb] text-xl pb-3 tracking-widest font-medium">
              Get in Touch
            </h1>
            <h1 className="text-3xl lg:text-5xl font-light text-white leading-tight mb-6">
              We're Here to <br />
              <span className="font-semibold">Help You</span>
            </h1>
          </header>

          <p className="text-base lg:text-lg text-[#fafafa] max-w-2xl mx-auto leading-relaxed">
            Have questions about our services? Need to schedule an appointment?
            Our team is ready to assist you with all your healthcare needs.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-9xl mx-auto px-6">
          <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                <Phone className="h-6 w-6 text-[#435ba1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#515151] dark:text-white">
                Phone
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Call us anytime
            </p>
            <p className="text-[#435ba1] font-medium">+1 (555) 123-4567</p>
            <p className="text-[#435ba1] font-medium">+1 (555) 987-6543</p>
          </article>

          <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                <Mail className="h-6 w-6 text-[#435ba1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#515151] dark:text-white">
                Email
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Send us an email
            </p>
            <p className="text-[#435ba1] font-medium">info@healthcave.com</p>
            <p className="text-[#435ba1] font-medium">support@healthcave.com</p>
          </article>

          <article className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                <Clock className="h-6 w-6 text-[#435ba1]" />
              </div>
              <h3 className="text-xl font-semibold text-[#515151] dark:text-white">
                Hours
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              We're available
            </p>
            <p className="text-[#515151] dark:text-white">
              Mon - Fri: 8:00 AM - 8:00 PM
            </p>
            <p className="text-[#515151] dark:text-white">
              Sat - Sun: 9:00 AM - 6:00 PM
            </p>
          </article>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="mb-16">
        <div className="max-w-9xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <article className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-[#515151] dark:text-white mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </header>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-[#43d5cb] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#515151] dark:text-white mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                      >
                        Service Needed
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                      >
                        <option value="">Select a service</option>
                        <option value="consultation">
                          Online Consultation
                        </option>
                        <option value="appointment">Book Appointment</option>
                        <option value="emergency">Emergency Care</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#435ba1] hover:bg-[#4c69c6] text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </article>

            {/* Map and Office Info */}
            <article className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <header className="mb-6">
                  <h2 className="text-2xl font-bold text-[#515151] dark:text-white mb-2">
                    Visit Our Office
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Come see us in person for a more personal consultation.
                  </p>
                </header>

                <div className="flex items-start mb-6">
                  <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                    <MapPin className="h-6 w-6 text-[#435ba1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#515151] dark:text-white mb-2">
                      Main Office
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      71/A Satmasjid Road
                      <br />
                      Dhanmondi, Dhaka 1209
                      <br />
                      Bangladesh
                    </p>
                  </div>
                </div>

                {/* Leaflet Map */}
                <div className="rounded-lg h-64 overflow-hidden">
                  <MapComponent />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-[#435ba1] to-[#4c69c6] rounded-xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-semibold">Emergency Contact</h3>
                </div>
                <p className="mb-4 text-[#fafafa]">
                  For urgent medical situations, please call our emergency line
                  immediately.
                </p>
                <p className="text-2xl font-bold">+1 555-123-4567</p>
                <p className="text-sm text-[#fafafa] mt-2">Available 24/7</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="max-w-9xl mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#515151] dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Quick answers to common questions about our services.
            </p>
          </header>

          <div className="space-y-4">
            {[
              {
                question: "How quickly can I get an appointment?",
                answer:
                  "Most appointments are available within 24-48 hours. Emergency consultations can be scheduled immediately.",
              },
              {
                question: "Do you accept insurance?",
                answer:
                  "Yes, we accept most major insurance plans. Please contact us to verify your specific coverage.",
              },
              {
                question: "Can I have a virtual consultation?",
                answer:
                  "Absolutely! We offer secure video consultations for your convenience and safety.",
              },
              {
                question: "What should I bring to my first appointment?",
                answer:
                  "Please bring your ID, insurance card, list of current medications, and any relevant medical records.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <summary className="p-6 cursor-pointer font-semibold text-[#515151] dark:text-white hover:text-[#435ba1] transition-colors">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
