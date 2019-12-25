import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Login from './Components/Login/Login';
import Registration from './Components/Registration/Registration';
import ToDoList from './Components/ToDoList/ToDoList';


export default (
  <Router>
    <div>
      <nav>
        <Link to="/Login">Login |</Link>
        <Link to="/Registration">Registration</Link>
      </nav>

      <Switch>
        <Route path="/ToDoList">
          <ToDoList />
        </Route>
        <Route path="/Login">
          <Login />
        </Route>
        <Route path="/Registration">
          <Registration />
        </Route>
      </Switch>
    </div>
  </Router>
);
