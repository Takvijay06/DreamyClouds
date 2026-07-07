export interface PolicySection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface PolicyDefinition {
  slug: string;
  path: string;
  title: string;
  sections: PolicySection[];
}

export const POLICIES: PolicyDefinition[] = [
  {
    slug: 'privacy-policy',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    sections: [
      {
        paragraphs: [
          'Dreamy Clouds By Daisy ("we", "us", or "our") respects your privacy. This policy explains what information we collect when you use our website, place an order, or contact us, and how we use it.'
        ]
      },
      {
        heading: 'Information We Collect',
        paragraphs: ['We may collect the following information when you interact with our store:'],
        list: [
          'Name and contact details (phone number, email, delivery address) provided during checkout or inquiry',
          'Order details such as product type, design selection, quantity, and customization notes',
          'Messages sent via WhatsApp, email, or contact forms',
          'Basic usage data such as pages visited and device/browser type for analytics'
        ]
      },
      {
        heading: 'How We Use Your Information',
        paragraphs: ['We use your information to:'],
        list: [
          'Process and fulfill your orders',
          'Communicate order updates, delivery status, and support responses',
          'Improve our products, website experience, and customer service',
          'Comply with legal and regulatory requirements'
        ]
      },
      {
        heading: 'Data Sharing',
        paragraphs: [
          'We do not sell your personal information. We may share limited data with delivery partners, payment processors, or service providers only as needed to complete your order or operate our business.'
        ]
      },
      {
        heading: 'Data Security',
        paragraphs: [
          'We take reasonable steps to protect your information. However, no online transmission or storage method is completely secure.'
        ]
      },
      {
        heading: 'Your Choices',
        paragraphs: [
          'You may contact us to update or request deletion of your personal information, subject to legal and operational requirements such as completed order records.'
        ]
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For privacy-related questions, email us at dreamycloudsbydaisy@gmail.com or reach us on WhatsApp at +91 6350422134.'
        ]
      }
    ]
  },
  {
    slug: 'return-and-refund-policy',
    path: '/return-and-refund-policy',
    title: 'Return and Refund Policy',
    sections: [
      {
        paragraphs: [
          'Because Dreamy Clouds By Daisy products are customized with your selected design, name, photo, or text, most orders are made specifically for you and cannot be resold.'
        ]
      },
      {
        heading: 'Eligible Returns',
        paragraphs: ['We accept returns or replacements only in the following cases:'],
        list: [
          'The product arrived damaged or defective',
          'The wrong product or design was delivered',
          'Print quality issues caused by our production process',
          'Missing items from your confirmed order'
        ]
      },
      {
        heading: 'Non-Returnable Items',
        paragraphs: ['Returns are generally not accepted for:'],
        list: [
          'Change of mind after order confirmation',
          'Incorrect details provided by the customer (spelling, photo, design choice, etc.)',
          'Normal minor color or finish variation due to screen and material differences',
          'Products that show signs of use after delivery'
        ]
      },
      {
        heading: 'Reporting Window',
        paragraphs: [
          'Please contact us within 48 hours of delivery with clear photos or videos of the issue. Claims reported after this window may not be eligible for replacement or refund.'
        ]
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'Approved refunds are processed to the original payment method within 5–7 business days after verification. Shipping charges are non-refundable unless the issue was caused by us.'
        ]
      },
      {
        heading: 'How to Request a Return',
        paragraphs: [
          'Message us on WhatsApp at +91 6350422134 or email dreamycloudsbydaisy@gmail.com with your order details, issue description, and supporting images.'
        ]
      }
    ]
  },
  {
    slug: 'cancellation-policy',
    path: '/cancellation-policy',
    title: 'Cancellation Policy',
    sections: [
      {
        paragraphs: [
          'You may cancel your order depending on its production status. Because customized products are prepared quickly, cancellation approval is based on whether production has started.'
        ]
      },
      {
        heading: 'Before Production Starts',
        paragraphs: [
          'If your order has not entered production, you may request cancellation via WhatsApp or email. A full refund will be issued for prepaid orders once cancellation is confirmed.'
        ]
      },
      {
        heading: 'After Production Starts',
        paragraphs: [
          'Once printing or customization has begun, cancellation is usually not possible because the product is being made specifically for you.'
        ]
      },
      {
        heading: 'How to Cancel',
        paragraphs: [
          'Contact us as soon as possible with your order ID, name, and phone number. We will confirm whether cancellation is still possible and share the next steps.'
        ]
      },
      {
        heading: 'Refund Timeline',
        paragraphs: [
          'Approved cancellation refunds are processed within 5–7 business days. Processing time may vary depending on your bank or payment provider.'
        ]
      }
    ]
  },
  {
    slug: 'shipping-policy',
    path: '/shipping-policy',
    title: 'Shipping Policy',
    sections: [
      {
        paragraphs: [
          'We ship customized tumblers, mugs, bookmarks, and related gift products across India. Delivery timelines may vary based on location, order volume, and production schedule.'
        ]
      },
      {
        heading: 'Processing Time',
        paragraphs: [
          'Most orders are prepared within 1–3 business days after design confirmation and payment. Bulk or event orders may require additional processing time, which we will communicate upfront.'
        ]
      },
      {
        heading: 'Delivery Time',
        paragraphs: [
          'Standard delivery usually takes 3–7 business days after dispatch, depending on your city and courier partner serviceability. Remote locations may take longer.'
        ]
      },
      {
        heading: 'Shipping Charges',
        paragraphs: [
          'Shipping fees, if applicable, are shown during order confirmation. Free or discounted shipping may be offered during promotions or for qualifying order values.'
        ]
      },
      {
        heading: 'Order Tracking',
        paragraphs: [
          'Once your order is dispatched, we share tracking details on WhatsApp or email whenever available from our courier partner.'
        ]
      },
      {
        heading: 'Delivery Issues',
        paragraphs: [
          'If your package is delayed, lost, or received in damaged condition, contact us within 48 hours with photos and your order details so we can assist promptly.'
        ]
      }
    ]
  },
  {
    slug: 'terms-of-service',
    path: '/terms-of-service',
    title: 'Terms of Services',
    sections: [
      {
        paragraphs: [
          'By using the Dreamy Clouds By Daisy website and placing an order, you agree to these Terms of Services. Please read them carefully before confirming your purchase.'
        ]
      },
      {
        heading: 'Orders and Customization',
        paragraphs: [
          'You are responsible for reviewing your selected product, design, spelling, quantity, and delivery details before checkout. Once confirmed, customized orders may not be changed if production has started.'
        ]
      },
      {
        heading: 'Pricing and Payment',
        paragraphs: [
          'Prices are listed in Indian Rupees (INR) unless stated otherwise. We reserve the right to update pricing, offers, and product availability at any time. Payment must be completed as agreed during order confirmation.'
        ]
      },
      {
        heading: 'Intellectual Property',
        paragraphs: [
          'You confirm that any image, logo, or content you provide for printing does not infringe third-party rights. We may refuse or cancel orders that appear to violate copyright, trademark, or applicable laws.'
        ]
      },
      {
        heading: 'Product Representation',
        paragraphs: [
          'We try to display colors and finishes accurately, but minor variation may occur due to screen settings, lighting, and printing materials.'
        ]
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the extent permitted by law, Dreamy Clouds By Daisy is not liable for indirect or consequential losses. Our liability for any eligible claim is limited to the value of the affected order.'
        ]
      },
      {
        heading: 'Changes to Terms',
        paragraphs: [
          'We may update these terms from time to time. Continued use of our website after updates means you accept the revised terms.'
        ]
      },
      {
        heading: 'Contact',
        paragraphs: [
          'For questions about these terms, contact us at dreamycloudsbydaisy@gmail.com or WhatsApp +91 6350422134.'
        ]
      }
    ]
  }
];

export const getPolicyBySlug = (slug: string) => POLICIES.find((policy) => policy.slug === slug);
