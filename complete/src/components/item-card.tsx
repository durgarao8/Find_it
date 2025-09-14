
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/data";
import { MapPin, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export function ItemCard({ item }: { item: Item }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(format(new Date(item.dateLost), 'PP'));
  }, [item.dateLost]);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full bg-background/70">
      <CardHeader className="p-0">
        <Link href={`/item/${item.id}`} className="block">
          <div className="aspect-[3/2] relative">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint="item image"
            />
             <Badge variant={item.status === 'Lost' ? 'destructive' : item.status === 'Found' ? 'default' : 'secondary'} className="absolute top-2 right-2">{item.status}</Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2">
          <Link href={`/item/${item.id}`} className="hover:text-primary transition-colors">
            {item.name}
          </Link>
        </CardTitle>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{item.status === 'Lost' ? 'Lost on' : 'Found on'} {formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 shrink-0" />
            <span>{item.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/item/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
