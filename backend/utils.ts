import { UnparsedDroneXML } from './types';

export const parseDrones = (unparsed: UnparsedDroneXML) => {
  if (!unparsed.report) return null;

  const drones = unparsed.report.capture.drone.map((d) => {
    return {
      serialNumber: d.serialNumber._text,
      model: d.model._text,
      manufacturer: d.manufacturer._text,
      mac: d.mac._text,
      ipv4: d.ipv4._text,
      ipv6: d.ipv6._text,
      firmware: d.firmware._text,
      positionY: d.positionY._text,
      positionX: d.positionX._text,
      altitude: d.altitude._text
    };
  });

  return { timestamp: unparsed.report.capture._attributes.snapshotTimestamp, drones };
};