import gql from "graphql-tag";

export const CEATE_SETTING = gql`
  mutation createSetting(
    $title: String!
    $type: SettingType!
    $menu: SettingMenu!
    $settings: [Map]
  ) {
    createSetting(
      title: $title
      type: $type
      menu: $menu
      settings: $settings
    ) {
      id
      title
      type
      menu
      settings
    }
  }
`;
export const UPDATE_SETTING = gql`
  mutation updateSetting(
    $id: String!
    $title: String!
    $type: SettingType!
    $menu: SettingMenu!
    $settings: [Map]
  ) {
    updateSetting(
      id: $id
      title: $title
      type: $type
      menu: $menu
      settings: $settings
    ) {
      id
      title
      type
      menu
      settings
    }
  }
`;
