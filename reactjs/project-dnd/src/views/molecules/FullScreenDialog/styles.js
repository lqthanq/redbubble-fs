import { makeStyles } from "@material-ui/core";

export const stylesCreator = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  container: {
    marginTop: theme.spacing(12),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarSpacer: theme.mixins.toolbar,
}));
