"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Trip } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, MapPin, Mail } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface TripColumnsProps {
  onView?: (trip: Trip) => void
  onEdit?: (trip: Trip) => void
  onDelete?: (trip: Trip) => void
}

export const createTripColumns = ({ onView, onEdit, onDelete }: TripColumnsProps): ColumnDef<Trip>[] => [
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
      const trip = row.original
      return (
        <div>
          <div className="font-medium">{trip.name}</div>
          <div className="text-sm text-muted-foreground">{trip.phone}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {trip.email}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "productType",
    header: "Product Type",
    cell: ({ row }) => {
      const productType = row.getValue("productType") as string
      const colors = {
        "Perishable Goods": "bg-red-500/10 text-red-500 border-red-500/20",
        "Non-Perishable Goods": "bg-green-500/10 text-green-500 border-green-500/20",
        Fragile: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      }
      return (
        <Badge
          variant="outline"
          className={colors[productType as keyof typeof colors] || "bg-muted text-muted-foreground"}
        >
          {productType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }) => {
      const trip = row.original
      return (
        <div className="max-w-[200px]">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{trip.pickupLocation}</span>
          </div>
          <div className="text-xs text-muted-foreground">↓</div>
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{trip.dropOffLocation}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "preferredDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("preferredDate"))
      return (
        <div>
          <div className="font-medium">{format(date, "MMM dd, yyyy")}</div>
          <div className="text-sm text-muted-foreground">{row.original.preferredTimeSlot}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "truckId",
    header: "Truck",
    cell: ({ row }) => {
      const truckId = row.getValue("truckId") as string
      return <span className="text-sm font-mono">{truckId.slice(-8)}</span>
    },
  },
  {
    accessorKey: "additionalNotes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("additionalNotes") as string
      return notes ? (
        <div className="max-w-[150px]">
          <span className="text-sm text-muted-foreground truncate">{notes}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created
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
      const trip = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(trip)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(trip)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(trip)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
