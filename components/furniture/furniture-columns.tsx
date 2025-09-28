"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Furniture } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface FurnitureColumnsProps {
  onView?: (furniture: Furniture) => void
  onEdit?: (furniture: Furniture) => void
  onDelete?: (furniture: Furniture) => void
}

export const createFurnitureColumns = ({ onView, onEdit, onDelete }: FurnitureColumnsProps): ColumnDef<Furniture>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const furniture = row.original
      return (
        <div>
          <div className="font-medium">{furniture.name}</div>
          <div className="text-sm text-muted-foreground">{furniture.phone}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return <span className="text-sm">{email}</span>
    },
  },
  {
    accessorKey: "furnitureType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("furnitureType") as string
      return (
        <Badge
          variant="outline"
          className={
            type === "Commercial Furniture"
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
              : "bg-green-500/10 text-green-500 border-green-500/20"
          }
        >
          {type === "Commercial Furniture" ? "Commercial" : "Residential"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "paymentType",
    header: "Payment",
    cell: ({ row }) => {
      const paymentType = row.getValue("paymentType") as string
      if (!paymentType) return <span className="text-muted-foreground">-</span>

      const colors = {
        "EMI Plan": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Lease: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        "Instant Pay": "bg-green-500/10 text-green-500 border-green-500/20",
      }

      return (
        <Badge
          variant="outline"
          className={colors[paymentType as keyof typeof colors] || "bg-muted text-muted-foreground"}
        >
          {paymentType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "furnitureCondition",
    header: "Condition",
    cell: ({ row }) => {
      const condition = row.getValue("furnitureCondition") as string
      if (!condition) return <span className="text-muted-foreground">-</span>

      return (
        <Badge
          variant="outline"
          className={
            condition === "New Furniture"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
          }
        >
          {condition === "New Furniture" ? "New" : "Used"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Requested
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <span className="text-sm text-muted-foreground">{formatDistanceToNow(date, { addSuffix: true })}</span>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const furniture = row.original

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onView?.(furniture)
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onEdit?.(furniture)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onDelete?.(furniture)
              }} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
