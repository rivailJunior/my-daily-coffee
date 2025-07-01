export const onlyNumber = (value: string) => {
  const newValue = value.replace(/[^0-9]/g, '');
  if (value !== newValue) {
    value = newValue;
  }
  return parseInt(value, 10);
};
