import { formatCount } from '../formatCount';

test('numbers', () => {
  const expected = [
    [2, '2'],
    [7, '7'],
    [400, '400'],
    [1021, '1.0k'],
    [1051, '1.0k'],
    [3000, '3.0k'],
    [4125, '4.1k'],
    [9155, '9.1k'],
    [90155, '90.1k'],
    [900155, '900k'],
    [905955, '905k'],
    [10205, '10.2k'],
    [12000, '12.0k'],
    [12001, '12.0k'],
    [12501, '12.5k'],
    [105121, '105k'],
    [1050212, '1.0m'],
    [1200000, '1.2m'],
    [120000000, '120m'],
    [120500000, '120m'],
  ];
  for (const [value, expectedResult] of expected) {
    expect(formatCount(value)).toBe(expectedResult);
  }
});
