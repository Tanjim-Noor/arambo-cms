"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface FilterOption {
  key: string
  label: string
  value: string
  type: "select" | "date" | "number" | "text"
}

interface AdvancedFiltersProps {
  module: "properties" | "trips" | "trucks" | "furniture"
  onFiltersChange: (filters: Record<string, any>) => void
  activeFilters: Record<string, any>
}

export function AdvancedFilters({ module, onFiltersChange, activeFilters }: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(activeFilters)

  const getFilterOptions = (): FilterOption[] => {
    switch (module) {
      case "properties":
        return [
          { key: "status", label: "Status", value: "", type: "select" },
          { key: "category", label: "Category", value: "", type: "select" },
          { key: "minPrice", label: "Min Price", value: "", type: "number" },
          { key: "maxPrice", label: "Max Price", value: "", type: "number" },
          { key: "location", label: "Location", value: "", type: "text" },
          { key: "dateFrom", label: "Date From", value: "", type: "date" },
          { key: "dateTo", label: "Date To", value: "", type: "date" },
        ]
      case "trips":
        return [
          { key: "status", label: "Status", value: "", type: "select" },
          { key: "origin", label: "Origin", value: "", type: "text" },
          { key: "destination", label: "Destination", value: "", type: "text" },
          { key: "truckId", label: "Truck", value: "", type: "select" },
          { key: "dateFrom", label: "Date From", value: "", type: "date" },
          { key: "dateTo", label: "Date To", value: "", type: "date" },
        ]
      case "trucks":
        return [
          { key: "status", label: "Status", value: "", type: "select" },
          { key: "type", label: "Type", value: "", type: "select" },
          { key: "minCapacity", label: "Min Capacity", value: "", type: "number" },
          { key: "maxCapacity", label: "Max Capacity", value: "", type: "number" },
          { key: "location", label: "Current Location", value: "", type: "text" },
        ]
      case "furniture":
        return [
          { key: "status", label: "Status", value: "", type: "select" },
          { key: "type", label: "Type", value: "", type: "select" },
          { key: "customerName", label: "Customer", value: "", type: "text" },
          { key: "paymentMethod", label: "Payment Method", value: "", type: "select" },
          { key: "dateFrom", label: "Date From", value: "", type: "date" },
          { key: "dateTo", label: "Date To", value: "", type: "date" },
        ]
      default:
        return []
    }
  }

  const getSelectOptions = (key: string): string[] => {
    switch (key) {
      case "status":
        if (module === "properties") return ["confirmed", "unconfirmed"]
        if (module === "trips") return ["scheduled", "in-progress", "completed", "cancelled"]
        if (module === "trucks") return ["available", "in-use", "maintenance"]
        if (module === "furniture") return ["pending", "confirmed", "in-progress", "completed"]
        return []
      case "category":
        return ["residential", "commercial", "industrial", "land"]
      case "type":
        if (module === "trucks") return ["flatbed", "box-truck", "semi-trailer", "pickup"]
        if (module === "furniture") return ["residential", "commercial"]
        return []
      case "paymentMethod":
        return ["cash", "card", "bank-transfer", "check"]
      default:
        return []
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    if (!value) {
      delete newFilters[key]
    }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    onFiltersChange(filters)
    setOpen(false)
  }

  const clearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>Apply advanced filters to refine your search results.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {getFilterOptions().map((option) => (
            <div key={option.key} className="space-y-2">
              <Label htmlFor={option.key}>{option.label}</Label>
              {option.type === "select" ? (
                <Select
                  value={filters[option.key] || ""}
                  onValueChange={(value) => handleFilterChange(option.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${option.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getSelectOptions(option.key).map((optionValue) => (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionValue.charAt(0).toUpperCase() + optionValue.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={option.key}
                  type={option.type}
                  value={filters[option.key] || ""}
                  onChange={(e) => handleFilterChange(option.key, e.target.value)}
                  placeholder={`Enter ${option.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <>
            <Separator className="my-6" />
            <div className="space-y-3">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {getFilterOptions().find((f) => f.key === key)?.label}: {value}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      onClick={() => handleFilterChange(key, "")}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-8 flex gap-3">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
