import {
    CanActivate, ExecutionContext,
    HttpException, HttpStatus
} from "@nestjs/common";

export class AdminGuard implements CanActivate {
    constructor() { }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.typeUser === "ADMIN") {
            return true;
        }

        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    }
}