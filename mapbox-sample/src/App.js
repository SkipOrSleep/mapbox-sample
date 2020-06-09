import React from 'react';

import Top from './components/top'
import NotFound from './components/notfound'
import Mapbox from './components/mapbox'
import OpenStreetMap from './components/openstreetmap'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import queryString from 'query-string';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ExploreIcon from '@material-ui/icons/ExploreOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const drawerWidth = '240px';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth})`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const handleAlertDialogOpen = () => {
    setAlertDialogOpen(true);
  };
  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false);
  };

  const appInfoDialog = () => {
    return (
      <div>
        <Dialog
          open={alertDialogOpen}
          onClose={handleAlertDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"このアプリについて："}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              このアプリは、ReactによるMapbox実装の技術検証を目的としたものです。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Router basename="/mapbox-sample">
              <Switch>
                <Route exact path="/" render={ (props) =>
                  {return('Top')}
                }/>
                <Route exact path="/mapbox" render={ (props) =>
                  {return('Mapbox')}
                }/>
                <Route exact path="/openstreetmap" render={ (props) =>
                  {return('OpenStreetMap')}
                }/>
                <Route render={ (props) =>
                  {return('NotFound')}
                }/>
              </Switch>
            </Router>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key="Top" component="a" href="http://localhost:3000/mapbox-sample/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Top" />
          </ListItem>
          <ListItem button key="NotFound" component="a" href="http://localhost:3000/mapbox-sample/aaa">
            <ListItemIcon>
              <NotInterestedIcon />
            </ListItemIcon>
            <ListItemText primary="NotFound" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="Mapbox"
            component="a"
            href="http://localhost:3000/mapbox-sample/mapbox?lat=35&lon=135&zoom=15&pitch=60&bearing=180"
          >
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Mapbox" />
          </ListItem>
          <ListItem
            button
            key="OpenStreetMap"
            component="a"
            href="http://localhost:3000/mapbox-sample/openstreetmap?lat=35&lon=135&zoom=15"
          >
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="OpenStreetMap" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="About">
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" onClick={handleAlertDialogOpen} />
          </ListItem>
        </List>
      </Drawer>

      <div className={classes.drawerHeader} />
      <Router basename="/mapbox-sample">
        <Switch>
          <Route exact path="/" render={ (props) =>
            <div>
              <Top />
              {appInfoDialog()}
            </div>
          }/>
          <Route exact path="/mapbox" render={ (props) =>
            <div>
              <Mapbox qs={queryString.parse(props.location.search)} />
              {appInfoDialog()}
            </div>
          }/>
          <Route exact path="/openstreetmap" render={ (props) =>
            <div>
              <OpenStreetMap qs={queryString.parse(props.location.search)} />
              {appInfoDialog()}
            </div>
          }/>
          <Route render={ (props) =>
            <div>
              <NotFound />
              {appInfoDialog()}
            </div>
          }/>
        </Switch>
      </Router>

    </div>
  );
}
