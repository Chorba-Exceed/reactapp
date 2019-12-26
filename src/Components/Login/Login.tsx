import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { IState } from './types';
import ApiRequests from '../../utils/ApiRequests';

class Login extends React.Component<RouteComponentProps, IState> {
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { login: '', password: '' };
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  onChangeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ login: event.target.value });
  }

  onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  async handleLogin(event: React.FormEvent<HTMLInputElement>) {
    const { login, password } = this.state;
    const { history } = this.props;
    event.preventDefault();
    const data = {
      login,
      password,
    };

    const response = await this.api.authenticateRequest(data);
    if (response.success) {
      localStorage.setItem('token', response.token);
      history.push('/ToDoList');
    }
  }

  render(): React.ReactNode {
    const { login, password } = this.state;
    return (
      <div>
        <form>
          <TextField
            label="Enter your login"
            type="text"
            value={login}
            onChange={this.onChangeLogin}
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            label="Enter your Password"
            type="password"
            value={password}
            onChange={this.onChangePassword}
            variant="outlined"
          />
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
          >
            Sign in
          </Button>
          <input
            type="submit"
            onClick={this.handleLogin}
            value="Sign in"
          />
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
