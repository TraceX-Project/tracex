// API docs: https://photon.komoot.io/

import { PROTON_API_URL } from "@/shared/config/endpoints"
import { type PhotonResponse } from "../_types/map"

export const reverseGeocode = async (lat: number, lng: number, signal?: AbortSignal) => {
  const res = await fetch(`${PROTON_API_URL}/reverse?lat=${lat}&lon=${lng}`, { signal })

  return res.json() as Promise<PhotonResponse>
}