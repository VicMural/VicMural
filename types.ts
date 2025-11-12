export interface Participant {
  id: number;
  name: string;
  avatarUrl: string;
  statuses: string[];
  message?: string;
  link?: string;
  email?: string;
  password?: string;
  signupDate?: string;
}