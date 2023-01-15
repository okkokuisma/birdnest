import xmlparser from 'xml-js';
import axios from 'axios';

import { Coordinates, Drone } from '../../types';
import { ndzRadius, monadiCoordinates } from './constants';

interface UnparsedDrone {
  serialNumber: { _text: string },
  model: { _text: string },
  manufacturer: { _text: string },
  mac: { _text: string },
  ipv4: { _text: string },
  ipv6: { _text: string },
  firmware: { _text: string },
  positionY: { _text: string },
  positionX: { _text: string },
  altitude: { _text: string }
}

export interface UnparsedDroneXML extends xmlparser.ElementCompact {
  report?: {
    capture: {
      _attributes: {
        snapshotTimestamp: string
      },
      drone: UnparsedDrone[]
    }
  }
}

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' || value instanceof Number;
};

const parseString = (content: unknown): string => {
  if (!content || !isString(content)) {
    throw new Error(`Incorrect or missing drone attribute`);
  }
  return content;
};

const parseNumber = (content: unknown): number => {
  if (!content || !isNumber(content)) {
    throw new Error(`Incorrect or missing drone attribute`);
  }
  return content;
};

const parseDroneAttributes = (drone: UnparsedDrone) => {
  return {
    serialNumber: parseString(drone.serialNumber._text),
    model: parseString(drone.model._text),
    manufacturer: parseString(drone.manufacturer._text),
    mac: parseString(drone.mac._text),
    ipv4: parseString(drone.ipv4._text),
    ipv6: parseString(drone.ipv6._text),
    firmware: parseString(drone.firmware._text),
    coordinates: {
      y: parseNumber(parseFloat(drone.positionY._text)),
      x: parseNumber(parseFloat(drone.positionX._text)),
    },
    altitude: parseNumber(parseFloat(drone.altitude._text)),
  };
};

export const parseDroneXml = (unparsed: string): Drone[] => {
  const parsed = xmlparser.xml2js(unparsed, { compact: true }) as UnparsedDroneXML;
  if (!parsed.report) return [];

  const { snapshotTimestamp } = parsed.report.capture._attributes;
  const drones = parsed.report.capture.drone.reduce((result, drone) => {
    try {
      result.push({
        ...parseDroneAttributes(drone),
        timestamp: parseString(snapshotTimestamp)
      });
    } catch (error) {
      // continue regardless of error
    }
    return result;
  }, [] as Drone[]);

  return drones;
};

export const isInNdz = (droneCoordinates: Coordinates): boolean => {
  const distanceFromMonadi =
    Math.sqrt(Math.pow(monadiCoordinates.x - droneCoordinates.x, 2) + Math.pow(monadiCoordinates.y - droneCoordinates.y, 2));
  console.log(distanceFromMonadi);
  return distanceFromMonadi <= ndzRadius;
};

export const filterNdz = (drones: Drone[]): Drone[] => {
  return drones.filter((drone) => isInNdz(drone.coordinates));
};

const fetchDrones = async () => {
  return await axios.get<string>('https://assignments.reaktor.com/birdnest/drones');
};

const fetchPilot = async (serialNumber: string) => {
  const response = await axios.get<string>(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`);
  return response.data;
};

export const fetchNdz = async () => {
  const unparsedDrones = await fetchDrones();
  const parsedDrones = parseDroneXml(unparsedDrones.data);
  console.log(parsedDrones);
  const dronesInNdz = filterNdz(parsedDrones);
  console.log(dronesInNdz);

  const pilotsInNdz = await Promise.all(dronesInNdz.map(async (drone) => {
    return await fetchPilot(drone.serialNumber);
  }));

  return pilotsInNdz;
};