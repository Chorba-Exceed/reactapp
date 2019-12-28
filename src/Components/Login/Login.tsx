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

class Login extends React.Component<RouteComponentProps, IState> {
  private readonly api = new ApiRequests();

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      login: '',
      password: '',
      openSnackBar: false,
      snackMessage: '',
      snackVariant: 'success',
    };
    this.onChangeLogin = this.onChangeLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChangeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ login: event.target.value });
  }

  onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  async handleLogin(event: React.MouseEvent<HTMLElement>) {
    const { login, password } = this.state;
    const { history } = this.props;
    event.preventDefault();
    const data = {
      login,
      password,
    };
    if (login && password) {
      const response = await this.api.authenticateRequest(data);
      if (response.success) {
        localStorage.setItem('token', response.token);
        history.push('/ToDoList');
      } else {
        this.setState({
          snackVariant: 'error',
          snackMessage: 'Invalid login and password',
          openSnackBar: true,
        });
      }
    } else {
      this.setState({
        snackVariant: 'error',
        snackMessage: 'Enter your login and password',
        openSnackBar: true,
      });
    }
  }

  handleRegistration() {
    const { history } = this.props;
    history.push('/registration');
  }

  handleClose(event?: SyntheticEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackBar: false });
  }

  render(): React.ReactNode {
    const { login, password } = this.state;
    return (
      <div>
        <h1>ToDoList</h1>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={this.handleLogin}
            >
            Sign in
            </Button>
          &#160;
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleRegistration}
            >
            Sign up
            </Button>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.openSnackBar}
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

export default withRouter(Login);
