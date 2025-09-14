"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, Upload, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectItemLocation } from "@/ai/flows/detect-item-location";
import { generateItemDescription } from "@/ai/flows/generate-item-description";
import { Item } from "@/lib/data";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().min(3, "Please provide a location."),
  category: z.enum(["Electronics", "Laptops & Chargers", "Keys", "Wallets", "Student IDs", "Clothing", "Bags", "Water Bottles", "Books", "Personal Items", "Other"]),
  image: z.any().refine((files) => files?.length === 1, "Image is required."),
});

type AiResult = {
  locationTags: string[];
  suggestedOptions: string[];
};

export default function SubmitItemPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", e.target.files);
    }
  };
  
  const handleGenerateDescription = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Missing Image",
        description: "Please upload an image before generating a description.",
      });
      return;
    }
    
    setIsGenerating(true);

    try {
      const result = await generateItemDescription({ photoDataUri: imagePreview });
      form.setValue("name", result.name);
      form.setValue("description", result.description);
      toast({
        title: "AI Description Generated",
        description: "The name and description have been filled in for you.",
      });
    } catch (error) {
      console.error("AI description generation failed", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate a description. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDetectLocation = async () => {
    const description = form.getValues("description");
    if (!imagePreview || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both an image and a description before using the AI detection.",
      });
      return;
    }
    
    setIsDetecting(true);
    setAiResult(null);

    try {
      const result = await detectItemLocation({ description, photoDataUri: imagePreview });
      setAiResult(result);
      toast({
        title: "AI Analysis Complete",
        description: "We've suggested some tags based on your submission.",
      });
    } catch (error) {
      console.error("AI detection failed", error);
      toast({
        variant: "destructive",
        title: "AI Detection Failed",
        description: "Could not analyze the item. Please try again.",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Instead of a toast, we now show the success screen
    setIsSubmitted(true);
  }

  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    setAiResult(null);
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg text-center p-8">
            <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-4" />
            <h1 className="text-3xl font-headline font-bold">Submission Successful!</h1>
            <p className="text-muted-foreground mt-2 mb-6">Your item has been listed. Thank you for helping our community.</p>
            <div className="flex justify-center gap-4">
                <Button onClick={resetForm}>Submit Another Item</Button>
                <Button variant="outline" asChild>
                    <Link href="/">Back to Homepage</Link>
                </Button>
            </div>
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Report a Lost or Found Item</CardTitle>
          <CardDescription>
            Fill out the details below to list an item. The more details you provide, the higher the chance of a successful reunion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Black Ray-Ban Sunglasses" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Provide as much detail as possible, including any unique marks, scratches, or contents." {...field} rows={6}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Known Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Central Park, by the fountain" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Laptops & Chargers">Laptops & Chargers</SelectItem>
                          <SelectItem value="Keys">Keys</SelectItem>
                          <SelectItem value="Wallets">Wallets</SelectItem>
                          <SelectItem value="Student IDs">Student IDs</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Bags">Bags</SelectItem>
                          <SelectItem value="Water Bottles">Water Bottles</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Personal Items">Personal Items</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Image</FormLabel>
                      <FormControl>
                        <div className="w-full">
                          <label htmlFor="file-upload" className="w-full cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors">
                            {imagePreview ? (
                              <Image src={imagePreview} alt="Preview" width={200} height={200} className="rounded-md object-contain max-h-[200px]" data-ai-hint="item preview" />
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <Upload className="mx-auto h-12 w-12" />
                                <p className="mt-2">Click to upload or drag and drop</p>
                                <p className="text-xs">PNG, JPG, or GIF (max 5MB)</p>
                              </div>
                            )}
                          </label>
                          <Input id="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary"/> AI Assistant</h3>
                  <div className="flex flex-col gap-2">
                     <Button type="button" variant="outline" className="w-full" onClick={handleGenerateDescription} disabled={isGenerating || !imagePreview}>
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      Generate Description from Image
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={handleDetectLocation} disabled={isDetecting}>
                      {isDetecting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Detect Location & Tags
                    </Button>
                  </div>
                  
                  {aiResult && (
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-2 mt-2">
                       <h4 className="font-semibold text-sm">Suggested Tags:</h4>
                       <div className="flex flex-wrap gap-2">
                         {aiResult.locationTags.map((tag, i) => <Badge key={`loc-${i}`} variant="secondary">{tag}</Badge>)}
                         {aiResult.suggestedOptions.map((tag, i) => <Badge key={`opt-${i}`} variant="outline">{tag}</Badge>)}
                       </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full !mt-8">Submit Item</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
