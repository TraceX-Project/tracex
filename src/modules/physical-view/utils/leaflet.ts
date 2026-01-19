import { type PhotonProperties } from "../_types/map";


export const formatAddress = (properties?: PhotonProperties): string => {
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
