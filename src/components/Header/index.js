import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {lightBlue} from "@material-ui/core/colors";
import CourseCard from "../CourseCard";
import Grid from "@material-ui/core/Grid";
import {Box} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import BreadCrumbs from "../BreadCrumbs";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    cardInfo:{
        margin: 5 + 'px'
    },
    sideBarIcon: {
        paddingLeft: 7
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        width: 100 + '%'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: lightBlue["900"]
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(2),
    },
}));

export default function Header() {
    const classes = useStyles();
    const theme = useTheme();
    const lowerThenSm = useMediaQuery(theme.breakpoints.down('sm'));
    const lowerThenMd = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open && !lowerThenSm,
                })}
            >
                <Toolbar>
                    {!lowerThenSm ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon/>
                        </IconButton>

                    ) : ''}
                    <Typography variant="subtitle1" noWrap>
                        КГУ. Дистанционное обучение
                    </Typography>
                </Toolbar>
            </AppBar>
            {!lowerThenSm ? (
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon className={classes.sideBarIcon}>
                                    {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon className={classes.sideBarIcon}>
                                    {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            ) : ''}
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Container
                    maxWidth={lowerThenMd ? (lowerThenSm ? 'sm' : 'md') : 'lg'}
                >
                    {/*<div>*/}
                    {/*    <Box mb={3}>*/}
                    {/*        <BreadCrumbs/>*/}
                    {/*    </Box>*/}
                    {/*</div>*/}
                    <Grid container spacing={5}>
                        <Grid justify="space-around" container spacing={2} item xs={12}>
                            <CardRaw/>
                        </Grid>
                    </Grid>

                </Container>
                {/*<div>*/}
                {/*    {lowerThenSm ? (*/}
                {/*        <footer className={classes.footer}>*/}
                {/*            <LabelBottomNavigation/>*/}
                {/*        </footer>*/}
                {/*    ) : ' '}*/}
                {/*</div>*/}
            </main>
        </div>
    );
}

const CardRaw = () => {
    const theme = useTheme();

    const lowerThenSm = useMediaQuery(theme.breakpoints.down('sm'));
    const lowerThenMd = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <React.Fragment>
            {cardsInfo.map(card => (
                    <Grid key={card.id} item xs={lowerThenMd ? (lowerThenSm ? 12 : 6) : 3}>
                        <CourseCard
                            head={card.head}
                            title={card.title}
                            from={card.from.toISOString().slice(0, 10)}
                            to={card.to.toISOString().slice(0, 10)}
                            info={card.info}
                            rating={card.rating}
                        />
                    </Grid>
                )
            )}
        </React.Fragment>
    )
};


const cardsInfo = [
    {
        id: 1,
        head: 'Е',
        title: 'Математика. ЕГЭ',
        info: 'I\'ll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.',
        from: new Date('1988-03-21'),
        to: new Date('1988-03-21'),
        rating: 1 + Math.random() * (5 - 1)
    },
    {
        id: 2,
        head: 'Е',
        title: 'Математика. ЕГЭ',
        info: 'I\'ll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.',
        from: new Date('1988-03-21'),
        to: new Date('1988-03-21'),
        rating: 1 + Math.random() * (5 - 1)
    },
    {
        id: 3,
        head: 'Е',
        title: 'Математика. ЕГЭ',
        info: 'I\'ll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.',
        from: new Date('1988-03-21'),
        to: new Date('1988-03-21'),
        rating: 1 + Math.random() * (5 - 1)
    },
    {
        id: 4,
        head: 'Е',
        title: 'Математика. ЕГЭ',
        info: 'I\'ll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.',
        from: new Date('1988-03-21'),
        to: new Date('1988-03-21'),
        rating: 1 + Math.random() * (5 - 1)
    }
];
