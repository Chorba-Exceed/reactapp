export interface IState {
  login: {valid: boolean, value: string},
  password: {valid: boolean, value: string},
  passwordReplay: {valid: boolean, value: string},
  openSnackBar: boolean,
  snackMessage: string,
  snackVariant: any,
}
