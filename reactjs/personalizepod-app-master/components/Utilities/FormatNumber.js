export const formatNumber = (number) => {
  if (number) {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  } else if (number === 0) {
    return 0;
  }
};
