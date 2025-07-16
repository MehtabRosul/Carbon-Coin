
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, BarChart } from "lucide-react";
import Image from 'next/image';

export default function LearnMorePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Understanding Your Carbon Footprint"
        description="Learn how your actions impact the environment and how Carbon Coin helps you track your progress."
      />

      <div className="space-y-12">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-8">
              <h3 className="flex items-center gap-2 font-headline text-2xl mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span>Agricultural Sequestration</span>
              </h3>
              <p className="text-muted-foreground">
                Sustainable farming practices can turn your fields into powerful carbon sinks. By adopting techniques like no-till farming, cover cropping, and improved grazing management, you can enhance soil health and draw significant amounts of CO₂ from the atmosphere. Carbon Coin helps you quantify these efforts by taking into account your specific land use, climate zone, soil type, and organic matter content, providing a clear picture of your contribution to fighting climate change.
              </p>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image src="https://placehold.co/600x400.png" alt="Lush agricultural field" layout="fill" objectFit="cover" data-ai-hint="agriculture field" />
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
             <div className="relative h-64 md:h-auto order-last md:order-first">
                <Image src="https://placehold.co/600x400.png" alt="Solar panels in a field" layout="fill" objectFit="cover" data-ai-hint="solar panels" />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="flex items-center gap-2 font-headline text-2xl mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                  <span>Technological Interventions</span>
              </h3>
              <p className="text-muted-foreground">
                Technology plays a crucial role in reducing our carbon footprint. From harnessing solar power and driving electric vehicles to implementing efficient drip irrigation systems and producing clean energy with biogas plants, each intervention matters. Our platform uses established formulas and emission factors to calculate the carbon savings from these technologies, allowing you to see the direct environmental benefits of your investments in a sustainable future.
              </p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
             <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8">
                    <h3 className="flex items-center gap-2 font-headline text-2xl mb-4">
                        <BarChart className="h-6 w-6 text-primary" />
                        <span>Data-Driven Impact</span>
                    </h3>
                    <p className="text-muted-foreground">
                        What gets measured gets managed. Carbon Coin provides you with an interactive dashboard to visualize your progress over time. Track your total CO₂e savings, see breakdowns by category, and identify your most impactful activities. By turning your sustainable actions into clear, measurable data, you can make informed decisions, set new goals, and effectively communicate your positive impact to stakeholders, customers, and your community.
                    </p>
                </div>
                <div className="relative h-64 md:h-auto">
                    <Image src="https://placehold.co/600x400.png" alt="Dashboard with charts" layout="fill" objectFit="cover" data-ai-hint="dashboard chart" />
                </div>
            </div>
        </Card>

      </div>
    </div>
  );
}
