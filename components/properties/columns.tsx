"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Property } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ColumnsProps {
  onView?: (property: Property) => void
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
  onConfirm?: (property: Property) => void
  showConfirmAction?: boolean
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
  onConfirm,
  showConfirmAction = false,
}: ColumnsProps): ColumnDef<Property>[] => [
  {
    accessorKey: "propertyName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Property Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const property = row.original
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{property.propertyName}</div>
          <div className="text-sm text-muted-foreground truncate">{property.location}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const property = row.original
      return (
        <div>
          <div className="font-medium">{property.name}</div>
          <div className="text-sm text-muted-foreground">{property.phone}</div>
          <div className="text-xs text-muted-foreground">{property.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "furnishingStatus",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Furnishing
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("furnishingStatus") as string
      const colors = {
        "Furnished": "bg-green-500/10 text-green-500 border-green-500/20",
        "Semi-Furnished": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        "Non-Furnished": "bg-gray-500/10 text-gray-500 border-gray-500/20",
      }
      return status ? (
        <Badge variant="outline" className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>
          {status}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("propertyType") || "-"}</span>
    },
  },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      return <span className="text-sm">{row.getValue("area") || "-"}</span>
    },
  },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
    cell: ({ row }) => {
      const property = row.original
      const hasCoordinates = property.longitude !== undefined && property.latitude !== undefined
      return (
        <div className="text-sm">
          {hasCoordinates ? (
            <div>
              <div className="font-mono text-xs">{property.latitude?.toFixed(4)}</div>
              <div className="font-mono text-xs text-muted-foreground">{property.longitude?.toFixed(4)}</div>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "bedrooms",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Bed/Bath
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const property = row.original
      return (
        <div className="text-sm">
          <div>{property.bedrooms} bed</div>
          <div className="text-muted-foreground">{property.bathroom} bath</div>
        </div>
      )
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const size = row.getValue("size") as number
      return <span className="text-sm">{size} sq ft</span>
    },
  },
  {
    accessorKey: "floor",
    header: "Floor",
    cell: ({ row }) => {
      const property = row.original
      const floor = property.floor
      const totalFloor = property.totalFloor
      return (
        <span className="text-sm">
          {floor !== undefined && totalFloor !== undefined
            ? `${floor}/${totalFloor}`
            : floor !== undefined
              ? floor
              : "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "rent",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rent = row.getValue("rent") as number
      return rent ? (
        <span className="text-sm font-medium">৳{rent.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "propertyValueHistory",
    header: "Value History",
    cell: ({ row }) => {
      const property = row.original
      const history = property.propertyValueHistory
      
      return (
        <div className="min-w-[100px]">
          {history && history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">৳{item.value}</span>
                <span className="text-muted-foreground ml-1">({item.year})</span>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "inventoryStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("inventoryStatus") as string
      const colors = {
        "Looking for Rent": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "Found Tenant": "bg-green-500/10 text-green-500 border-green-500/20",
        "Owner Unreachable": "bg-red-500/10 text-red-500 border-red-500/20",
      }
      return status ? (
        <Badge variant="outline" className={colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"}>
          {status}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "tenantType",
    header: "Tenant Type",
    cell: ({ row }) => {
      const tenantType = row.getValue("tenantType") as string
      return tenantType ? (
        <Badge variant="secondary" className="text-xs">
          {tenantType}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "propertyCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("propertyCategory") as string
      return category ? (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "yearOfConstruction",
    header: "Built",
    cell: ({ row }) => {
      const year = row.getValue("yearOfConstruction") as number
      return year ? <span className="text-sm">{year}</span> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    accessorKey: "serviceCharge",
    header: "Service Charge",
    cell: ({ row }) => {
      const charge = row.getValue("serviceCharge") as number
      return charge ? (
        <span className="text-sm">৳{charge.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "advanceMonths",
    header: "Advance",
    cell: ({ row }) => {
      const months = row.getValue("advanceMonths") as number
      return months ? (
        <span className="text-sm">{months} months</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "facilities",
    header: "Facilities",
    cell: ({ row }) => {
      const property = row.original
      const facilities = []
      if (property.cctv) facilities.push("CCTV")
      if (property.communityHall) facilities.push("Community Hall")
      if (property.gym) facilities.push("Gym")
      if (property.masjid) facilities.push("Masjid")
      if (property.parking) facilities.push("Parking")
      if (property.petsAllowed) facilities.push("Pets Allowed")
      if (property.swimmingPool) facilities.push("Pool")
      if (property.trainedGuard) facilities.push("Security")
      if (property.lift) facilities.push("Lift")

      return facilities.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {facilities.slice(0, 2).map((facility) => (
            <Badge key={facility} variant="secondary" className="text-xs">
              {facility}
            </Badge>
          ))}
          {facilities.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{facilities.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "scores",
    header: "Quality",
    cell: ({ row }) => {
      const property = row.original
      const scores = [property.cleanHygieneScore, property.sunlightScore, property.bathroomConditionsScore].filter(
        (score) => score !== undefined,
      )

      if (scores.length === 0) return <span className="text-muted-foreground">-</span>

      const avgScore = scores.reduce((sum, score) => sum + score!, 0) / scores.length
      const color = avgScore >= 8 ? "text-green-500" : avgScore >= 6 ? "text-yellow-500" : "text-red-500"

      return <span className={`text-sm font-medium ${color}`}>{avgScore.toFixed(1)}/10</span>
    },
  },
  {
    accessorKey: "statusFlags",
    header: "Flags",
    cell: ({ row }) => {
      const property = row.original
      const flags = []
      if (property.firstOwner) flags.push("1st Owner")
      if (property.isVerified) flags.push("Verified")
      if (property.onLoan) flags.push("On Loan")
      if (property.paperworkUpdated) flags.push("Paperwork OK")

      return flags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {flags.slice(0, 2).map((flag) => (
            <Badge key={flag} variant="outline" className="text-xs">
              {flag}
            </Badge>
          ))}
          {flags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{flags.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "listingId",
    header: "Listing ID",
    cell: ({ row }) => {
      const listingId = row.getValue("listingId") as string
      return listingId ? (
        <span className="text-xs font-mono bg-muted px-1 py-0.5 rounded">{listingId}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "houseId",
    header: "House ID",
    cell: ({ row }) => {
      const houseId = row.getValue("houseId") as string
      return houseId ? (
        <span className="text-xs font-mono bg-muted px-1 py-0.5 rounded">{houseId}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "apartmentType",
    header: "Apt Type",
    cell: ({ row }) => {
      const type = row.getValue("apartmentType") as string
      return type ? (
        <span className="text-sm">{type}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "availableFrom",
    header: "Available From",
    cell: ({ row }) => {
      const date = row.getValue("availableFrom") as string
      return date ? (
        <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "streetAddress",
    header: "Street Address",
    cell: ({ row }) => {
      const address = row.getValue("streetAddress") as string
      return address ? (
        <div className="max-w-[150px]">
          <span className="text-sm truncate block" title={address}>{address}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "landmark",
    header: "Landmark",
    cell: ({ row }) => {
      const landmark = row.getValue("landmark") as string
      return landmark ? (
        <div className="max-w-[120px]">
          <span className="text-sm truncate block" title={landmark}>{landmark}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    accessorKey: "baranda",
    header: "Baranda",
    cell: ({ row }) => {
      const baranda = row.getValue("baranda") as number
      return baranda !== undefined ? (
        <span className="text-sm">{baranda}</span>
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
      const property = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(property)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(property)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {showConfirmAction && (
              <DropdownMenuItem onClick={() => onConfirm?.(property)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Property
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete?.(property)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
