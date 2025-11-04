'use client';
import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">
        Terms & Conditions
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: November 2025</p>

      <p className="mb-4">
        Welcome to <strong>Sanjiwani Health</strong>. By accessing or using our
        website, mobile app, and services, you agree to comply with and be bound
        by the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By using our services, you acknowledge that you have read, understood,
        and agree to be bound by these Terms and Conditions. If you do not
        agree, please refrain from using our services.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        2. Services Overview
      </h2>
      <p className="mb-4">
        Sanjiwani Health is a digital healthcare platform that connects users
        with healthcare professionals, offers appointment booking, online
        consultations, and health-related digital services.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide accurate, complete, and updated information.</li>
        <li>Maintain confidentiality of your account and password.</li>
        <li>
          Use the platform only for lawful and intended healthcare purposes.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        4. Intellectual Property
      </h2>
      <p className="mb-4">
        All content, logos, graphics, and materials on this website are the
        property of Sanjiwani Health and protected under applicable intellectual
        property laws. Unauthorized use is strictly prohibited.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        5. Limitation of Liability
      </h2>
      <p className="mb-4">
        Sanjiwani Health is not responsible for any direct, indirect, or
        consequential damages resulting from the use or inability to use our
        services, including delays or disruptions caused by technical issues.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        6. Modifications
      </h2>
      <p className="mb-4">
        We reserve the right to modify or update these Terms & Conditions at any
        time. Continued use of the website or app after updates constitutes your
        acceptance of the revised terms.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        7. Contact Us
      </h2>
      <p>
        For any questions or concerns regarding these Terms, please contact us
        at{' '}
        <a
          href="mailto:healthsanjiwani@gmail.com"
          className="text-teal-600 underline"
        >
          healthsanjiwani@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
