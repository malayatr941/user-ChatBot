interface IUser {
  name: string;
  email: string;
  password: string;
  company: string;
  token?: string;
  createdAt?: Date;
  avatar?: string;
  _id?: string;
}
interface IUser {
  name: string;
  email: string;
  password: string;
  company: string;
  token?: string;
  createdAt?: Date;
  avatar?: string;
  _id?: string;
}

interface Login {
  email: string;
  password: string;
}

interface ForgetPassword {
  email: string;
}
interface NewPassword {
  token: string;
  password: string;
}

interface EditProfile {
  name?: string;
  email?: string;
  password: string;
  company?: string;
  avatar?: string;
}

export { IUser, Login, ForgetPassword, NewPassword, EditProfile };
