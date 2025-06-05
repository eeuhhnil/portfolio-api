import {Injectable, NotFoundException} from "@nestjs/common";
import {User, UserDocument} from "./schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, PaginateModel} from 'mongoose'
import {QueryUserDTO} from "./dtos";
import {PaginationDTO} from "../../common/dto/pagination.dto";


@Injectable()
export class UserService{
    constructor( @InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>){}

    async getUserById(id: string){
        return this.userModel.findById(id)
    }

    async findManyUsers(query: QueryUserDTO, pagination: PaginationDTO){
        const{fullName, role, gender} = query

        const filter: FilterQuery<User> = {}
        if(fullName) filter.fullName = {$regex:fullName,$options:"i"};
        if(role) filter.role = role
        if(gender) filter.gender =gender

        const{page = 1, limit = 10 , sortBy = 'createdAt', sortType = 'asc'} = pagination

        const option ={
            page,
            limit,
            sort : {[sortBy]: sortType === 'asc' ? 1: -1},
        }
        return this.userModel.find(filter, option)
    }

    async removeUser(id: string){

        return this.userModel.deleteOne({_id: id})
    }

    async updateUser(id: string, data: Partial<Omit<User,'_id'>>){
        await this.checkExistingUser(id)

        return this.userModel.findOneAndUpdate({_id: id}, data, {new: true})
    }

    async checkExistingUser(id: string){
        const user = this.userModel.exists({_id: id})

        if(!user){
            throw new NotFoundException(`User with id ${id} not found`)
        }

        return user
    }

}
