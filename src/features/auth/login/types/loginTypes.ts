export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface LoginError {
  message: string;
}
