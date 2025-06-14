import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserRole } from '../../users/enums'
import { JwtAuthGuard, SystemRoleGuard } from '../guards'

export const USER_ROLE_KEY = 'user_role'
export const UserRoles = (...roles: UserRole[]) => {
  return applyDecorators(
    SetMetadata(USER_ROLE_KEY, roles),
    UseGuards(JwtAuthGuard, SystemRoleGuard),
  )
}
