import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, TrendingUp, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide premium tech products that enhance productivity and creativity for professionals worldwide.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "We prioritize customer satisfaction with exceptional service, quality products, and reliable support.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "Every product is carefully selected and tested to meet our high standards of excellence.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We stay ahead of technology trends to bring you the latest and most innovative products.",
  },
];

const ValuesGrid = () => {
  return (
    <section className="mb-16">
      {/* <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Our Values
          </h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <Card key={value.title} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ValuesGrid;
