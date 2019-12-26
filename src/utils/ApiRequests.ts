import {
  ICreds,
  IRawResponse,
  IRegistration,
  IToken,
  IItems,
  IAPIResponse,
  IRawStatusResponse,
  IItemsGetResult, ILoginRequestResult, IAddItemResult, IItem,
} from './types';

export default class ApiRequests {
  private readonly baseUrl = process.env.REACT_APP_BASE_URL;


  public async authenticateRequest(creds: ICreds): Promise<ILoginRequestResult> {
    const requestUrl = `${this.baseUrl}/login`;
    const rawData: IRawResponse<IToken> = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(creds),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (rawData.status === 200) {
      const response = await rawData.json();
      return { success: true, token: response.token };
    }
    return { success: false, token: '' };
  }

  public async registrationRequest(creds: ICreds): Promise<IRegistration> {
    const requestUrl = `${this.baseUrl}/register`;
    const rawData: IRawResponse<IRegistration> = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(creds),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (rawData.status === 200) {
      return { success: true };
    }
    return { success: false };
  }

  public async getToDoItems(): Promise<IItemsGetResult> {
    const requestUrl = `${this.baseUrl}/api/items`;
    const token = `bearer ${localStorage.getItem('token')}`;
    const rawData: IRawResponse<IItems> = await fetch(requestUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (rawData.status === 200) {
      const items = await rawData.json();
      return { success: true, items };
    }
    return { success: false, items: [], statusCode: rawData.status };
  }

  public async AddItem(description:string): Promise<IAddItemResult> {
    const requestUrl = `${this.baseUrl}/api/item/`;
    const reqBody = {
      description,
    };
    const token = `bearer ${localStorage.getItem('token')}`;
    const rawData: IRawResponse<IItem> = await fetch(requestUrl, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (rawData.status === 200) {
      const item = await rawData.json();
      return { success: true, item };
    }
    return { success: false };
  }

  public async UpdateItemByID(id: string, complete:boolean): Promise<IAPIResponse> {
    const requestUrl = `${this.baseUrl}/api/item/${id}`;
    const reqBody = {
      complete,
    };
    const token = `bearer ${localStorage.getItem('token')}`;
    const response: IRawStatusResponse = await fetch(requestUrl, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.status === 200) {
      return { success: true, statusCode: response.status };
    }
    return { success: false, statusCode: response.status };
  }

  public async UpdateDescriptionItemByID(id: string, description:string): Promise<IAPIResponse> {
    const requestUrl = `${this.baseUrl}/api/item/${id}`;
    const reqBody = {
      description,
    };
    const token = `bearer ${localStorage.getItem('token')}`;
    const response: IRawStatusResponse = await fetch(requestUrl, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.status === 200) {
      return { success: true, statusCode: response.status, description };
    }
    return { success: false, statusCode: response.status };
  }

  public async DeleteItemByID(id: string): Promise<IAPIResponse> {
    const requestUrl = `${this.baseUrl}/api/item/${id}`;
    const token = `bearer ${localStorage.getItem('token')}`;
    const response: IRawStatusResponse = await fetch(requestUrl, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.status === 200) {
      return { success: true, statusCode: response.status };
    }
    return { success: false, statusCode: response.status };
  }

  public async DeleteCompletedItems(): Promise<IAPIResponse> {
    const requestUrl = `${this.baseUrl}/api/items/deleteCompleted`;
    const token = `bearer ${localStorage.getItem('token')}`;
    const response: IRawStatusResponse = await fetch(requestUrl, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (response.status === 200) {
      return { success: true, statusCode: response.status };
    }
    return { success: false, statusCode: response.status };
  }
}
