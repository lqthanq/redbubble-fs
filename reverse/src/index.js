function removeNil(as) {
  return as.filter(function (a) {
    return a != null;
  });
}

module.exports = removeNil;