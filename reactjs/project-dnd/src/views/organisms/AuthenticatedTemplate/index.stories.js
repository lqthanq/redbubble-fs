import store from "ducks/store";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AuthenticatedTemplate from "./index";
const TestComponent = (props) => {
  return <AuthenticatedTemplate {...props} />;
};
export default {
  title: "organisms/AuthenticatedTemplate",
  component: TestComponent,
  decorators: [
    (story) => (
      <Provider store={store}>
        <BrowserRouter>{story()}</BrowserRouter>
      </Provider>
    ),
  ],
};
const Template = (args) => <TestComponent {...args} />;
export const Normal = Template.bind({});
Normal.args = {};
