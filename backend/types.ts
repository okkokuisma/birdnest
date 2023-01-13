import { ElementCompact } from 'xml-js';

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

export interface UnparsedDroneXML extends ElementCompact {
  report?: {
    capture: {
      _attributes: {
        snapshotTimestamp: string
      },
      drone: UnparsedDrone[]
    }
  }
}