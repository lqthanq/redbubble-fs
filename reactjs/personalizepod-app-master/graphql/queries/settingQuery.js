import { gql } from "@apollo/client";

export const SETTINGS = gql`
  query settings($menu: SettingMenu, $type: SettingType) {
    settings(menu: $menu, type: $type) {
      id
      title
      type
      menu
      settings
    }
  }
`;
export const SETTING_ID = gql`
  query setting($id: String!) {
    setting(id: $id) {
      id
      title
      type
      menu
      settings
    }
  }
`;
