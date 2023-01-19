export interface Drone {
  serialNumber: string,
  model: string,
  manufacturer: string,
  mac: string,
  ipv4: string,
  ipv6: string,
  firmware: string,
  coordinates: Coordinates;
  altitude: number,
  timestamp: string;
  distanceToNest?: number;
}

export interface Pilot {
  pilotId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  lastUpdate: Date;
  distanceToNest: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type QueryParams = Partial<Record<string, string | number | Date>>;

export interface PilotQueryParams extends QueryParams {
  order?: string;
  date: Date;
}