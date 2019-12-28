export interface IState {
  login: string,
  password: string,
  openSnackBar: boolean,
  snackMessage: string,
  snackVariant: 'success' | 'warning' | 'info' | 'error',
}
