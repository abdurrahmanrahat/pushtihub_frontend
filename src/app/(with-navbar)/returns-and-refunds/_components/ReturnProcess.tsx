import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "1",
    title: "Contact Us",
    description:
      "Email support@gadgetoria.com with your order number and reason for return within 30 days of delivery.",
  },
  {
    number: "2",
    title: "Get Authorization",
    description:
      "Receive a Return Merchandise Authorization (RMA) number and shipping instructions from our team.",
  },
  {
    number: "3",
    title: "Ship the Item",
    description:
      "Pack the item securely in its original packaging and ship it to the address provided with your RMA number.",
  },
  {
    number: "4",
    title: "Receive Refund",
    description:
      "Once we receive and inspect your return, we'll process your refund within 5-7 business days.",
  },
];

const ReturnProcess = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        How to Return an Item
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <Card key={step.number}>
            <CardContent className="">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ReturnProcess;
