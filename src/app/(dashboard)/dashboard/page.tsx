"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PropertyChart } from "@/components/dashboard/property-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    confirmedProperties: 0,
    unconfirmedProperties: 0,
    totalTrips: 0,
    totalTrucks: 0,
    totalFurniture: 0,
  })
  const [chartData, setChartData] = useState([
    { name: "Furnished", value: 0, color: "#8884d8" },
    { name: "Semi-Furnished", value: 0, color: "#82ca9d" },
    { name: "Non-Furnished", value: 0, color: "#ffc658" },
  ])
  const [activities] = useState([
    {
      id: "1",
      type: "property" as const,
      action: "New property listing created",
      title: "Luxury Apartment in Gulshan 2",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: "pending",
    },
    {
      id: "2",
      type: "trip" as const,
      action: "Trip scheduled",
      title: "Dhaka to Chittagong delivery",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "active",
    },
    {
      id: "3",
      type: "property" as const,
      action: "Property confirmed",
      title: "Modern House in Banani",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: "confirmed",
    },
    {
      id: "4",
      type: "furniture" as const,
      action: "Furniture request received",
      title: "Commercial office setup",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: "pending",
    },
    {
      id: "5",
      type: "truck" as const,
      action: "New truck added",
      title: "Heavy Duty Truck TR-105",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      status: "active",
    },
  ])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [propertiesResponse, tripsResponse, trucksResponse, furnitureResponse] = await Promise.allSettled([
          api.properties.getAll({ limit: 1000 }),
          api.trips.getAll(),
          api.trucks.getAll(),
          api.furniture.getAll({ limit: 1000 }),
        ])

        // Process properties data
        if (propertiesResponse.status === "fulfilled") {
          const properties = propertiesResponse.value.properties || []
          const confirmed = properties.filter((p: any) => p.isConfirmed).length
          const unconfirmed = properties.length - confirmed

          setStats((prev) => ({
            ...prev,
            totalProperties: properties.length,
            confirmedProperties: confirmed,
            unconfirmedProperties: unconfirmed,
          }))

          // Update chart data based on actual property furnishing status
          const furnishingCount = properties.reduce((acc: any, property: any) => {
            const furnishing = property.furnishingStatus || property.category || "Unknown"
            acc[furnishing] = (acc[furnishing] || 0) + 1
            return acc
          }, {})

          // Define colors for different furnishing statuses
          const furnishingColors: { [key: string]: string } = {
            "Furnished": "#8884d8",
            "Semi-Furnished": "#82ca9d", 
            "Non-Furnished": "#ffc658",
            "Unknown": "#ff7c7c"
          }

          // Create chart data dynamically from database results
          const newChartData = Object.entries(furnishingCount)
            .filter(([_, count]) => (count as number) > 0) // Only include categories with data
            .map(([status, count], index) => ({
              name: status,
              value: count as number,
              color: furnishingColors[status] || `hsl(${index * 60}, 70%, 60%)`
            }))

          setChartData(newChartData)
        }

        // Process trips data
        if (tripsResponse.status === "fulfilled") {
          const trips = tripsResponse.value || []
          setStats((prev) => ({ ...prev, totalTrips: trips.length }))
        }

        // Process trucks data
        if (trucksResponse.status === "fulfilled") {
          const trucks = trucksResponse.value || []
          setStats((prev) => ({ ...prev, totalTrucks: trucks.length }))
        }

        // Process furniture data
        if (furnitureResponse.status === "fulfilled") {
          const furniture = furnitureResponse.value || []
          setStats((prev) => ({ ...prev, totalFurniture: furniture.length }))
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Use mock data if API fails
        setStats({
          totalProperties: 156,
          confirmedProperties: 98,
          unconfirmedProperties: 58,
          totalTrips: 23,
          totalTrucks: 12,
          totalFurniture: 45,
        })
        
        // Set fallback chart data
        setChartData([
          { name: "Furnished", value: 45, color: "#8884d8" },
          { name: "Semi-Furnished", value: 35, color: "#82ca9d" },
          { name: "Non-Furnished", value: 20, color: "#ffc658" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your property management system</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <PropertyChart data={chartData} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
