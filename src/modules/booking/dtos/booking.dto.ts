import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator'
import { PaginationDTO } from '../../../common/dto/pagination.dto'
import { PartialType } from '@nestjs/mapped-types'
import { BookingStatus } from '../enums/booking-status.enum'

export class BookingDto {
  @ApiProperty({
    description: 'Full name of the person making the booking',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string

  @ApiProperty({
    description: 'Email address of the person making the booking',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Phone number of the person making the booking',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string

  @ApiProperty({
    description: 'Message or inquiry from the person making the booking',
    example: 'I would like to book a consultation for web development',
  })
  @IsNotEmpty()
  @IsString()
  message: string

  @ApiPropertyOptional({
    description: 'Additional description or details about the booking',
    example: 'Looking for a modern e-commerce website with payment integration',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'Service ID that the booking is for',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  service?: string

  @ApiPropertyOptional({
    description: 'Preferred date for the service',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  preferredDate?: string

  @ApiPropertyOptional({
    description: 'Additional notes for the booking',
    example: 'Please contact me in the morning',
  })
  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateBookingDto extends PartialType(BookingDto) {
  @ApiPropertyOptional({
    description: 'Status of the booking',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus
}

export class QueryBookingDto extends PaginationDTO {
  @ApiPropertyOptional({
    description: 'Filter by booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus

  @ApiPropertyOptional({
    description: 'Filter by service ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  service?: string
}