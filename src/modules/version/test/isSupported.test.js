import { isSupported } from '../isSupported';

test('numbers', () => {
  const expected = [
    ['0.5.0', '0.6.0', true],
    ['0.5.0', '0.5.2', true],
    ['0.5.2', '0.5.2', true],
    ['0.5.3', '0.5.2', false],
    ['1.5.3', '0.5.4', false],
    ['15.5.3', '26.5.4', true],
    ['0.8.1', '0.9.0', true],
    ['1.0.0', '0.99.99', false],
    ['2.0.1', '3.0.0', true],
    ['2.0.1', '2.1.0', true],
    ['2.0.1', '2.0.1', true],
  ];
  for (const [minSupported, current, expectedResult] of expected) {
    expect(isSupported(minSupported, current)).toBe(expectedResult);
  }
});
