"use client";

import { items } from "@/lib/data";
import type { Item } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo } from "react";

const COLORS = {
  Electronics: "hsl(var(--chart-1))",
  "Laptops & Chargers": "hsl(var(--chart-2))",
  Keys: "hsl(var(--chart-3))",
  Wallets: "hsl(var(--chart-4))",
  "Student IDs": "hsl(var(--chart-5))",
  Clothing: "hsl(var(--primary))",
  Bags: "hsl(var(--accent))",
  "Water Bottles": "hsl(var(--secondary))",
  Books: "hsl(var(--muted-foreground))",
  "Personal Items": "hsl(var(--ring))",
  Other: "hsl(var(--border))",
};

const STATUS_COLORS = {
  Lost: "hsl(var(--destructive))",
  Found: "hsl(var(--primary))",
  Claimed: "hsl(var(--accent))",
};

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalItems = items.length;
    const claimedItems = items.filter((item) => item.status === "Claimed").length;
    const lostItems = items.filter((item) => item.status === "Lost").length;
    const foundItems = items.filter((item) => item.status === "Found").length;
    const claimRate = totalItems > 0 ? (claimedItems / totalItems) * 100 : 0;
    
    return { totalItems, claimedItems, lostItems, foundItems, claimRate: claimRate.toFixed(1) };
  }, []);

  const itemsByCategory = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    for (const item of items) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
    return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
  }, []);

  const itemsByStatus = useMemo(() => {
    const statusCounts: { [key: string]: number } = { Lost: 0, Found: 0, Claimed: 0 };
    for (const item of items) {
      statusCounts[item.status]++;
    }
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Analytics and insights into lost and found items.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Total items reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.claimedItems}</div>
            <p className="text-xs text-muted-foreground">{stats.lostItems} Lost, {stats.foundItems} Found</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.claimRate}%</div>
            <p className="text-xs text-muted-foreground">of items have been returned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
            <CardDescription>
              Distribution of reported items across different categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[300px] w-full">
              <BarChart data={itemsByCategory} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" name="Items" radius={4}>
                  {itemsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || 'hsl(var(--muted-foreground))'} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Item Status Overview</CardTitle>
            <CardDescription>
              Current status of all reported items.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={{}} className="min-h-[300px] w-full aspect-square">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={itemsByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-xs font-bold fill-primary-foreground"
                      >
                        {itemsByStatus[index].name} ({value})
                      </text>
                    );
                  }}
                >
                  {itemsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                  ))}
                </Pie>
                 <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
