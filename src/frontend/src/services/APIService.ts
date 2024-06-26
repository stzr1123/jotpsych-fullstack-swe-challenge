class APIService {
  private static instance: APIService;
  private baseUrl: string;
  private appVersion: string;

  private constructor() {
    this.baseUrl = "http://localhost:3002";
    this.appVersion = "1.0.0"; // Initial version below 1.2.0
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public async request(
    endpoint: string,
    method: string,
    body?: any,
    auth: boolean = false
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "app-version": this.appVersion,
    };

    if (auth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      if (response.status === 426) {
        const data = await response.json();
        throw new Error(data.message); // Throw error with message for update prompt
      }
      throw new Error("Network response was not ok");
    }

    return response.json();
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public clearToken(): void {
    localStorage.removeItem('token');
  }

  public setAppVersion(version: string): void {
    this.appVersion = version;
  }
}

export default APIService.getInstance();