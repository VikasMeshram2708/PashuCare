"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";

const chartConfig = {
  userMessages: {
    label: "Your Messages",
    color: "hsl(199, 89%, 60%)", // Sky blue
  },
  assistantMessages: {
    label: "AI Responses",
    color: "hsl(271, 91%, 65%)", // Purple
  },
} satisfies ChartConfig;

export function DashAnalytics() {
  const { user } = useUser();
  const analyticsData = useQuery(
    api.analytics.getMessageActivityByDay,
    user?.id ? { userId: user.id } : "skip",
  );

  const isLoading = analyticsData === undefined;
  const hasData =
    analyticsData &&
    analyticsData.some((d) => d.userMessages > 0 || d.assistantMessages > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Message Activity
        </CardTitle>
        <CardDescription>
          Your conversation activity over the last 7 days
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-[340px] flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : !hasData ? (
          <div className="h-[340px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No message activity yet.
              <br />
              Start a conversation to see your analytics!
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[340px] w-full">
            <AreaChart
              accessibilityLayer
              data={analyticsData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="fillUser" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-userMessages)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-userMessages)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillAssistant" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-assistantMessages)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-assistantMessages)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Area
                dataKey="userMessages"
                type="monotone"
                fill="url(#fillUser)"
                fillOpacity={0.4}
                stroke="var(--color-userMessages)"
                strokeWidth={2}
                stackId="a"
              />

              <Area
                dataKey="assistantMessages"
                type="monotone"
                fill="url(#fillAssistant)"
                fillOpacity={0.4}
                stroke="var(--color-assistantMessages)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
