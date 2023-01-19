import xmlparser from 'xml-js';
import axios from 'axios';

import { Coordinates, Drone, Pilot, PilotQueryParams } from '../../types';
import { ndzRadius, monadiCoordinates } from './constants';
import { getOne, createPilot, updatePilot } from './db/pilotService';

interface UnparsedDrone {
  serialNumber: { _text: unknown },
  model: { _text: unknown },
  manufacturer: { _text: unknown },
  mac: { _text: unknown },
  ipv4: { _text: unknown },
  ipv6: { _text: unknown },
  firmware: { _text: unknown },
  positionY: { _text: unknown },
  positionX: { _text: unknown },
  altitude: { _text: unknown }
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

const isDate = (date: unknown): date is Date => {
  return date instanceof Date;
};

const parseDate = (date: unknown): Date => {
  if (!date || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

export const parsePilotQueryParams = (query: { order?: unknown; date?: unknown; }): PilotQueryParams => {
  let { order, date } = query;
  if (!date) date = new Date(Date.now() - 10 * 60 * 1000);
  if (!order) order = "DESC";

  return {
    order: parseString(order),
    date: parseDate(date)
  };
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
      y: parseNumber(parseFloat(parseString(drone.positionY._text))),
      x: parseNumber(parseFloat(parseString(drone.positionX._text))),
    },
    altitude: parseNumber(parseFloat(parseString(drone.altitude._text))),
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

export const calcDistanceToNest = (droneCoordinates: Coordinates): number => {
  const distanceFromMonadi =
    Math.sqrt(Math.pow(monadiCoordinates.x - droneCoordinates.x, 2) + Math.pow(monadiCoordinates.y - droneCoordinates.y, 2));
  return distanceFromMonadi;
};

export const filterNdz = (drones: Drone[]): Drone[] => {
  return drones.reduce((result, drone) => {
    const distanceToNest = calcDistanceToNest(drone.coordinates);
    if (distanceToNest <= ndzRadius) {
      result.push({ ...drone, distanceToNest});
    }
    return result;
  }, [] as Drone[]);
};

const fetchDrones = async () => {
  const response = await axios.get<string>('https://assignments.reaktor.com/birdnest/drones');
  return response.data;
};

const fetchPilot = async (serialNumber: string) => {
  const response = await axios.get<Pilot>(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`);
  return response.data;
};

export const fetchNdz = async (): Promise<Pilot[]> => {
  try {
    const unparsedDrones = await fetchDrones();
    const parsedDrones = parseDroneXml(unparsedDrones);
    const dronesInNdz = filterNdz(parsedDrones);

    const pilotsInNdz = await Promise.all(dronesInNdz.map(async (drone) => {
      const pilot = await fetchPilot(drone.serialNumber);
      return drone.distanceToNest? { ...pilot, distanceToNest: drone.distanceToNest } : pilot;
    }));

    return pilotsInNdz;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateDatabase = async (pilots: Pilot[]) => {
  void await Promise.all(pilots.map(async (pilot) => {
    const pilotInstance = await getOne(pilot.pilotId);

    if (pilotInstance && (pilot.distanceToNest < pilotInstance.distance_to_nest)) {
      void await updatePilot(pilot.pilotId, pilot.distanceToNest);
    }

    if (!pilotInstance) {
      void await createPilot(pilot);
    }
  }));
};

export const fetchAndUpdate = async () => {
  const pilotsInNdz = await fetchNdz();
  void await updateDatabase(pilotsInNdz);
};