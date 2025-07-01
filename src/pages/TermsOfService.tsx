
import React from 'react';
import { Card } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Hemanku's services, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
              <p className="text-gray-700 mb-4">
                Hemanku is an online food delivery platform that connects customers with local restaurants. 
                We facilitate the ordering and delivery process but do not prepare the food ourselves.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p className="text-gray-700 mb-4">As a user, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service for lawful purposes only</li>
                <li>Pay for all orders placed through your account</li>
                <li>Treat delivery personnel with respect</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Orders and Payments</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All orders are subject to restaurant availability</li>
                <li>Prices may vary and are subject to change</li>
                <li>Payment is due at the time of order placement</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>You are responsible for any applicable taxes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Delivery</h2>
              <p className="text-gray-700 mb-4">
                Delivery times are estimates and may vary due to weather, traffic, or high demand. 
                We are not liable for delays beyond our reasonable control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cancellation and Refunds</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Orders can be cancelled within 2 minutes of placement</li>
                <li>Refunds for cancelled orders will be processed within 5-7 business days</li>
                <li>Food quality issues should be reported within 24 hours</li>
                <li>Refund eligibility is determined on a case-by-case basis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on our platform, including logos, designs, and text, is owned by Hemanku 
                and protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Hemanku is not liable for any indirect, incidental, or consequential damages arising 
                from the use of our services. Our liability is limited to the amount paid for the specific order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of India. Any disputes will be resolved in the 
                courts of Bangalore, Karnataka.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: legal@hemanku.com</p>
                <p>Phone: +91 1800-123-4567</p>
                <p>Address: 123 Tech Park, Bangalore, India</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
