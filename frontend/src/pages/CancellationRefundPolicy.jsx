import React from "react";
import "./Policy.css";

export default function CancellationRefundPolicy() {
  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>Cancellation & Refund Policy</h1>
        <p className="last-updated">Last Updated: December 2025</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Overview</h2>
          <p>
            At Ojasritu Wellness, we want you to be completely satisfied with your purchase. This policy outlines our cancellation and refund procedures for your peace of mind.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Refund Window</h2>
          <p>
            You can request a refund within <strong>9 to 15 days</strong> from the date of purchase.
          </p>
          <ul>
            <li>Refund requests made after 15 days will <strong>not be accepted</strong></li>
            <li>The refund window is calculated from the order confirmation date</li>
            <li>For pre-booked items, the window starts from payment confirmation</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. Cancellation After Order Placement</h2>
          <h3>Before Payment Processing</h3>
          <ul>
            <li>Orders can be cancelled <strong>free of charge</strong> before payment is confirmed</li>
            <li>Send cancellation request to <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></li>
            <li>Cancellation confirmed within <strong>24 hours</strong></li>
          </ul>

          <h3>After Payment Confirmed</h3>
          <ul>
            <li>Cancellations are subject to refund policy</li>
            <li>Requests must be made within the 9-15 day window</li>
            <li>Refund will be processed as per timeline below</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Refund Eligibility</h2>
          <p>Refunds are eligible if:</p>
          <ul>
            <li>Product is <strong>unused and in original packaging</strong></li>
            <li>Request is made within <strong>9-15 days</strong> of purchase</li>
            <li>Product is not damaged due to customer mishandling</li>
            <li>All original seals and packaging are intact</li>
          </ul>

          <p className="warning"><strong>⚠️ Non-Refundable Items:</strong></p>
          <ul>
            <li><strong>Consumable Products:</strong> Once opened or used, Ayurvedic products cannot be refunded</li>
            <li>Products damaged due to improper storage</li>
            <li>Products with broken seals or labels</li>
            <li>Items purchased during promotional/clearance sales (unless defective)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. Refund Process</h2>
          <h3>Step 1: Initiate Return</h3>
          <ul>
            <li>Contact us with order ID and reason for return</li>
            <li>Email: <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></li>
            <li>Phone: <a href="tel:+919685679251">+91 96856 79251</a></li>
            <li>Response provided within <strong>24-48 hours</strong></li>
          </ul>

          <h3>Step 2: Return Authorization</h3>
          <ul>
            <li>We provide a return label (prepaid shipping)</li>
            <li>Pack the item securely in original packaging</li>
            <li>Drop at nearest courier location</li>
          </ul>

          <h3>Step 3: Quality Inspection</h3>
          <ul>
            <li>Received items inspected for condition and eligibility</li>
            <li>Inspection takes <strong>3-5 business days</strong></li>
          </ul>

          <h3>Step 4: Refund Processing</h3>
          <ul>
            <li>Refund is initiated after inspection approval</li>
            <li>Refund amount credited to original payment method</li>
            <li>Processing time: <strong>6-8 working days</strong></li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. Refund Timeline</h2>
          <table className="timeline-table">
            <tbody>
              <tr>
                <td><strong>Step</strong></td>
                <td><strong>Timeframe</strong></td>
              </tr>
              <tr>
                <td>Return request acceptance</td>
                <td>24-48 hours</td>
              </tr>
              <tr>
                <td>Return label delivery</td>
                <td>24 hours</td>
              </tr>
              <tr>
                <td>Item shipping back to warehouse</td>
                <td>3-7 days (depends on location)</td>
              </tr>
              <tr>
                <td>Quality inspection</td>
                <td>3-5 business days</td>
              </tr>
              <tr>
                <td>Refund processing & credit</td>
                <td>6-8 working days</td>
              </tr>
              <tr>
                <td><strong>Total Timeline</strong></td>
                <td><strong>15-30 days</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="policy-section">
          <h2>7. Refund Deductions</h2>
          <ul>
            <li><strong>Return Shipping:</strong> Free (prepaid label provided)</li>
            <li><strong>No Processing Fees:</strong> We don't charge processing fees</li>
            <li><strong>Promotional Discounts:</strong> Refund amount = discounted price paid</li>
            <li><strong>COD Charges:</strong> If applicable, may be deducted from refund</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>8. Non-Returnable Items</h2>
          <ul>
            <li>Items marked as "Final Sale"</li>
            <li>Digital products/gift cards</li>
            <li>Items purchased from third-party sellers (if applicable)</li>
            <li>Customized or personalized products</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>9. Defective or Damaged Items</h2>
          <ul>
            <li>If item is defective, report within <strong>48 hours</strong> of delivery with photos</li>
            <li>Replacement or full refund provided without inspection charges</li>
            <li>Return shipping arranged free of charge</li>
            <li>Replacement shipped immediately upon inspection</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>10. Special Note: Ayurvedic Products</h2>
          <p>
            <strong>Important Disclaimer:</strong> Ayurvedic products are consumable wellness items. Once opened, consumed, or used, they cannot be refunded due to health and hygiene regulations. We recommend:
          </p>
          <ul>
            <li>Carefully review product descriptions before ordering</li>
            <li>Consult with an Ayurvedic practitioner before use if you have concerns</li>
            <li>Check expiry dates and storage instructions upon delivery</li>
            <li>Report any quality issues immediately</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>11. Partial Refunds</h2>
          <p>
            Partial refunds may be issued if:
          </p>
          <ul>
            <li>Customer receives wrong quantity (reduced accordingly)</li>
            <li>Item has minor packaging damage but is usable</li>
            <li>Partial product use due to defect</li>
          </ul>
          <p>
            Partial refund amount will be decided on case-by-case basis after inspection.
          </p>
        </section>

        <section className="policy-section">
          <h2>12. Exchange Policy</h2>
          <ul>
            <li>Same product in different size/variant: Free exchange within 15 days</li>
            <li>Different product: Process as return + new purchase</li>
            <li>Exchange shipping: Free (prepaid label provided)</li>
            <li>New item shipped upon receiving and inspecting returned item</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>13. Pre-Booking Orders</h2>
          <ul>
            <li>Pre-booking cancellations: Full refund if cancelled before <strong>3 days</strong> of pre-booking start</li>
            <li>After 3 days: Refund subject to inspection and policy terms</li>
            <li>Post-delivery returns: Standard refund policy applies</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>14. Dispute Resolution</h2>
          <p>
            If you have a dispute regarding your refund:
          </p>
          <ul>
            <li>Contact customer service with order details and photos</li>
            <li>Provide clear explanation of the issue</li>
            <li>We aim to resolve all disputes within <strong>7 business days</strong></li>
            <li>If unresolved, escalation to management team</li>
          </ul>
        </section>

        <section className="policy-section contact-section">
          <h2>Have Questions?</h2>
          <p>Contact our customer service team for any clarifications:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> <a href="mailto:support@ojasritu.co.in">support@ojasritu.co.in</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919685679251">+91 96856 79251</a></p>
            <p><strong>Location:</strong> Bhilai, Chhattisgarh, India</p>
            <p><strong>Response Time:</strong> 24-48 hours</p>
          </div>
        </section>
      </div>
    </div>
  );
}
