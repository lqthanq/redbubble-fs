const fn = () => 1;
class UserInfo {
  constructor(userInfo) {
    this.data = userInfo || {};
  }
  buildDimensions() {
    var dimensions = Object.assign({}, this.userInfo.toDimensions(), this.experiments.toDimensions(), this.userAccount.toDimensions(), this.dimensions.toDimensions());
    return Object.keys(dimensions).reduce(function (prev, cur) {
      if (dimensions[cur] == null) return prev;
      return _extends({}, prev, _defineProperty({}, cur, dimensions[cur]));
    }, {});
  }
}