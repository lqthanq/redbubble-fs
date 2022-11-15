import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  box__times: {
    padding: 0,
    "& .MuiListItemText-root ": {
      marginTop: 0,
      marginBottom: 0,
    },
  },
  box__times__icon: {
    minWidth: "25px",
  },
  buttonAdd: {
    backgroundColor: "initial",
  },
  buttonDelete:{
      
  }
}));
