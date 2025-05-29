import {Injectable, NotFoundException} from "@nestjs/common";
import {User, UserDocument} from "./schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, PaginateModel} from 'mongoose'
import {QueryUserDTO, UpdateUserDto} from "./dtos";


@Injectable()
export class UserService{
    constructor( @InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>){}

    async getUserById(id: string){
        return this.userModel.findById(id)
    }

    async findManyUsers(query: QueryUserDTO){
        const{fullName, role, gender} = query

        const filter: FilterQuery<User> = {}
        if(fullName) filter.fullName = {$regex:fullName,$options:"i"};
        if(role) filter.role = role
        if(gender) filter.gender =gender
        return this.userModel.find(filter)
    }

    async removeUser(id: string){
        await this.checkExistingUser(id)

        return this.userModel.deleteOne({_id: id})
    }

    async updateUser(id: string, data: UpdateUserDto){
        await this.checkExistingUser(id)

        return this.userModel.updateOne({_id: id}, data)
    }

    async checkExistingUser(id: string){
        const user = this.userModel.exists({_id: id})

        if(!user){
            throw new NotFoundException(`User with id ${id} not found`)
        }

        return user
    }

}
