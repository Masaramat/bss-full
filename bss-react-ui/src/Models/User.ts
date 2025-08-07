export type UserProfileToken = {
    token: string;
    userDto: UserProfile;
    
}

export type UserProfile = {
    id: number;
    username: string;
    email: string;
    role: string;
    name: string;
    isEnabled?: boolean;
}