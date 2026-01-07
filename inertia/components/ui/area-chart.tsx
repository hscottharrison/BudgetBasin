import React from 'react'
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '~/lib/utils'

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  valueFormatter?: (value: number) => string
  categories?: string[]
}

const ChartTooltip = ({ active, payload, label, valueFormatter = (v) => v.toString() }: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <div className="border-b pb-2 mb-2">
        <p className="font-medium text-sm">{label}</p>
      </div>
      <div className="space-y-1.5">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-medium">{valueFormatter(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AreaChartProps {
  data: Record<string, any>[]
  index: string
  categories: string[]
  valueFormatter?: (value: number) => string
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  showTooltip?: boolean
  height?: number
  className?: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  gradientStops?: Array<{ offset: string; stopColor: string; stopOpacity: number }>
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function AreaChart({
  data = [],
  index,
  categories = [],
  valueFormatter = (value: number) => value.toString(),
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  showTooltip = true,
  height = 240,
  className,
  xAxisLabel,
  yAxisLabel,
  colors = defaultColors,
  gradientStops,
}: AreaChartProps) {
  // Generate gradient definitions
  const getGradientId = (category: string) => `gradient-${category.replace(/\s+/g, '-')}`
  
  const defaultGradientStops = [
    { offset: '0%', stopColor: '', stopOpacity: 0.8 },
    { offset: '95%', stopColor: '', stopOpacity: 0.1 },
  ]

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: xAxisLabel ? 30 : 0 }}
        >
          <defs>
            {categories.map((category, index) => {
              const color = colors[index % colors.length]
              const stops = gradientStops || defaultGradientStops
              
              return (
                <linearGradient
                  key={category}
                  id={getGradientId(category)}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  {stops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={stop.stopColor || color}
                      stopOpacity={stop.stopOpacity}
                    />
                  ))}
                </linearGradient>
              )
            })}
          </defs>
          
          {showGridLines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted"
              vertical={false}
            />
          )}
          
          {showXAxis && (
            <XAxis
              dataKey={index}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
          )}
          
          {showYAxis && (
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
              dx={-10}
            />
          )}
          
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  valueFormatter={valueFormatter}
                />
              )}
              cursor={{
                stroke: 'hsl(var(--muted-foreground))',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
            />
          )}
          
          {categories.map((category, index) => {
            const color = colors[index % colors.length]
            
            return (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${getGradientId(category)})`}
                fillOpacity={1}
                name={category}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
