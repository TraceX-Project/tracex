export type PhotonResponse = {
  type: string;
  features: PhotonFeature[];
}

export type PhotonFeature = {
  type: string;
  properties: PhotonProperties;
  geometry: PhotonGeometry;
}

export type PhotonProperties = {
  osm_id: number
  osm_type: "N" | "W" | "R"
  osm_key: string
  osm_value: string
  type: string
  name?: string
  housenumber?: string
  street?: string
  locality?: string
  district?: string
  postcode?: string
  city?: string
  county?: string
  state?: string
  country?: string
  countrycode?: string
  extent?: [number, number, number, number]
  extra?: Record<string, string>
}

export type PhotonGeometry = {
  type: string;
  coordinates: number[];
}