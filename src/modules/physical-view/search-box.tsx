'use client';

import React, { useCallback } from 'react';
import { SearchBoxProps } from '@mapbox/search-js-react/dist/components/SearchBox';
import { ENV } from '@/shared/config/env';
import dynamic from 'next/dynamic';
import { usePhysicalMapStore } from './_store/physical-map.store';
import { SearchBoxRetrieveResponse } from '@mapbox/search-js-core';

const SearchBox = dynamic(
  () =>
    import('@mapbox/search-js-react').then(
      (mod) => mod.SearchBox as React.ComponentType<SearchBoxProps>
    ),
  { ssr: false }
);

const MapboxSearchBox = () => {
  const { setSelectedLocation, setAddress, reset } = usePhysicalMapStore((state) => state.actions);

  const onRetrieve = useCallback(
    (event: SearchBoxRetrieveResponse) => {
      if (event.features && event.features.length > 0) {
        const feature = event.features[0];
        const [lng, lat] = feature.geometry.coordinates;

        setSelectedLocation({ lng, lat });

        console.log('feature', feature);
        setAddress({
          address: feature.properties.full_address,
          name: feature.properties.name,
        });
      }
    },
    [setSelectedLocation]
  );

  const onClear = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="absolute top-4 left-4 z-50 max-w-md">
      <SearchBox
        placeholder="Search for a location"
        onRetrieve={onRetrieve}
        accessToken={ENV.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onClear={onClear}
      />
    </div>
  );
};

export default MapboxSearchBox;
