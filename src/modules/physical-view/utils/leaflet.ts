import { type PlaceFeature } from "@/shared/components/ui/place-autocomplete";

type Properties = PlaceFeature["properties"];

export const formatAddress = (properties?: Properties): string => {
  if (!properties) return "";

  const {
    housenumber,
    street,
    city,
    locality,
    state,
    country,
  } = properties;

  const parts = [
    formatStreet(housenumber, street),
    city ?? locality,
    state && state !== city ? state : undefined,
    country,
  ];

  return parts.filter(Boolean).join(", ");
};


const formatStreet = (
  housenumber?: string,
  street?: string
): string | undefined => {
  if (!street) return undefined;

  return housenumber ? `${housenumber} ${street}` : street;
};
