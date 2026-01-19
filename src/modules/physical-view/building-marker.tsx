import { MapTooltip } from "@/shared/components/ui/map"
import { MapCustomMarker } from "@/shared/components/ui/map-custom-marker"
import { type Building } from "../buildings/_types/buildings"
import { BuildingMarkerContextMenu } from "./building-marker-context-menu"

type Props = {
  building: Building
}

const BuildingMarker = ({ building }: Props) => {
  return (
    <MapCustomMarker
      position={building.location}
      icon={
        <BuildingMarkerContextMenu building={building} />
      }
    >
      <MapTooltip side="bottom">
        {building.name}
      </MapTooltip>
    </MapCustomMarker>
  )
}

export default BuildingMarker