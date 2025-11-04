'use client';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: November 2025</p>

      <p className="mb-4">
        <strong>Sanjiwani Health</strong> values your privacy and is committed
        to protecting your personal data. This Privacy Policy explains how we
        collect, use, and safeguard your information when you visit our website
        or use our services.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal details (name, email, phone number, etc.)</li>
        <li>Medical or health-related information (only with consent)</li>
        <li>Usage data such as IP address, browser type, and device information</li>
      </ul>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide healthcare and consultation services</li>
        <li>To communicate updates, reminders, and service improvements</li>
        <li>To ensure platform security and prevent misuse</li>
        <li>To comply with legal and regulatory obligations</li>
      </ul>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        3. Data Protection
      </h2>
      <p className="mb-4">
        We implement robust administrative, technical, and physical safeguards
        to protect your data from unauthorized access, disclosure, alteration,
        or destruction.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        4. Sharing of Information
      </h2>
      <p className="mb-4">
        We do not sell or rent your personal data. Information may be shared
        only with trusted partners or healthcare professionals to deliver our
        services — always under confidentiality agreements.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        5. Your Rights
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Access and update your personal information</li>
        <li>Withdraw consent for data collection</li>
        <li>Request deletion of your data (subject to applicable laws)</li>
      </ul>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        6. Cookies
      </h2>
      <p className="mb-4">
        We use cookies and similar technologies to improve user experience and
        analyze website performance. You can adjust cookie preferences through
        your browser settings.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        7. Changes to This Policy
      </h2>
      <p className="mb-4">
        Sanjiwani Health reserves the right to modify this Privacy Policy at any
        time. Updates will be posted on this page with the revised effective
        date.
      </p>

      <h2 className="text-xl font-semibold text-teal-600 mt-6 mb-2">
        8. Contact Us
      </h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        reach out at{' '}
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
