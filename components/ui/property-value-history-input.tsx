"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, TrendingUp } from "lucide-react"
import { PropertyValueHistory } from "@/types"

interface PropertyValueHistoryInputProps {
  value: PropertyValueHistory[]
  onChange: (value: PropertyValueHistory[]) => void
}

export function PropertyValueHistoryInput({ value, onChange }: PropertyValueHistoryInputProps) {
  const [newEntry, setNewEntry] = useState({ year: new Date().getFullYear(), value: 0 })

  // Debug logging for prop changes
  console.log("📊 PropertyValueHistoryInput - Current Value:", {
    count: value.length,
    data: value,
    isEmpty: value.length === 0
  });

  const addEntry = () => {
    console.log("➕ Adding Property Value History Entry:", newEntry);
    
    if (newEntry.year && newEntry.value !== undefined && newEntry.value !== null) {
      // Check if year already exists
      const existingIndex = value.findIndex(item => item.year === newEntry.year)
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedValue = [...value]
        updatedValue[existingIndex] = newEntry
        console.log("🔄 Updated existing entry:", updatedValue);
        onChange(updatedValue)
      } else {
        // Add new entry and sort by year
        const updatedValue = [...value, newEntry].sort((a, b) => a.year - b.year)
        console.log("🆕 Added new entry:", updatedValue);
        onChange(updatedValue)
      }
      
      // Reset form
      setNewEntry({ year: new Date().getFullYear(), value: 0 })
    } else {
      console.warn("⚠️ Invalid entry data:", newEntry);
    }
  }

  const removeEntry = (index: number) => {
    console.log("🗑️ Removing Property Value History Entry at index:", index);
    const updatedValue = value.filter((_, i) => i !== index)
    console.log("🔄 Updated value after removal:", updatedValue);
    onChange(updatedValue)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatShortCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    const sign = amount < 0 ? '-' : ''
    
    if (absAmount >= 10000000) { // 1 crore
      return `${sign}৳${(absAmount / 10000000).toFixed(1)}Cr`
    } else if (absAmount >= 100000) { // 1 lakh
      return `${sign}৳${(absAmount / 100000).toFixed(1)}L`
    } else if (absAmount >= 1000) { // 1 thousand
      return `${sign}৳${(absAmount / 1000).toFixed(1)}K`
    } else {
      return `${sign}৳${absAmount}`
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Track property value estimates by year. This helps in understanding property appreciation trends.
      </div>

      {/* Add new entry */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Year</label>
              <Input
                type="number"
                placeholder="2025"
                min="1900"
                max={new Date().getFullYear() + 20}
                value={newEntry.year || ''}
                onChange={(e) => setNewEntry({ ...newEntry, year: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex-2">
              <label className="text-sm font-medium">Property Value (BDT)</label>
              <Input
                type="number"
                placeholder="3500000"
                step="100000"
                value={newEntry.value || ''}
                onChange={(e) => setNewEntry({ ...newEntry, value: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Button 
              type="button" 
              onClick={addEntry}
              disabled={!newEntry.year || newEntry.value === undefined || newEntry.value === null}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display existing entries */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Value History ({value.length} entries)
          </div>
          <div className="grid gap-2">
            {value
              .sort((a, b) => b.year - a.year) // Show most recent first
              .map((entry) => {
                const originalIndex = value.findIndex(item => item.year === entry.year)
                return (
                  <Card key={entry.year} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{entry.year}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatShortCurrency(entry.value)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono">
                            {formatCurrency(entry.value)}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry(originalIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
          </div>
        </div>
      )}

      {value.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No property value history added yet</p>
          <p className="text-sm">Add historical property values to track appreciation trends</p>
        </div>
      )}
    </div>
  )
}