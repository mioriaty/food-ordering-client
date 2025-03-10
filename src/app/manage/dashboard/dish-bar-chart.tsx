'use client';

import { DashboardIndicatorResType } from '@/domain/schemas/indicator.schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/libs/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig; // "satisfies" là một toán tử TypeScript kiểm tra xem một đối tượng có tuân thủ một kiểu dữ liệu mà không làm thay đổi kiểu được suy luận của nó

const colors = [
  'var(--color-chrome)',
  'var(--color-safari)',
  'var(--color-firefox)',
  'var(--color-edge)',
  'var(--color-other)'
];

interface DishBarChartProps {
  data: DashboardIndicatorResType['data']['dishIndicator'];
}

export function DishBarChart({ data }: DishBarChartProps) {
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        name: item.name,
        successOrders: item.successOrders,
        fill: colors[index] ?? colors[colors.length - 1]
      })),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 5
              }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <XAxis dataKey="successOrders" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="successOrders" name={'Đơn thanh toán: '} layout="vertical" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
}
