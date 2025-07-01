
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const HelpCenter = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our menu, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery."
    },
    {
      question: "What are the delivery charges?",
      answer: "Delivery charges vary based on distance and order value. Orders above ₹299 get free delivery within 5km radius."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 25-40 minutes. During peak hours, it may take up to 60 minutes."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, you'll receive SMS updates and can track your order in real-time through our app or website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 2 minutes of placing it. After that, please contact customer support."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">We're here to help you with any questions or concerns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6">Contact Us</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-gray-600">+91 1800-123-4567</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Mail className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">support@hemanku.com</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <MessageCircle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Clock className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Support Hours</h3>
                    <p className="text-gray-600">24/7 Customer Support</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <button
                    className="w-full text-left flex justify-between items-center"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card className="p-6 mt-8">
              <h3 className="text-lg font-semibold mb-4">Still need help? Contact us</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Your Email" type="email" />
                </div>
                <Input placeholder="Subject" />
                <Textarea placeholder="Describe your issue..." rows={4} />
                <Button className="w-full btn-primary">Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
