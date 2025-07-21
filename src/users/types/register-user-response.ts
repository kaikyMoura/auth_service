export type RegisterUserResponse = {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
  };
};
