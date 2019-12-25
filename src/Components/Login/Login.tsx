import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

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
          <input
            type="text"
            name="login"
            value={login}
            onChange={this.onChangeLogin}
            placeholder="Enter your login..."
          />
          <br />
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Enter your Password..."
          />
          <br />
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
