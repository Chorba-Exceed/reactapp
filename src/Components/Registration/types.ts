export interface IState {
  login: {valid: boolean, value: string},
  password: {valid: boolean, value: string},
  passwordReplay: {valid: boolean, value: string},
  open: boolean,
  snackMessage: string,
  snackVariant: any,
}
