import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Container } from '@material-ui/core';
import Login from './Components/Login/Login';
import Registration from './Components/Registration/Registration';
import ToDoList from './Components/ToDoList/ToDoList';

export default (
  <Router>
    <div>
      <Container maxWidth="sm">
        <Switch>
          <Route path="/ToDoList">
            <ToDoList />
          </Route>
          <Route path="/">
            <Login />
          </Route>
          <Route path="/Registration">
            <Registration />
          </Route>
        </Switch>
      </Container>
    </div>
  </Router>
);
