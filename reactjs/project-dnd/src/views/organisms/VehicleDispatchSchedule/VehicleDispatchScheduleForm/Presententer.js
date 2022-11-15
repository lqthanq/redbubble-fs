import { Grid } from "@material-ui/core";
import React from "react";
import FullScreenDialog from "views/molecules/FullScreenDialog";
import CollectPoint from "../CollectPoint";
import CollectScheduleDrawer from "../CollectScheduleDrawer";
import { DragDropContext } from "react-beautiful-dnd";

const GroupTypes = ["course", "vehicle"]
/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    <FullScreenDialog
      //open={props.open}
      open={true}
      textConfirm="保存"
      title="配車計画を編集"
      onClickSubmit={props.onSubmit}
      onClose={props.onClose}
    >
      <DragDropContext onDragEnd={props.handleDragEnd}>
        <Grid container spacing={3}>
          <Grid item md={9}>
            <CollectPoint values={props.ListCources} />
          </Grid>
          <Grid item md={3}>
            <CollectScheduleDrawer values={props.SCHEDULED} />
          </Grid>
        </Grid>
      </DragDropContext>
    </FullScreenDialog>
  );
};
export default Presententer;
