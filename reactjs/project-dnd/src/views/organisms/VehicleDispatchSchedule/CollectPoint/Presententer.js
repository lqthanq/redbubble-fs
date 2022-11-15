import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { Add, MoreVert, QueryBuilder } from "@material-ui/icons";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import React from "react";
import { TextSearcher } from "views/molecules";
import { Draggable, Droppable } from "react-beautiful-dnd";


/**
 *  回収ポイントを表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  const { ListItems, classes } = props;
  return (
    <Box mt={5}>
      <Grid container spacing={4}>
        <Grid item md={6}>
          <Box
            width="100%"
            display="flex"
            justify-content="space-between"
            alignItems="center"
          >
            <Box width="85%">
              <TextSearcher />
            </Box>
            <Box
              ml={4}
              color="info.main"
              border={1}
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              width="55px"
              height="55px"
              borderRadius="4px"
            >
              <RestoreFromTrashIcon />
              <Box fontSize="11px" component="span">
                定期回収
              </Box>

            </Box>
            {/* <Box ml={4}>
              <Button
                variant="outlined"
                className={classes.buttonDelete}
                size="large"
                color="primary"
                startIcon={<RestoreFromTrashIcon />}
              >
                定期回収
              </Button>
            </Box> */}
          </Box>
        </Grid>

        <Grid item md={6} />
        <Grid item md={12}>
          <Grid container spacing={2}>
            {props.ListItems.map((list, index) => (
              <Grid item md={4} key={index} >

                <Box bgcolor="rgba(0, 0, 0, 0.06)" borderRadius={4} p={1}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box flexGrow={1} ml={1}>
                      {list.name}
                    </Box>
                    <Box>
                      <IconButton
                        aria-label="settings"
                        disableRipple={true}
                        disableFocusRipple={true}
                        size="small"
                      >
                        <MoreVert />

                      </IconButton>
                      <Button onClick={props.onChangeTitle}>Change Title</Button>
                    </Box>
                  </Box>

                  <Droppable droppableId={String(list.id)}>
                    {(provided) => (
                      <Box  {...provided.droppableProps} ref={provided.innerRef} minHeight="105px">
                        {list?.cards?.map((card, index) => (
                          <div key={card.id} >
                            <Draggable draggableId={card?.id} index={index}>
                              {(provided) => (
                                <Box
                                  boxShadow={2}
                                  bgcolor="#fff"
                                  borderRadius={4}
                                  p={1}
                                  mt={2}
                                  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                >
                                  <Box
                                    borderRadius="50%"
                                    bgcolor="text.primary"
                                    color="#fff"
                                    minWidth="25px"
                                    height="25px"
                                    lineHeight="23px"
                                    fontWeight="fontWeightBold"
                                    display="inline-block"
                                    textAlign="center"
                                  >
                                    {index + 1}
                                  </Box>
                                  <Box display="flex" alignItems="center">
                                    <Box fontWeight="fontWeightBold">{card?.field}</Box>
                                    <Box fontWeight="fontWeightMedium" ml={2}>
                                      {card?.name}
                                    </Box>
                                  </Box>
                                  <Box color="text.secondary">{card?.productField}</Box>
                                  <Box color="text.secondary">
                                    <List dense={true} disablePadding={true}>
                                      <ListItem className={props.classes.box__times}>
                                        <ListItemAvatar
                                          className={props.classes.box__times__icon}
                                        >
                                          <QueryBuilder fontSize="small" />
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={card?.times?.date}
                                          secondary={card?.times?.time}
                                        />
                                      </ListItem>
                                    </List>
                                  </Box>
                                </Box>
                              )}
                            </Draggable>
                          </div>

                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Box>
              </Grid>
            ))}

            <Grid item xs={4}>
              <Box bgcolor="rgba(0, 0, 0, 0.06)" borderRadius={4}>

                <Button
                  className={classes.buttonAdd}
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  size="large"
                  disableElevation={true}
                  onClick={props.onClickAddList}
                >
                  新しい配車リストを追加する
                </Button>

              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box >
  );
};
export default Presententer;
