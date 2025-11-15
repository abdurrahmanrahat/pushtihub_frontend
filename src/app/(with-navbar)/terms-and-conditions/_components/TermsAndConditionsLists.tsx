const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing and using the Gadgetoria website (the "Site"), you accept and agree to be bound by 
      these Terms and Conditions. If you do not agree to these terms, please do not use our Site. We reserve the 
      right to modify these terms at any time, and your continued use of the Site constitutes acceptance of any 
      changes.`,
  },
  {
    title: "Use of the Site",
    content: `You may use our Site for lawful purposes only. You agree not to use the Site in any way that could 
      damage, disable, overburden, or impair the Site, or interfere with any other party's use of the Site. You may 
      not attempt to gain unauthorized access to any portion of the Site, other accounts, computer systems, or 
      networks connected to the Site.`,
  },
  {
    title: "Account Registration",
    content: `To access certain features of the Site, you may be required to register for an account. You agree 
      to provide accurate, current, and complete information during registration and to update such information to 
      keep it accurate, current, and complete. You are responsible for safeguarding your account password and for 
      any activities or actions under your account.`,
  },
  {
    title: "Product Information and Pricing",
    content: `We strive to provide accurate product descriptions, images, and pricing information. However, we do 
      not warrant that product descriptions, images, pricing, or other content on the Site is accurate, complete, 
      reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and 
      to change or update information at any time without prior notice.`,
  },
  {
    title: "Orders and Payment",
    content: `All orders are subject to acceptance by Gadgetoria. We reserve the right to refuse or cancel any 
      order for any reason, including but not limited to product availability, errors in pricing or product 
      information, or suspected fraudulent activity. Payment must be received before we dispatch your order. We 
      accept various payment methods as indicated on the Site.`,
  },
  {
    title: "Shipping and Delivery",
    content: `We will make reasonable efforts to deliver products within the estimated timeframes provided. However, 
      delivery times are estimates only and not guaranteed. We are not liable for delays caused by shipping carriers, 
      customs clearance, or other factors beyond our control. Risk of loss and title for items purchased pass to you 
      upon delivery to the carrier.`,
  },
  {
    title: "Returns and Refunds",
    content: `Our return and refund policy is detailed on our Returns & Refunds page. Please review that policy 
      for information about returning products and requesting refunds. We reserve the right to refuse returns that 
      do not meet our policy requirements.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on the Site, including text, graphics, logos, images, software, and other materials, is 
      the property of Gadgetoria or its content suppliers and is protected by intellectual property laws. You may not 
      reproduce, distribute, modify, or create derivative works of any content without our express written permission.`,
  },
  {
    title: "User Content",
    content: `You may have the opportunity to submit reviews, comments, or other content to the Site. You grant 
      Gadgetoria a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt, 
      publish, and display such content. You represent that you own or have the necessary rights to any content you 
      submit and that it does not violate any third-party rights.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, Gadgetoria shall not be liable for any indirect, incidental, 
      special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or 
      indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Site 
      or products purchased through the Site.`,
  },
  {
    title: "Warranty Disclaimer",
    content: `The Site and all products are provided "as is" and "as available" without warranties of any kind, 
      either express or implied. We do not warrant that the Site will be uninterrupted, secure, or error-free. 
      Products sold are subject to manufacturer warranties, if any, as described in the product information.`,
  },
  {
    title: "Indemnification",
    content: `You agree to indemnify, defend, and hold harmless Gadgetoria and its officers, directors, employees, 
      and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, 
      arising out of or in any way connected with your access to or use of the Site, your violation of these Terms, 
      or your violation of any third-party rights.`,
  },
  {
    title: "Third-Party Links",
    content: `The Site may contain links to third-party websites or services that are not owned or controlled by 
      Gadgetoria. We have no control over and assume no responsibility for the content, privacy policies, or practices 
      of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable 
      for any damage or loss caused by your use of such websites or services.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, 
      United States, without regard to its conflict of law provisions. You agree to submit to the personal and 
      exclusive jurisdiction of the courts located in San Francisco, California for any disputes arising from these 
      Terms or your use of the Site.`,
  },
  {
    title: "Contact Information",
    content: `If you have any questions about these Terms and Conditions, please contact us at: 
      legal@gadgetoria.com or write to us at Gadgetoria, 123 Tech Street, San Francisco, CA 94102, USA.`,
  },
];

const TermsAndConditionsLists = () => {
  return (
    <div className="space-y-8 px-2">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            {index + 1}. {section.title}
          </h2>
          <p className="text-muted-foreground text-justify">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TermsAndConditionsLists;
