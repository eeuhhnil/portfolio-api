import {ConflictException, Injectable} from "@nestjs/common";
import {UserService} from "../users/user.service";
import {RegisterDto} from "./dto";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {
    }
    async localRegister(payload: RegisterDto){
        const existingEmail = await this.userService.checkExistingEmail(payload.email);

        if(existingEmail){
            throw new ConflictException('Email already exist');
        }

        const{password, ...subPayload} = payload;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.userService.create({
            hashedPassword,
            ...subPayload,
        })

        return newUser.toJSON()
    }
}