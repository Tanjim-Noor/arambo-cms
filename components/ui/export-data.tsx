"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface ExportDataProps {
  data: any[]
  filename: string
  module: "properties" | "trips" | "trucks" | "furniture"
}

export function ExportData({ data, filename, module }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      if (!data.length) {
        toast({
          title: "No data to export",
          description: "There are no records to export.",
          variant: "destructive",
        })
        return
      }

      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              // Escape commas and quotes in CSV
              if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            })
            .join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `${data.length} records exported to CSV.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = () => {
    setIsExporting(true)
    try {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `${data.length} records exported to JSON.`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const generateReport = () => {
    setIsExporting(true)
    try {
      // Generate a simple text report
      const reportContent = [
        `${module.toUpperCase()} REPORT`,
        `Generated: ${new Date().toLocaleString()}`,
        `Total Records: ${data.length}`,
        "",
        "=".repeat(50),
        "",
        ...data.map((item, index) => {
          const lines = [`Record ${index + 1}:`]
          Object.entries(item).forEach(([key, value]) => {
            lines.push(`  ${key}: ${value}`)
          })
          lines.push("")
          return lines.join("\n")
        }),
      ].join("\n")

      const blob = new Blob([reportContent], { type: "text/plain" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}-report.txt`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report generated",
        description: `${module} report generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Report generation failed",
        description: "There was an error generating the report.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <Database className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
