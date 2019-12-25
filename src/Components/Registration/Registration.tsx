import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IState } from './types';
import ApiRequests from '../../utils/ApiRequests';

type ValidationErrors = {
  field: string,
  error: string
};
type ValidationResult = {
  isValid: boolean,
  errors: Array<ValidationErrors>
};


class Registration extends React.Component<RouteComponentProps, IState> {
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { login: '', password: '', passwordReplay: '' };
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePasswordReplay = this.onChangePasswordReplay.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  onChangeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ login: event.target.value });
  }

  onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  onChangePasswordReplay(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ passwordReplay: event.target.value });
  }

  async handleRegistration(event: React.FormEvent<HTMLInputElement>): Promise<void> {
    event.preventDefault();
    const { login, password, passwordReplay } = this.state;
    const { history } = this.props;
    const validationResult = this.validatePassword();
    if (validationResult.isValid) {
      const responseReg = await this.api.registrationRequest({ login, password, passwordReplay });
      if (responseReg.success) {
        const loginInformation = { login, password };
        const responseLogin = await this.api.authenticateRequest(loginInformation);
        if (responseLogin.success) {
          localStorage.setItem('token', responseLogin.token);
          history.push('/ToDoList');
        }
      }
    } else {
      validationResult.errors.map((error) => alert(`${error.field}: ${error.error}`));
    }
  }

  validatePassword(): ValidationResult {
    const validationResult: ValidationResult = { isValid: true, errors: [] };
    const { login, password, passwordReplay } = this.state;
    if (!login) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'login', error: 'login can not be empty' });
    }
    if (!password) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'password', error: 'password can not be empty' });
    }
    if (password.length < 6) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'password', error: 'password length can be less than 6 characters' });
    }
    if (!passwordReplay) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'passwordReplay', error: 'passwordReplay can not be empty' });
    }
    if (password !== passwordReplay) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'passwordReplay', error: 'passwordReplay must match password' });
    }
    return validationResult;
  }

  render(): React.ReactNode {
    const { login, password, passwordReplay } = this.state;
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
            type="password"
            name="passwordReplay"
            value={passwordReplay}
            onChange={this.onChangePasswordReplay}
            placeholder="Repeat your Password..."
          />
          <br />
          <input type="submit" onClick={this.handleRegistration} value="Sign up" />
        </form>
      </div>
    );
  }
}

export default withRouter(Registration);
