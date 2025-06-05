import {IsNumber, IsOptional, IsString} from "class-validator";

export class PaginationDTO{
    @IsOptional()
    @IsNumber()
    page?: number;
    
    @IsOptional()
    @IsNumber()
    limit?: number;
    
    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortType?: 'asc' | 'desc';
}