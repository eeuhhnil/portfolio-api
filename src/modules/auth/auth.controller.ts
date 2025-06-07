import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto";
import {ApiTags} from "@nestjs/swagger";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    async localRegister(@Body() payload: RegisterDto){
        return{
            message: 'Register user successfully',
            data: await this.authService.localRegister(payload)
        }
    }
}