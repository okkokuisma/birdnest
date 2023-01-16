import { calcDistanceToNest } from '../src/utils';
import { Coordinates } from '../../types';

const isInNdz = (coordinates: Coordinates) => {
  return calcDistanceToNest(coordinates) <= 100000;
};

const droneCoordinates: Coordinates[] = [
  {
    x: 234560,
    y: 278900
  },
  {
    x: 321090,
    y: 245670
  },
  {
    x: 350000,
    y: 250000
  },
  {
    x: 250000,
    y: 350000
  },
  {
    x: 340630.0778,
    y: 207740.1826
  },
  {
    x: 340640.0778,
    y: 207740.1826
  },
  {
    x: 340640.0778,
    y: 207730.1826
  },
  {
    x: 350000.0001,
    y: 250000
  },
  {
    x: 250000,
    y: 350000.0001
  },
  { y: 198448.5570432612, x: 215294.12682121873 }
];

describe('isInNdz', () => {
  test('Drones are correctly declared to be in NDZ', () => {
    expect(isInNdz(droneCoordinates[0])).toBeTruthy();
    expect(isInNdz(droneCoordinates[1])).toBeTruthy();
    expect(isInNdz(droneCoordinates[2])).toBeTruthy();
    expect(isInNdz(droneCoordinates[3])).toBeTruthy();
    expect(isInNdz(droneCoordinates[4])).toBeTruthy();
    expect(isInNdz(droneCoordinates[5])).toBeFalsy();
    expect(isInNdz(droneCoordinates[6])).toBeFalsy();
    expect(isInNdz(droneCoordinates[7])).toBeFalsy();
    expect(isInNdz(droneCoordinates[8])).toBeFalsy();
    expect(isInNdz(droneCoordinates[9])).toBeTruthy();
  });
});