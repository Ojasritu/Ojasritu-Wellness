import React from "react";
import "./Policy.css";

export default function ShippingPolicy() {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>Shipping Policy</h1>
        <p className="last-updated">Last Updated: December 2025</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Shipping Information</h2>
          <p>
            At <strong>Ojasritu Wellness</strong>, we are committed to delivering your orders efficiently and safely. We ship Ayurvedic wellness products across India with utmost care to maintain product quality.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Processing Time</h2>
          <ul>
            <li>Orders are processed within <strong>2-3 business days</strong> of confirmed payment</li>
            <li>Confirmation email will be sent once your order ships</li>
            <li>During peak seasons (festivals, pre-booking launches), processing may take up to <strong>5 business days</strong></li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Delivery Timeline</h2>
          <ul>
            <li><strong>Metro Cities (Delhi, Mumbai, Bangalore, Pune):</strong> 3-5 business days</li>
            <li><strong>Tier 2 Cities:</strong> 5-7 business days</li>
            <li><strong>Tier 3 & Remote Areas:</strong> 7-10 business days</li>
            <li><strong>Special Handling Areas:</strong> Additional 2-3 days</li>
          </ul>
          <p className="note"><strong>Note:</strong> Delivery timelines are estimates and may vary based on location, weather, and logistics partner availability.</p>
        </section>

        <section className="policy-section">
          <h2>4. Shipping Charges</h2>
          <ul>
            <li><strong>Free Shipping:</strong> On orders above ₹500</li>
            <li><strong>Standard Shipping:</strong> ₹50-100 for orders below ₹500 (varies by location)</li>
            <li><strong>Express Shipping:</strong> Available on select products (charges apply)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Shipping Partners</h2>
          <p>
            We partner with trusted logistics providers to ensure safe and timely delivery:
          </p>
          <ul>
            <li>Delhivery</li>
            <li>Blue Dart</li>
            <li>India Post</li>
            <li>Local courier partners (for specific regions)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Package Handling</h2>
          <ul>
            <li>All products are carefully packed with protective materials</li>
            <li>Ayurvedic products are handled with special care to preserve their potency</li>
            <li>Tracking information is provided for all shipments</li>
            <li>Insurance is available for high-value orders</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>7. Damaged or Lost Shipments</h2>
          <ul>
            <li>Report damaged products within <strong>48 hours</strong> of delivery with photos</li>
            <li>Lost shipments reported to courier immediately</li>
            <li>Replacement or refund processed within <strong>5-7 business days</strong> after verification</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>8. Delivery Exceptions</h2>
          <p>We cannot ship to:</p>
          <ul>
            <li>Restricted areas as per government regulations</li>
            <li>Areas with active natural calamities</li>
            <li>Regions without proper postal infrastructure</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>9. Return Shipping</h2>
          <ul>
            <li>Returns within refund window are eligible for free return shipping</li>
            <li>Return label provided in order confirmation email</li>
            <li>Return pickup arranged from your location</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>10. International Shipping</h2>
          <p>Currently, international shipping is <strong>not available</strong>. We ship only within India.</p>
        </section>

        <section className="policy-section contact-section">
          <h2>Need Help?</h2>
          <p>For shipping-related queries, please contact us:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919685679251">+91 96856 79251</a></p>
            <p><strong>Location:</strong> Bhilai, Chhattisgarh, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
