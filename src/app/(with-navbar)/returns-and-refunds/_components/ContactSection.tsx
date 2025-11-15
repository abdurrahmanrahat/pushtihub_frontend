import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const ContactSection = () => {
  return (
    <section>
      <div className="pt-6 text-center">
        <Package className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">
          Need Help with a Return?
        </h3>
        <p className="text-muted-foreground mb-4">
          Our customer support team is here to assist you with any questions
          about returns or refunds.
        </p>
        <Button size="lg">Contact Support</Button>
      </div>
    </section>
  );
};

export default ContactSection;
