
"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { ref, set } from "firebase/database"
import { Separator } from "@/components/ui/separator"

const focusOptions = [
  "Environment & Climate",
  "Health & Well-being",
  "Education & Skills",
  "Economic Development",
  "Social Inclusion",
]

const outcomeOptions = [
  "Reduced CO₂ emissions",
  "Improved public health",
  "Increased access to education",
  "Job creation",
  "Community resilience",
  "Resource efficiency",
]

const scaleOptions = [
  "1 – 100",
  "101 – 1,000",
  "1,001 – 10,000",
  "10,001 +",
]

const sdgOptions = [
  "SDG 1: No Poverty",
  "SDG 2: Zero Hunger",
  "SDG 3: Good Health and Well-being",
  "SDG 4: Quality Education",
  "SDG 5: Gender Equality",
  "SDG 6: Clean Water and Sanitation",
  "SDG 7: Affordable and Clean Energy",
  "SDG 8: Decent Work and Economic Growth",
  "SDG 9: Industry, Innovation and Infrastructure",
  "SDG 10: Reduced Inequalities",
  "SDG 11: Sustainable Cities and Communities",
  "SDG 12: Responsible Consumption and Production",
  "SDG 13: Climate Action",
  "SDG 14: Life Below Water",
  "SDG 15: Life on Land",
  "SDG 16: Peace, Justice and Strong Institutions",
  "SDG 17: Partnerships for the Goals",
]

const formSchema = z.object({
  focus: z.string({ required_error: "Please select a primary focus." }),
  outcomes: z.array(z.string()).min(1, "Please select at least one outcome.").max(3, "You can select up to three outcomes."),
  scale: z.string({ required_error: "Please select your scale of reach." }),
  sdgs: z.array(z.string()).min(1, "Please select at least one SDG."),
});


export default function StartPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outcomes: [],
      sdgs: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit this form.",
        variant: "destructive",
      });
      return;
    }

    try {
      const surveyRef = ref(db, `users/${user.uid}/survey`);
      await set(surveyRef, data);
      toast({
        title: "Information Saved!",
        description: "Your preferences have been saved successfully.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Firebase Error:", error);
      toast({
        title: "Submission Failed",
        description: "Could not save your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Let's Get Started"
        description="Tell us a bit about your organization and goals to personalize your experience."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-8">
            {/* Question 1: Primary Focus */}
            <div className="space-y-4">
              <CardTitle className="font-headline">1. Your Organization’s Primary Focus</CardTitle>
              <CardDescription>Select the single domain that best describes your core mission.</CardDescription>
              <Controller
                name="focus"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid md:grid-cols-2 gap-4">
                    {focusOptions.map((option) => (
                      <Label key={option} className="flex items-center gap-3 border rounded-md p-3 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                        <RadioGroupItem value={option} />
                        {option}
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.focus && <p className="text-sm font-medium text-destructive">{errors.focus.message}</p>}
            </div>

            <Separator />

            {/* Question 2: Impact Outcomes */}
            <div className="space-y-4">
                <CardTitle className="font-headline">2. Most Important Impact Outcomes</CardTitle>
                <CardDescription>Select up to three outcomes that matter most to you.</CardDescription>
                <Controller
                  name="outcomes"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {outcomeOptions.map((option) => (
                        <Label key={option} className="flex items-center gap-3 border rounded-md p-3 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                           <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), option]
                                : field.value?.filter((value) => value !== option);
                              field.onChange(newValue);
                            }}
                          />
                          {option}
                        </Label>
                      ))}
                    </div>
                  )}
                />
              {errors.outcomes && <p className="text-sm font-medium text-destructive">{errors.outcomes.message}</p>}
            </div>

            <Separator />

            {/* Question 3: Scale of Reach */}
            <div className="space-y-4">
              <CardTitle className="font-headline">3. Your Current Scale of Reach</CardTitle>
              <CardDescription>How many people or households benefit from your work?</CardDescription>
              <Controller
                name="scale"
                control={control}
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid md:grid-cols-2 gap-4">
                    {scaleOptions.map((option) => (
                      <Label key={option} className="flex items-center gap-3 border rounded-md p-3 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                        <RadioGroupItem value={option} />
                        {option}
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.scale && <p className="text-sm font-medium text-destructive">{errors.scale.message}</p>}
            </div>

            <Separator />

            {/* Question 4: SDGs */}
            <div className="space-y-4">
              <CardTitle className="font-headline">4. Aligned United Nations Sustainable Development Goals</CardTitle>
              <CardDescription>Select any number of goals that align with your work.</CardDescription>
              <Controller
                  name="sdgs"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sdgOptions.map((option) => (
                        <Label key={option} className="flex items-center gap-3 border rounded-md p-3 hover:bg-accent has-[[data-state=checked]]:bg-accent">
                           <Checkbox
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...(field.value || []), option]
                                : field.value?.filter((value) => value !== option);
                              field.onChange(newValue);
                            }}
                          />
                          {option}
                        </Label>
                      ))}
                    </div>
                  )}
                />
              {errors.sdgs && <p className="text-sm font-medium text-destructive">{errors.sdgs.message}</p>}
            </div>

          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Save and Continue</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
