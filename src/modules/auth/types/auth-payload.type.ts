import {UserRole} from "../../users/enums";

export type AuthPayload ={
    sub: string;
    email: string;
    role: UserRole;
}