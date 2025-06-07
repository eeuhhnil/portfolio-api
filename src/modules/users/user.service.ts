import {Injectable, NotFoundException} from "@nestjs/common";
import {User, UserDocument} from "./schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, PaginateModel, PaginateOptions} from 'mongoose'
import {QueryUserDTO} from "./dtos";

@Injectable()
export class UserService{
    constructor( @InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>){}

    async getUserById(id: string){
        return this.userModel.findById(id)
    }

    async findManyUsers(query: QueryUserDTO){
        const filter: FilterQuery<User> = {}
        if(query.role) filter.role = { $in: query.role }
        if(query.gender) filter.gender = query.gender
        if(query.search){
            filter.$or = [{fullName: {$regex: query.search, $options: 'i'}}]
        }

        const option: PaginateOptions ={
            page: query.page,
            limit: query.limit,
            sort :  query.getSortObject()
        }
        return this.userModel.paginate(filter, option)
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
