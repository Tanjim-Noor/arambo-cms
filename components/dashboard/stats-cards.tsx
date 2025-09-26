"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Route, Truck, Sofa, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalProperties: number
    confirmedProperties: number
    unconfirmedProperties: number
    totalTrips: number
    totalTrucks: number
    totalFurniture: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      description: `${stats.confirmedProperties} confirmed, ${stats.unconfirmedProperties} pending`,
      trend: "+12% from last month",
    },
    {
      title: "Active Trips",
      value: stats.totalTrips,
      icon: Route,
      description: "Scheduled and in progress",
      trend: "+8% from last month",
    },
    {
      title: "Available Trucks",
      value: stats.totalTrucks,
      icon: Truck,
      description: "Ready for deployment",
      trend: "+2 new trucks",
    },
    {
      title: "Furniture Requests",
      value: stats.totalFurniture,
      icon: Sofa,
      description: "Pending and completed",
      trend: "+15% from last month",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {card.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
