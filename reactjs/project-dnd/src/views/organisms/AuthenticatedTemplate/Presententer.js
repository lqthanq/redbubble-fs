import React from "react";
import clsx from "clsx";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Copyright from "views/atoms/Copyright";
import { Notifications } from "views/molecules";
import SideMenu from "../SideMenu";
import UserProfileModal from "../UserProfileModal";
//import LanguageSelector from "../../molecules/LanguageSelector";

Presententer.propTypes = {};

function Presententer(props) {
  const {
    classes,
    openSideMenu,
    closeSideMenu,
    openUserMenu,
    closeUserMenu,
    openUserProfile,
    closeUserProfile,
    systemName,
    signOut,
    children,
    user,
    sideMenuOpen,
    userMenuAnchor,
    userProfileOpen,
    notifications,
    routes,
  } = props;
  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        color="inherit"
        className={clsx(classes.appBar, sideMenuOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={openSideMenu}
            className={clsx(
              classes.menuButton,
              sideMenuOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {process.env.REACT_APP_SYSTEM_NAME}
          </Typography>
          <Notifications value={notifications} />
          <Button onClick={openUserMenu}>
            <Avatar src={user?.icon} />
            <Typography className={classes.userName}>{user?.name}</Typography>
          </Button>
          <Menu
            keepMounted
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={closeUserMenu}
          >
            <MenuItem onClick={openUserProfile} className={classes.item}>
              アカウント管理
            </MenuItem>
            <MenuItem onClick={signOut} className={classes.item}>
              ログアウト
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !sideMenuOpen && classes.drawerPaperClose
          ),
        }}
        open={sideMenuOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={closeSideMenu}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <SideMenu routes={routes} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <UserProfileModal
          open={userProfileOpen}
          onClose={closeUserProfile}
          value={user}
        />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </main>
    </div>
  );
}

export default Presententer;
