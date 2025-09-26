"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2, Truck, Route, Sofa, ChevronDown, Database, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Properties",
    icon: Building2,
    children: [
      {
        name: "Unconfirmed Properties",
        href: "/properties/unconfirmed",
        icon: Clock,
      },
      {
        name: "Confirmed Properties",
        href: "/properties/confirmed",
        icon: CheckCircle,
      },
    ],
  },
  {
    name: "Trips Management",
    href: "/trips",
    icon: Route,
  },
  {
    name: "Trucks Management",
    href: "/trucks",
    icon: Truck,
  },
  {
    name: "Furniture Requests",
    href: "/furniture",
    icon: Sofa,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>(["Properties"])

  const toggleItem = (name: string) => {
    setOpenItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-sidebar-primary" />
          <span className="text-xl font-semibold text-sidebar-foreground">Arambo CMS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          if (item.children) {
            const isOpen = openItems.includes(item.name)
            const hasActiveChild = item.children.some((child) => pathname === child.href)

            return (
              <Collapsible key={item.name} open={isOpen} onOpenChange={() => toggleItem(item.name)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      (isOpen || hasActiveChild) && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-4 pt-1">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          pathname === child.href &&
                            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                        )}
                      >
                        <child.icon className="h-4 w-4 mr-3" />
                        {child.name}
                      </Button>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === item.href &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
