'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Marker, type MarkerProps } from 'react-leaflet';
import { useLeaflet } from './map';

interface MapCustomMarkerProps extends Omit<MarkerProps, 'icon'> {
  icon: React.ReactNode;
  iconAnchor?: L.PointExpression;
}

export function MapCustomMarker({ icon, children, iconAnchor, ...props }: MapCustomMarkerProps) {
  const { L } = useLeaflet();
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure we are in the browser
    if (typeof document !== 'undefined') {
      setEl(document.createElement('div'));
    }
  }, []);

  const customIcon = useMemo(() => {
    if (!L || !el) return null;

    return L.divIcon({
      html: el,
      className: 'bg-transparent', // Essential to prevent Leaflet's default styles from interfering used for size=0
      iconSize: undefined, // Allow the React content to determine the size
      iconAnchor: iconAnchor ?? [16, 16],
    });
  }, [L, el, iconAnchor]);

  if (!L || !customIcon || !el) return null;

  return (
    <>
      {createPortal(icon, el)}
      <Marker icon={customIcon} {...props}>
        {children}
      </Marker>
    </>
  );
}
