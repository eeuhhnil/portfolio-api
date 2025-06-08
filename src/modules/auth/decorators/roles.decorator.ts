import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import {SystemRoleGuard} from "../guards/system-role.guard";
import {UserRole} from "../../users/enums";

export const USER_ROLE_KEY = "user_role"
export const UserRoles = (...roles: UserRole[]) => {
    return applyDecorators(
        SetMetadata(USER_ROLE_KEY, roles),
        UseGuards(SystemRoleGuard)
    )
}