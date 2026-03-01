const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY!

export interface GeoSuggestion {
  label: string
  lat: number
  lng: number
  country: string
  city: string
}

export async function fetchAddressSuggestions(query: string): Promise<GeoSuggestion[]> {
  if (!query || query.length < 3) return []
  
  const params = new URLSearchParams({
    text: query,
    apiKey: GEOAPIFY_API_KEY,
    lang: 'es',
    limit: '5',
  })

  try {
    const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`)
    if (!res.ok) return []
    const json = await res.json()
    return (json.features || []).map((f: any) => ({
      label: f.properties.formatted,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      country: f.properties.country || '',
      city: f.properties.city || f.properties.state || '',
    }))
  } catch {
    return []
  }
}

export function getStaticMapUrl(
  lng: number,
  lat: number,
  opts?: { width?: number; height?: number; zoom?: number; markerColor?: string }
): string {
  const { width = 400, height = 200, zoom = 16, markerColor = 'ff5e00' } = opts ?? {}
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=${width}&height=${height}&center=lonlat:${lng},${lat}&zoom=${zoom}&marker=lonlat:${lng},${lat};type:awesome;color:%23${markerColor};size:medium&scaleFactor=2&apiKey=${GEOAPIFY_API_KEY}`
}

export function parseGpsCoords(gpsCoords: any): [number, number] | null {
  if (!gpsCoords) return null
  try {
    // PostgREST returns geometry as GeoJSON: {type:"Point", coordinates:[lng,lat]}
    if (typeof gpsCoords === 'object' && !Array.isArray(gpsCoords)) {
      if (gpsCoords.type === 'Point' && Array.isArray(gpsCoords.coordinates)) {
        return [Number(gpsCoords.coordinates[0]), Number(gpsCoords.coordinates[1])]
      }
      if (gpsCoords.lat !== undefined && gpsCoords.lng !== undefined) return [Number(gpsCoords.lng), Number(gpsCoords.lat)]
      if (gpsCoords.latitude !== undefined && gpsCoords.longitude !== undefined) return [Number(gpsCoords.longitude), Number(gpsCoords.latitude)]
    }
    if (Array.isArray(gpsCoords) && gpsCoords.length === 2) {
      return [Number(gpsCoords[0]), Number(gpsCoords[1])]
    }
    if (typeof gpsCoords === 'string') {
      // WKT: "POINT(lng lat)"
      const wktMatch = gpsCoords.match(/POINT\(([\d.\-]+)\s+([\d.\-]+)\)/i)
      if (wktMatch) return [Number(wktMatch[1]), Number(wktMatch[2])]
      // JSON fallback
      const parsed = JSON.parse(gpsCoords)
      if (Array.isArray(parsed) && parsed.length === 2) return [Number(parsed[0]), Number(parsed[1])]
      if (parsed?.type === 'Point' && Array.isArray(parsed.coordinates)) return [Number(parsed.coordinates[0]), Number(parsed.coordinates[1])]
    }
  } catch {}
  return null
}
