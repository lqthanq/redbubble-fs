import { Box, Button, IconButton } from "@material-ui/core";
import { FormatListBulleted } from "@material-ui/icons";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import React from "react";

/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    // <IconButton onClick={props.onOpenDrawer}>
    //   <FormatListBulleted />
    // </IconButton>
    <Box position="fixed" right="0">
      <Button
        size="large"
        startIcon={<FormatListNumberedIcon />}
        variant="contained"
        onClick={props.onOpenDrawer}
        disableElevation={true}
      >
        定期回収リスト
      </Button>
    </Box>
  );
};
export default Presententer;
