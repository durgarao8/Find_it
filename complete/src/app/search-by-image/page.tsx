"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemCard } from "@/components/item-card";
import Image from "next/image";
import { items as allItems } from "@/lib/data";
import type { Item } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, Loader2, Search, Upload } from "lucide-react";
import { imageMatchingForLostItems } from "@/ai/flows/image-matching-lost-items";

export default function SearchByImagePage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedItem, setMatchedItem] = useState<Item | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMatchedItem(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image of the found item to search.",
      });
      return;
    }
    
    setIsSearching(true);
    setMatchedItem(null);
    
    try {
      const lostItemDescriptions = allItems.map(item => `${item.name}: ${item.description}`);
      
      const result = await imageMatchingForLostItems({
        photoDataUri: imagePreview,
        lostItemDescriptions,
      });

      if (result.matchingItemDescription) {
        const matched = allItems.find(item => `${item.name}: ${item.description}` === result.matchingItemDescription);
        if (matched) {
          setMatchedItem(matched);
          toast({
            title: "Potential Match Found!",
            description: "We found an item that looks similar to your upload.",
          });
        } else {
           toast({
            title: "No Match Found",
            description: "We couldn't find a close match in our database.",
          });
        }
      } else {
        toast({
          title: "No Match Found",
          description: "We couldn't find a close match in our database.",
        });
      }

    } catch (error) {
      console.error("Image matching failed", error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "The image search could not be completed. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            Search by Image
          </CardTitle>
          <CardDescription>
            Found an item? Upload a picture of it, and our AI will try to find a matching lost item report.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <label htmlFor="image-upload" className="w-full max-w-md cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors">
            {imagePreview ? (
              <Image src={imagePreview} alt="Uploaded item preview" width={300} height={300} className="rounded-md object-contain max-h-[300px]" data-ai-hint="item upload preview" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-12 w-12" />
                <p className="mt-2">Click to upload or drag and drop an image</p>
                <p className="text-xs">PNG, JPG, or GIF</p>
              </div>
            )}
          </label>
          <Input id="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />

          <Button onClick={handleSearch} disabled={isSearching || !imagePreview} size="lg">
            {isSearching ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Search for Matches
          </Button>
        </CardContent>
      </Card>
      
      {isSearching && (
         <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Searching for matches...</p>
         </div>
      )}

      {matchedItem && (
        <div className="space-y-4">
          <h2 className="text-2xl font-headline text-center">We found a potential match!</h2>
          <div className="max-w-sm mx-auto">
            <ItemCard item={matchedItem} />
          </div>
        </div>
      )}
    </div>
  );
}
