
"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { items, users } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Tag, MessageSquare, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const [formattedDate, setFormattedDate] = useState("");
  
  // Find the item using the id from params
  const item = items.find((i) => i.id === params.id);

  useEffect(() => {
    if (item) {
      // Format the date only on the client-side to prevent hydration errors
      setFormattedDate(format(new Date(item.dateLost), 'PP'));
    }
  }, [item]);

  if (!item) {
    notFound();
  }

  const owner = users.find((u) => u.id === item.userId);

  return (
    <div className="space-y-8">
       <div>
         <Button variant="ghost" asChild>
           <Link href="/">
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to listings
           </Link>
         </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-square">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint="item image"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <CardHeader className="p-0 mb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl font-headline">
                  {item.name}
                </CardTitle>
                <Badge variant={item.status === 'Lost' ? 'destructive' : item.status === 'Found' ? 'default' : 'secondary'} className="text-sm">
                  {item.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-4 flex-grow">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-semibold">{item.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 shrink-0 text-primary" />
                <span>{item.status === 'Lost' ? 'Lost on' : 'Found on'} {formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Tag className="h-5 w-5 shrink-0 text-primary" />
                <span>{item.category}</span>
              </div>
              <CardDescription className="text-base !mt-6 leading-relaxed">
                {item.description}
              </CardDescription>
            </CardContent>

            <div className="mt-8 space-y-4">
              
              {owner && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={owner.avatarUrl} alt={owner.name} />
                      <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{item.status === 'Lost' ? 'Owner' : 'Finder'}</p>
                      <p className="text-sm text-muted-foreground">{owner.name}</p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/messages?itemId=${item.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {item.status === 'Claimed' ? 'Chat with Owner' : 'Claim Item & Chat'}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
