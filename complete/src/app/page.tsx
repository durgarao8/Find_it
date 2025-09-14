"use client";

import { items } from "@/lib/data";
import { ItemCard } from "@/components/item-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import placeholderImages from "@/lib/placeholder-images.json";
import Autoplay from "embla-carousel-autoplay";
import AppTour from "@/components/app-tour";

export default function Home() {
  const heroImages = placeholderImages.filter(p => p.type === 'college-hero');

  return (
    <div className="space-y-8">
      <AppTour />
      <Card id="hero-carousel" className="overflow-hidden rounded-xl shadow-lg">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
        >
          <CarouselContent>
            {heroImages.map((img, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[16/6] relative">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    unoptimized={img.url.startsWith('/')}
                    data-ai-hint={img.hint}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary drop-shadow-lg">
                      Lost Something?
                    </h1>
                    <p className="mt-2 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
                      Browse items or report your own. Let's help each other out.
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-white/50" />
        </Carousel>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <div id="search-bar" className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            className="pl-10"
          />
        </div>
        <div id="filters" className="flex gap-4">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div id="item-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
