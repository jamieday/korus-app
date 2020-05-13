export const isSupported = (minSupportedVersion, currentVersion) => {
  const min = minSupportedVersion.split('.');
  const current = currentVersion.split('.');
  // 1.0.0 > 0.1.2
  const x = (n) => {
    if (n == min.length || n == current.length) {
      return true;
    }
    if (current[n] < min[n]) {
      return false;
    }
    if (current[n] > min[n]) {
      return true;
    }
    return x(n + 1);
  };
  return x(0);
};
