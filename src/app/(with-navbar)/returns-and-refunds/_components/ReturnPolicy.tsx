import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

const eligibleItems = [
  "Unopened products in original packaging",
  "Defective or damaged items upon arrival",
  "Wrong item received",
  "Items returned within 30 days of delivery",
];

const nonEligibleItems = [
  "Products without original packaging",
  "Used or installed software",
  "Items damaged due to misuse",
  "Special order or customized products",
];

const ReturnPolicy = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Return Policy
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent className="-mt-2">
            <ul className="space-y-2">
              {eligibleItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Not Eligible for Return
            </CardTitle>
          </CardHeader>
          <CardContent className="-mt-2">
            <ul className="space-y-2">
              {nonEligibleItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReturnPolicy;
