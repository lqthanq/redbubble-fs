import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import React from "react";

/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  const { innerRef, data, provided } = props;
  return (
    <Box
      {...{ ref: innerRef }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      boxShadow={2}
      borderRadius={4}
      p={1}
      mt={2}
    >
      <Box display="flex" alignItems="center">
        <Box fontWeight="fontWeightBold">{data?.field}</Box>
        <Box fontWeight="fontWeightMedium" ml={2}>
          {data?.name}
        </Box>
      </Box>
      <Box color="text.secondary">{data?.productField}</Box>
      <Box color="text.secondary">
        <List dense={true} disablePadding={true}>
          <ListItem className={props.classes.box__times}>
            <ListItemAvatar className={props.classes.box__times__icon}>
              <QueryBuilderIcon fontSize="small" />
            </ListItemAvatar>
            <ListItemText
              primary={data?.times?.date}
              secondary={data?.times?.time}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};
export default Presententer;
