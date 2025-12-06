import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, TrendingUp, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "আমাদের মিশন",
    description:
      "বাংলাদেশের মানুষকে সচেতন করা, সুপার ফুড ও পুষ্টিকর খাবার সরবরাহ করা এবং সুস্থ জীবনধারা তৈরি করতে সহায়তা করা।",
  },
  {
    icon: Users,
    title: "গ্রাহক সবার আগে",
    description:
      "বিশুদ্ধ পণ্য, দ্রুত সেবা এবং নির্ভরযোগ্য সহায়তার মাধ্যমে আমরা গ্রাহকের সুস্থতা ও সন্তুষ্টিকে অগ্রাধিকার দিই।",
  },
  {
    icon: Award,
    title: "গুণগত মান নিশ্চিত",
    description:
      "প্রতিটি পণ্য কঠোর মান-নিয়ন্ত্রণের মাধ্যমে নির্বাচন করা হয়, যাতে আপনি পান বিশুদ্ধ, নিরাপদ এবং উচ্চমানের খাদ্য।",
  },
  {
    icon: TrendingUp,
    title: "নবপ্রবর্তন",
    description:
      "আমরা পুষ্টি ও ফুড-টেক ট্রেন্ড অনুসরণ করে নতুন, উন্নত এবং স্বাস্থ্যকর ফুড অপশন নিয়মিত নিয়ে আসি।",
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
