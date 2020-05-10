const symbolByTier = ['', 'k', 'm', 'b', 't', 'p', 'e'];

export function formatCount(number) {
  const tier = (Math.log10(number) / 3) | 0;

  if (tier == 0) return number.toString();

  const suffix = symbolByTier[tier];
  const scale = Math.pow(10, tier * 3);

  const scaled = number / scale;

  const shortNum =
    scaled >= 100
      ? Math.floor(scaled).toString()
      : (Math.floor(scaled * 10) / 10).toFixed(1);

  return shortNum + suffix;
}
