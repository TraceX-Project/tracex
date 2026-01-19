import { useRef } from "react"
import { useMapEvents } from "react-leaflet"
import { usePhysicalMapStore } from "./_store/physical-map.store"
import { reverseGeocode } from "./_services/map.service"
import { formatAddress } from "./utils/leaflet"

const MapClickHandler = () => {
  const { setSelectedLocation } = usePhysicalMapStore(state => state.actions)
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useMapEvents({
    click: (e) => {
      setSelectedLocation({
        name: 'Loading...',
        address: 'Fetching address...',
        location: e.latlng
      })

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      debounceTimerRef.current = setTimeout(() => {
        void (async () => {
          const controller = new AbortController()
          abortControllerRef.current = controller

          try {
            const response = await reverseGeocode(e.latlng.lat, e.latlng.lng, controller.signal)

            setSelectedLocation({
              name: response.features[0].properties.name ?? 'Unknown Location',
              address: formatAddress(response.features[0].properties),
              location: e.latlng
            })
          } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
              return
            }

            console.error("Reverse geocoding failed", error)
            setSelectedLocation({
              name: 'Unknown Location',
              address: 'Address not found',
              location: e.latlng
            })
          }
        })()
      }, 300)
    },
  })

  return null
}

export default MapClickHandler