"use client"

import { useState, useEffect } from "react"
import { Search, X, Building, Truck, Package, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  type: "property" | "trip" | "truck" | "furniture"
  url: string
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        // Mock search results - in real app, this would call your API
        const mockResults: SearchResult[] = [
          {
            id: "1",
            title: "Luxury Villa in Miami",
            subtitle: "Property • $2,500,000 • Confirmed",
            type: "property",
            url: "/properties/confirmed",
          },
          {
            id: "2",
            title: "Trip to New York",
            subtitle: "Trip • Scheduled • Truck TRK-001",
            type: "trip",
            url: "/trips",
          },
          {
            id: "3",
            title: "Volvo FH16",
            subtitle: "Truck • Available • 40ft capacity",
            type: "truck",
            url: "/trucks",
          },
          {
            id: "4",
            title: "Office Furniture Request",
            subtitle: "Furniture • Pending • Commercial",
            type: "furniture",
            url: "/furniture",
          },
        ].filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase()),
        )

        setResults(mockResults)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "property":
        return <Building className="h-4 w-4" />
      case "trip":
        return <MapPin className="h-4 w-4" />
      case "truck":
        return <Truck className="h-4 w-4" />
      case "furniture":
        return <Package className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "property":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "trip":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "truck":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "furniture":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    setOpen(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogHeader className="px-4 pb-0 pt-4">
          <DialogTitle className="sr-only">Global Search</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties, trips, trucks, furniture..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
          />
          {query && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setQuery("")}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{result.title}</p>
                    <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                  </div>
                  <Badge variant="outline" className={getTypeColor(result.type)}>
                    {result.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Start typing to search across all modules...
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
