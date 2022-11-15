import { Button } from "@material-ui/core";
import React from "react";
import { VehicleDispatchScheduleForm } from "views/organisms/VehicleDispatchSchedule";

/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    <>
      <Button onClick={props.onClick} variant="contained" color="primary">
        配車
      </Button>
      <VehicleDispatchScheduleForm open={props.open} />
    </>
  );
};
export default Presententer;
