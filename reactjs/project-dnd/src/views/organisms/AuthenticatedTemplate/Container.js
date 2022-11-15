import { stylesCreator } from "./styles";
import { useSelector } from "react-redux";
import React, { useReducer } from "react";
import { Auth } from "aws-amplify";

import { useDispatch } from "react-redux";
import * as userOperations from "ducks/UserProfiles/operations.js";
import * as businessTypesOperations from "ducks/BusinessTypes/operations";
import routes, { toSideMenu } from "routes";
import { useEffectAsync } from "utils/api";
import { selectNotifications } from "ducks/Notifications";
import { selectUserProfile } from "ducks/UserProfiles";

/**
 * 初期状態
 */
const initialState = {
  sideMenuOpen: false,
  user: {},
  userMenuAnchor: null,
  userProfileOpen: false,
};

/**
 * 処理実行の種類
 */
const types = {
  SET_SIDE_MENU: "set/sidemenu",
  OPEN_SIDE_MENU: "open/sidemenu",
  CLOSE_SIDE_MENU: "close/sidemenu",
  OPEN_USER_MENU: "open/usermenu",
  CLOSE_USER_MENU: "close/usermenu",
  OPEN_USER_PROFILE: "open/userprofile",
  CLOSE_USER_PROFILE: "close/userprofile",
};

/**
 * レデューサー
 * @param {object} state 状態
 * @param {} action 実行
 */
const reducer = (state, action) => {
  switch (action.type) {
    case types.SET_SIDE_MENU:
      return {
        ...state,
        sideMenuItems: action.payload,
      };

    case types.OPEN_SIDE_MENU:
      return {
        ...state,
        sideMenuOpen: true,
      };
    case types.CLOSE_SIDE_MENU:
      return {
        ...state,
        sideMenuOpen: false,
      };
    case types.OPEN_USER_MENU:
      return {
        ...state,
        userMenuAnchor: action.payload,
      };
    case types.CLOSE_USER_MENU:
      return {
        ...state,
        userMenuAnchor: null,
      };
    case types.OPEN_USER_PROFILE:
      return {
        ...state,
        userMenuAnchor: null,
        userProfileOpen: true,
      };
    case types.CLOSE_USER_PROFILE:
      return {
        ...state,
        userProfileOpen: false,
      };
    default:
      return state;
  }
};
function Container({ render, children }) {
  const [
    { userMenuAnchor, sideMenuOpen, userProfileOpen },
    dispatch,
  ] = useReducer(reducer, initialState);

  const reduxDispatch = useDispatch();

  useEffectAsync(async (isMounted) => {
    if (isMounted) {
      reduxDispatch(userOperations.fetchProfile());
      reduxDispatch(businessTypesOperations.fetchBusinessTypes());
    }
  }, []);

  const notifications = useSelector(selectNotifications);
  const user = useSelector(selectUserProfile);
  const classes = stylesCreator();

  const openSideMenu = () => {
    dispatch({ type: types.OPEN_SIDE_MENU });
  };

  const closeSideMenu = () => {
    dispatch({ type: types.CLOSE_SIDE_MENU });
  };

  const openUserMenu = (e) => {
    dispatch({
      type: types.OPEN_USER_MENU,
      payload: e.currentTarget,
    });
  };

  const closeUserMenu = () => {
    dispatch({ type: types.CLOSE_USER_MENU });
  };

  const openUserProfile = () => {
    dispatch({ type: types.OPEN_USER_PROFILE });
  };

  const closeUserProfile = () => {
    dispatch({ type: types.CLOSE_USER_PROFILE });
  };

  const signOut = () => {
    Auth.signOut()
      .then((data) => {
        console.log("ログアウト成功：");
      })
      .catch((error) => {
        console.log("ログアウト失敗: ", error);
        // todo: ローカルセッションが不正の場合削除処理が必要?
        // todo: エラーメッセージ画面がやっぱり必要かどうか検討
      });
  };
  return render({
    classes: classes,
    openSideMenu: openSideMenu,
    closeSideMenu: closeSideMenu,
    openUserMenu: openUserMenu,
    closeUserMenu: closeUserMenu,
    openUserProfile: openUserProfile,
    closeUserProfile: closeUserProfile,
    systemName: process.env.REACT_APP_SYSTEM_NAME,
    signOut: signOut,
    children: children,
    user: user,
    sideMenuOpen: sideMenuOpen,
    userMenuAnchor: userMenuAnchor,
    userProfileOpen: userProfileOpen,
    notifications: notifications,
    routes: toSideMenu(routes),
  });
}
export default Container;
