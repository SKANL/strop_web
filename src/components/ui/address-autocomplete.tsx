"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import { fetchAddressSuggestions, type GeoSuggestion } from "@/lib/geoapify"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: GeoSuggestion) => void
  placeholder?: string
  className?: string
  id?: string
}

export function AddressAutocomplete({ 
  value, onChange, onSelect, placeholder, className, id 
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    const results = await fetchAddressSuggestions(query)
    setSuggestions(results)
    setOpen(results.length > 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, fetchSuggestions])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (suggestion: GeoSuggestion) => {
    onChange(suggestion.label)
    onSelect(suggestion)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin pointer-events-none" />
        )}
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(s) }}
                  className="w-full flex items-start gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{s.label}</p>
                    {s.city && <p className="text-xs text-muted-foreground truncate">{s.city}{s.country ? `, ${s.country}` : ''}</p>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-3 py-1.5 border-t">
            <p className="text-[10px] text-muted-foreground">
              Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Geoapify</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
