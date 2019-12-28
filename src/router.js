import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Login from './Components/Login/Login';
import Registration from './Components/Registration/Registration';
import ToDoList from './Components/ToDoList/ToDoList';
import LogOut from './Components/Login/LogOut';

export default (
  <Router>
    <div>
      <Grid
        container
        justify="center"
        alignItems="center"
      >
        <Switch>
          <Route path="/ToDoList">
            <ToDoList />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Grid>
      <LogOut />
    </div>
  </Router>
);
