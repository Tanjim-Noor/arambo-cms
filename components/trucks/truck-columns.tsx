"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Truck } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, TruckIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TruckColumnsProps {
  onView?: (truck: Truck) => void
  onEdit?: (truck: Truck) => void
  onDelete?: (truck: Truck) => void
}

export const createTruckColumns = ({ onView, onEdit, onDelete }: TruckColumnsProps): ColumnDef<Truck>[] => [
  {
    accessorKey: "modelNumber",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Model Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const truck = row.original
      return (
        <div className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono font-medium">{truck.modelNumber}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "height",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Height
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const height = row.getValue("height") as number
      return <span className="text-sm font-medium">{height} ft</span>
    },
  },
  {
    accessorKey: "isOpen",
    header: "Status",
    cell: ({ row }) => {
      const isOpen = row.getValue("isOpen") as boolean
      return (
        <Badge
          variant="outline"
          className={
            isOpen
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }
        >
          {isOpen ? "Available" : "In Use"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="max-w-[200px]">
          <span className="text-sm text-muted-foreground truncate">{description || "No description"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Added
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
      const truck = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(truck)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(truck)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(truck)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
