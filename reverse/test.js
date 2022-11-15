"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var UserInfo = (function () {
  function UserInfo(userInfo) {
    _classCallCheck(this, UserInfo);

    this.data = userInfo || {};
  }

  _createClass(UserInfo, [
    {
      key: "validate",
      value: function validate() {
        if (!(this.data && Object.keys(this.data).length)) {
          return new Error("expected a non-empty object");
        } else if (typeof this.data.isLoggedIn === "undefined") {
          return new Error("required isLogged is missing");
        } else if (typeof this.data.locale === "undefined") {
          return new Error("required locale is missing");
        } else if (typeof this.data.federatedId === "undefined") {
          return new Error("required federatedId is missing");
        }
        return null;
      },
    },
    {
      key: "toDimensions",
      value: function toDimensions() {
        if (!Object.keys(this.data).length) return null;

        return {
          dimension1: this.userType(),
          dimension10: this.language(),
          dimension20: this.federatedId(),
        };
      },
    },
    {
      key: "userType",
      value: function userType() {
        return this.data.isLoggedIn ? "Member" : "Visitor";
      },
    },
    {
      key: "language",
      value: function language() {
        return this.data.locale;
      },
    },
    {
      key: "federatedId",
      value: function federatedId() {
        return this.data.federatedId;
      },
    },
  ]);

  return UserInfo;
})();

exports.default = UserInfo;
