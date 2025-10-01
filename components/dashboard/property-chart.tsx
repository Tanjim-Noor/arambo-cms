"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PropertyChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

// Define distinct colors for different pie slices
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green  
  "#ffc658", // Orange
  "#ff7c7c", // Red
  "#8dd1e1", // Light Blue
  "#d084d0", // Pink
]

export function PropertyChart({ data }: PropertyChartProps) {
  // Calculate total for percentage calculation
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  
  // Custom tooltip formatter to show percentages
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            {percentage}% of total properties
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Properties by Furnishing Status</CardTitle>
        <CardDescription className="text-muted-foreground">Distribution of property furnishing types</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend
              wrapperStyle={{
                color: "hsl(var(--foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
