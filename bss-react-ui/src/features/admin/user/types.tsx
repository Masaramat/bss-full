
export interface UserDto{
    name: string;
    id?: number;
    email: string;
    username: string;
    role?: string; 
  
}

export interface ChangePasswordRequest{
    userId: number;
    password: string;
    currentPassword: string;
}

