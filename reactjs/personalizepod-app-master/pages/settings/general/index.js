import { PageHeader } from "antd";

const {
  default: GeneralSettings,
} = require("components/Settings/GeneralSettings");

const SettingsPage = () => {
  return (
    <div>
      {/* <PageHeader title="General Settings" /> */}
      <GeneralSettings />
    </div>
  );
};
SettingsPage.title = "General Settings";
export default SettingsPage;
