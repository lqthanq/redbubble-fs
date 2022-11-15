import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Dialog,
    IconButton,
    Slide,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { forwardRef } from "react";

export const TRANSITION = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});
export const Presententer = (props) => (
    <>
        <Dialog fullScreen open={props?.open} TransitionComponent={TRANSITION}>
            <AppBar
                position="fixed"
                color="primary"
                className={props.classes.appBar}
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props?.onClose}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography variant="h5" className={props?.classes.title}>
                        {props?.title}
                    </Typography>
                    {props?.action}
                    <Button
                        autoFocus
                        color="inherit"
                        type="submit"
                        onClick={props.onSubmit}
                        disabled={props?.disabled}
                        size="large"
                    >
                        {props?.isSubmit ? (
                            <CircularProgress size={24} />
                        ) : null}
                        {props?.textConfirm}
                    </Button>
                </Toolbar>
            </AppBar>
            <div className={props.classes.appBarSpacer} />
            <Container maxWidth="lg">{props.children}</Container>
        </Dialog>
    </>
);
