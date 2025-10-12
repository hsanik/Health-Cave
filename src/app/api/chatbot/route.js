import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, conversationHistory } = await request.json();

    // TODO: Integrate with OpenAI API
    // For now, we'll use a simple rule-based response system
    // When you're ready to integrate OpenAI, replace this with actual API call

    /* 
    Example OpenAI Integration (uncomment when ready):
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant for HealthCave. Provide helpful information about doctors, appointments, and general health inquiries. Always recommend consulting with a healthcare professional for medical advice.'
          },
          ...conversationHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await openaiResponse.json();
    const reply = data.choices[0].message.content;
    */

    // Temporary rule-based responses (remove when OpenAI is integrated)
    const lowerMessage = message.toLowerCase();
    let reply;

    if (lowerMessage.includes('doctor') || lowerMessage.includes('find')) {
      reply = "I can help you find the perfect doctor! You can browse our list of qualified doctors on the Doctors page. Would you like to know about any specific specialization?";
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
      reply = "To book an appointment, simply select a doctor from our list and choose an available time slot. You can also check their availability on their profile page. Would you like help finding a specific specialist?";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
      reply = "You can find all our contact information on the Contact Us page. We're available 24/7 to assist you with your healthcare needs!";
    } else if (lowerMessage.includes('service') || lowerMessage.includes('about')) {
      reply = "HealthCave is your comprehensive online medical platform. We offer video consultations, appointment booking, medical records management, and much more. Visit our About page to learn more!";
    } else if (lowerMessage.includes('video') || lowerMessage.includes('call') || lowerMessage.includes('consultation')) {
      reply = "We offer secure video consultations with our doctors. After booking an appointment, you'll receive a link to join the video call at your scheduled time.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      reply = "Hello! How can I assist you today? I can help you with finding doctors, booking appointments, or answering questions about our services.";
    } else if (lowerMessage.includes('thank')) {
      reply = "You're welcome! Feel free to ask if you need any more assistance. Your health is our priority!";
    } else {
      reply = "I'm here to help! I can assist you with:\n\n• Finding qualified doctors\n• Booking appointments\n• Information about our services\n• Video consultation details\n• Contact information\n\nWhat would you like to know?";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        reply: 'I apologize, but I encountered an error. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

