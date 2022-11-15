import React from "react";
import { Box, Drawer, IconButton, Toolbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    <div>
      <Drawer
        elevation={6}
        // className={props.classes.drawer}
        variant="persistent"
        anchor="right"
        //open={props.open}
        open={true}
        classes={{
          paper: props.classes.drawerPaper,
        }}

      >
        <Toolbar />
        <Box className={props.classes.drawerHeader}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={48}
            position="relative"

          >
            <Box position="absolute" top={0} left="0" zIndex="tooltip">
              <IconButton onClick={props.onCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box flexGrow={1} fontWeight="fontWeightMedium" textAlign="center">
              {props.titleDrawer}
            </Box>
          </Box>
          {props.children}
        </Box>
      </Drawer>
    </div>
  );
};
export default Presententer;
