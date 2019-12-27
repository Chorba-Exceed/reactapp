import React, { SyntheticEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ApiRequests from '../../utils/ApiRequests';
import { IState } from './types';
import MySnackbarContentWrapper from '../Snackbar';

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
    this.state = {
      login: { valid: true, value: '' },
      password: { valid: true, value: '' },
      passwordReplay: { valid: true, value: '' },
      open: false,
      snackMessage: '',
      snackVariant: '',
    };
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePasswordReplay = this.onChangePasswordReplay.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChangeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value === '') {
      this.setState({ login: { value: '', valid: false } });
    } else {
      this.setState({ login: { value: event.target.value, valid: true } });
    }
  }

  onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length < 6) {
      this.setState({ password: { value: event.target.value, valid: false } });
    } else {
      this.setState({ password: { value: event.target.value, valid: true } });
    }
  }

  onChangePasswordReplay(event: React.ChangeEvent<HTMLInputElement>) {
    const { password } = this.state;
    if (password.value === event.target.value) {
      this.setState({ passwordReplay: { value: event.target.value, valid: true } });
    } else {
      this.setState({ passwordReplay: { value: event.target.value, valid: false } });
    }
  }

  async handleRegistration(event: React.MouseEvent<HTMLElement>): Promise<void> {
    event.preventDefault();
    const { login, password, passwordReplay } = this.state;
    const { history } = this.props;
    const validationResult = this.validatePassword();
    if (validationResult.isValid) {
      const responseReg = await this.api.registrationRequest({
        login: login.value,
        password: password.value,
        passwordReplay: passwordReplay.value,
      });
      if (responseReg.success) {
        const loginInformation = { login: login.value, password: password.value };
        const responseLogin = await this.api.authenticateRequest(loginInformation);
        if (responseLogin.success) {
          localStorage.setItem('token', responseLogin.token);
          history.push('/ToDoList');
        }
      }
    } else {
      const err = validationResult.errors.map((error) => (` ${error.error}`));
      this.setState({ snackVariant: 'error' });
      this.setState({ snackMessage: err.toString() });
      this.setState({ open: true });
    }
  }

  validatePassword(): ValidationResult {
    const validationResult: ValidationResult = { isValid: true, errors: [] };
    const { login, password, passwordReplay } = this.state;
    if (!login) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'login', error: 'Login can not be empty' });
    }
    if (!password.value) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'password', error: 'Password can not be empty' });
    }
    if (password.value.length < 6) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'password', error: 'Password length can be less than 6 characters' });
    }
    if (!passwordReplay.value) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'passwordReplay', error: 'PasswordReplay can not be empty' });
    }
    if (password.value !== passwordReplay.value) {
      validationResult.isValid = false;
      validationResult.errors.push({ field: 'passwordReplay', error: 'PasswordReplay must match password' });
    }
    return validationResult;
  }

  handleClose(event?: SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  }

  render(): React.ReactNode {
    const { login, password, passwordReplay } = this.state;
    return (
      <div>
        <h1>Registration:</h1>
        <form>
          <TextField
            error={!login.valid}
            label="Enter your login"
            type="text"
            value={login.value}
            onChange={this.onChangeLogin}
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            error={!password.valid}
            label="Enter your Password"
            type="password"
            value={password.value}
            onChange={this.onChangePassword}
            variant="outlined"
            helperText={(password.valid ? '' : 'Password should be more 6 chars')}
          />
          <br />
          <br />
          <TextField
            error={!passwordReplay.valid}
            label="Repeat your Password"
            type="password"
            value={passwordReplay.value}
            onChange={this.onChangePasswordReplay}
            variant="outlined"
            helperText={(passwordReplay.valid ? '' : 'Passwords not match')}
          />
          <br />
          <br />
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={this.handleRegistration}
            disabled={!(login.valid && password.valid && passwordReplay.valid)}
          >
            Sign up
          </Button>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={10000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={this.state.snackVariant}
            message={this.state.snackMessage}
          />
        </Snackbar>
      </div>
    );
  }
}

export default withRouter(Registration);
