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
}

export interface Coordinates {
  x: number;
  y: number;
}