import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Query} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {UserService} from "./user.service";
import {QueryUserDTO, UpdateUserDto} from "./dtos";

@Controller()
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get(':id')
    @ApiOperation({summary: "Get user by id"})
    async findUserById(@Param('id') id: string) {
        const user = await this.userService.getUserById(id)

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return {
            message: 'Get user by id successfully',
            data: user.toJSON(),
        }
    }

    @Get()
    @ApiOperation({summary: "Find many users"})
    async findMany(@Query() query: QueryUserDTO){
        const users = await this.userService.findManyUsers(query)

        return {
            message: 'Get users successfully',
            data: users.map((user) => user.toJSON()),
        }
    }

    @Delete(':id')
    @ApiOperation({summary: "Delete user"})
    async deleteUser(@Param('id') id: string) {

        return {
            message: 'Delete user',
            data: await this.userService.removeUser(id)
        }
    }

    @Patch(':id')
    @ApiOperation({summary: "Update user"})
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

        return{
            message: 'Update user',
            data: await this.userService.updateUser(id, updateUserDto)
        }
    }
}