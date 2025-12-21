import React from "react";
import "./Policy.css";

export default function PrivacyPolicy() {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: December 2025</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            Ojasritu Wellness ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Information We Collect</h2>
          
          <h3>A. Information You Provide Directly</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email, phone number, password</li>
            <li><strong>Address Information:</strong> Billing and shipping addresses</li>
            <li><strong>Payment Information:</strong> Card details (processed securely by payment gateway)</li>
            <li><strong>Communication Data:</strong> Messages, inquiries, feedback, support tickets</li>
            <li><strong>Profile Information:</strong> Age, health information (for Dosha assessment)</li>
          </ul>

          <h3>B. Information Collected Automatically</h3>
          <ul>
            <li><strong>Device Information:</strong> Device type, OS, browser type</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, interactions</li>
            <li><strong>Location Data:</strong> IP address, approximate location (not precise)</li>
            <li><strong>Cookies & Tracking:</strong> Session data, preferences, user identifiers</li>
          </ul>

          <h3>C. Information from Third Parties</h3>
          <ul>
            <li>Payment processors (Razorpay, Stripe)</li>
            <li>Google OAuth authentication</li>
            <li>Analytics services</li>
            <li>Email service providers</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li><strong>Order Processing:</strong> To process, fulfill, and track your orders</li>
            <li><strong>Payment Processing:</strong> To securely process payments</li>
            <li><strong>Customer Support:</strong> To respond to inquiries and provide assistance</li>
            <li><strong>Marketing:</strong> To send promotional emails, offers, and newsletters (with consent)</li>
            <li><strong>Personalization:</strong> To customize your shopping experience</li>
            <li><strong>Analytics:</strong> To understand user behavior and improve our services</li>
            <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent transactions</li>
            <li><strong>Legal Compliance:</strong> To comply with laws and regulations</li>
            <li><strong>Health & Safety:</strong> To provide appropriate product recommendations</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Sharing Your Information</h2>
          <p>We do <strong>NOT</strong> sell your personal information. However, we may share it with:</p>
          <ul>
            <li><strong>Logistics Partners:</strong> Shipping companies for delivery (address only)</li>
            <li><strong>Payment Processors:</strong> Razorpay, Stripe (payment information)</li>
            <li><strong>Service Providers:</strong> Email, analytics, hosting providers</li>
            <li><strong>Legal Compliance:</strong> Government agencies when required by law</li>
            <li><strong>Business Partners:</strong> Only with your explicit consent</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Security of Your Information</h2>
          <ul>
            <li><strong>SSL Encryption:</strong> Website uses HTTPS for data transmission</li>
            <li><strong>Secure Payments:</strong> Payment details processed by secure gateways</li>
            <li><strong>Password Protection:</strong> Passwords hashed and encrypted</li>
            <li><strong>Access Control:</strong> Limited employee access to personal data</li>
            <li><strong>Regular Updates:</strong> Security systems regularly updated</li>
          </ul>
          <p className="note"><strong>Note:</strong> While we implement security measures, no system is 100% secure. Use strong passwords and protect your account access.</p>
        </section>

        <section className="policy-section">
          <h2>6. Your Privacy Rights</h2>
          
          <h3>A. Access & Portability</h3>
          <ul>
            <li>You can request a copy of your personal data</li>
            <li>Data provided in a portable format within 30 days</li>
          </ul>

          <h3>B. Correction & Deletion</h3>
          <ul>
            <li>Update or correct your account information anytime</li>
            <li>Request deletion of your account and associated data</li>
            <li>Some data retained for legal/compliance purposes</li>
          </ul>

          <h3>C. Marketing Preferences</h3>
          <ul>
            <li>Unsubscribe from marketing emails anytime</li>
            <li>Opt-out from personalized recommendations</li>
            <li>Manage notification preferences in account settings</li>
          </ul>

          <h3>D. Cookies & Tracking</h3>
          <ul>
            <li>Disable cookies in your browser settings</li>
            <li>Opt-out of third-party tracking (if available)</li>
            <li>Use browser "Do Not Track" feature (if supported)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>7. Cookies & Tracking Technologies</h2>
          <p>We use cookies for:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Login, session management, security</li>
            <li><strong>Performance Cookies:</strong> Analytics, error tracking, performance monitoring</li>
            <li><strong>Functional Cookies:</strong> Preferences, language settings, personalization</li>
            <li><strong>Marketing Cookies:</strong> Ad targeting, retargeting campaigns (can be disabled)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>8. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing information.
          </p>
        </section>

        <section className="policy-section">
          <h2>9. Data Retention</h2>
          <ul>
            <li><strong>Active Accounts:</strong> Data retained as long as account is active</li>
            <li><strong>After Account Deletion:</strong> Deleted within 30 days (some data retained for compliance)</li>
            <li><strong>Transaction Records:</strong> Retained for 6 years (for tax/legal purposes)</li>
            <li><strong>Marketing Data:</strong> Retained until unsubscription</li>
            <li><strong>Support Tickets:</strong> Retained for 2 years for reference</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>10. Children's Privacy</h2>
          <ul>
            <li>Our website is not intended for children under 13 years</li>
            <li>We do not knowingly collect data from children under 13</li>
            <li>If we discover such data, it will be deleted immediately</li>
            <li>Parents/guardians concerned about data collection should contact us</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>11. Health Information Disclaimer</h2>
          <p>
            <strong>Important:</strong> Any health information provided (e.g., for Dosha assessment) is used solely for product recommendations and is protected under privacy laws. It is NOT used for medical diagnosis or treatment. Always consult a qualified healthcare provider for medical advice.
          </p>
        </section>

        <section className="policy-section">
          <h2>12. GDPR Compliance (EU Users)</h2>
          <p>If you are in the EU and subject to GDPR:</p>
          <ul>
            <li>Legal basis for processing: Consent, contract performance, legitimate interests</li>
            <li>Right to withdraw consent anytime</li>
            <li>Right to lodge a complaint with data protection authority</li>
            <li>Data processing agreement available upon request</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>13. California Privacy Rights (CCPA)</h2>
          <p>If you are a California resident:</p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to delete personal information (with exceptions)</li>
            <li>Right to opt-out of sale/sharing of personal information</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>14. Policy Changes</h2>
          <p>
            We may update this privacy policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the website constitutes acceptance of changes.
          </p>
        </section>

        <section className="policy-section">
          <h2>15. International Data Transfers</h2>
          <ul>
            <li>Your information may be transferred to, stored in, and processed in countries other than India</li>
            <li>These countries may have different data protection laws</li>
            <li>By using our services, you consent to such transfers</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>16. Business Transfers</h2>
          <p>
            If Ojasritu Wellness is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you have regarding your information.
          </p>
        </section>

        <section className="policy-section contact-section">
          <h2>Contact Us</h2>
          <p>For privacy-related questions or to exercise your privacy rights, contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919685679251">+91 96856 79251</a></p>
            <p><strong>Location:</strong> Bhilai, Chhattisgarh, India</p>
            <p><strong>Response Time:</strong> 24-48 hours</p>
          </div>
          <p className="note">
            We will respond to all privacy requests within 30 days as required by applicable laws.
          </p>
        </section>
      </div>
    </div>
  );
}
