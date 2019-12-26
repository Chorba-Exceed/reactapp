export interface ICreds {
  login: string,
  password: string,
  passwordReplay?: string
}

export interface IToken {
  token:string
}

export interface ILoginRequestResult {
  success: boolean,
  token: string
}

export interface IRegistration {
  success: boolean
}

export interface IRawResponse<T> {
  status: number,
  json: () => Promise<T>
}

export interface IRawStatusResponse {
  status: number
}

export interface IItem {
  complete:boolean,
  _id:string,
  description:string,
  author:string
}


export interface IItems extends Array<IItem>{}

export interface IItemsGetResult {
  success: boolean,
  items: IItems,
  statusCode?: number
}

export interface IAddItemResult {
  success: boolean,
  item?: IItem
}

export interface IAPIResponse {
  success: boolean,
  statusCode: number,
  description?:string
}
