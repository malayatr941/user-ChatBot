interface IUser {
    name: string;
    email: string;
    password:string;
    company:string;
    token?:string;
    createdAt?:Date;
    avatar?:string;
    _id?:string;
}

interface Login {
    email: string;
    password:string;
}

export {IUser,Login};