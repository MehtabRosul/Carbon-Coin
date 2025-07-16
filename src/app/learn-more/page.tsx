
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, BarChart, LogIn, Edit, FileText, CheckCircle } from "lucide-react";
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
                Sustainable farming practices can turn your fields into powerful carbon sinks. By adopting techniques like no-till farming, planting cover crops, and implementing rotational grazing, you enhance soil health and draw significant amounts of CO₂ from the atmosphere. These methods not only combat climate change but also improve water retention, reduce erosion, and boost biodiversity. Carbon Coin helps you quantify these efforts by taking into account your specific land use, climate zone, soil type, and organic matter content, providing a clear picture of your contribution.
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
                Technology plays a crucial role in reducing our carbon footprint. From harnessing solar power and driving electric vehicles to implementing efficient drip irrigation and producing clean energy with biogas plants, each intervention matters. For example, by switching to an EV, you eliminate tailpipe emissions, and our platform calculates the savings based on the emissions of the gasoline vehicle it replaced. Our platform uses established scientific formulas and emission factors to calculate the carbon savings from these technologies, allowing you to see the direct environmental benefits of your investments.
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
                        What gets measured gets managed. Carbon Coin provides you with an interactive dashboard to visualize your progress over time. Track your total CO₂e savings, see breakdowns by category, and identify your most impactful activities. This data is invaluable, whether you're aiming for carbon credit markets, fulfilling corporate sustainability reporting requirements, or simply tracking personal goals. By turning your sustainable actions into clear, measurable data, you can make informed decisions and effectively communicate your positive impact.
                    </p>
                </div>
                <div className="relative h-64 md:h-auto">
                    <Image src="https://placehold.co/600x400.png" alt="Dashboard with charts" layout="fill" objectFit="cover" data-ai-hint="dashboard chart" />
                </div>
            </div>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">How It Works</CardTitle>
                <CardDescription className="text-center max-w-xl mx-auto">
                    A simple, four-step process to track and quantify your carbon savings.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <LogIn className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">1. Sign Up</h4>
                    <p className="text-sm text-muted-foreground">Create your free account to get started.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Edit className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">2. Log Data</h4>
                    <p className="text-sm text-muted-foreground">Use our wizards to input your farm data and interventions.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">3. See Results</h4>
                    <p className="text-sm text-muted-foreground">View your calculated savings on the interactive dashboard.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">4. Generate Reports</h4>
                    <p className="text-sm text-muted-foreground">Download summaries of your impact to share.</p>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
