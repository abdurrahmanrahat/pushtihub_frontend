const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us when you create an account, make a purchase, 
      or contact us. This includes your name, email address, phone number, shipping address, payment information, 
      and order history. We also automatically collect certain information about your device and how you interact 
      with our website, including IP address, browser type, pages visited, and time spent on our site.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to process your orders, communicate with you about your purchases, 
      provide customer support, send marketing communications (with your consent), improve our website and services, 
      detect and prevent fraud, and comply with legal obligations. We may also use aggregated, anonymized data for 
      analytics and business insights.`,
  },
  {
    title: "Information Sharing and Disclosure",
    content: `We do not sell your personal information to third parties. We may share your information with 
      service providers who help us operate our business (such as payment processors, shipping companies, and 
      email service providers), when required by law or to protect our rights, in connection with a business 
      transaction such as a merger or acquisition, and with your consent or at your direction.`,
  },
  {
    title: "Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information 
      against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, 
      secure servers, regular security assessments, and access controls. However, no method of transmission over the 
      internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "Your Rights and Choices",
    content: `You have the right to access, correct, or delete your personal information. You can update your 
      account information at any time by logging into your account. You may opt out of marketing communications by 
      following the unsubscribe link in our emails or contacting us directly. Depending on your location, you may 
      have additional rights under data protection laws such as GDPR or CCPA.`,
  },
  {
    title: "Cookies and Tracking Technologies",
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze site 
      traffic, and personalize content. You can control cookies through your browser settings, but disabling cookies 
      may affect the functionality of our website. We may also use third-party analytics services to understand how 
      users interact with our site.`,
  },
  {
    title: "Children's Privacy",
    content: `Our website is not intended for children under the age of 13, and we do not knowingly collect 
      personal information from children. If we become aware that we have collected personal information from a 
      child without parental consent, we will take steps to delete that information.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal 
      requirements. We will notify you of any material changes by posting the updated policy on our website and 
      updating the "Last Updated" date. We encourage you to review this policy periodically.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@gadgetoria.com.`,
  },
];

const PrivacyPolicyLists = () => {
  return (
    <div className="space-y-8 px-2">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
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

export default PrivacyPolicyLists;
