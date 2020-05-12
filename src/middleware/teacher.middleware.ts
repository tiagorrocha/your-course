import {
    Injectable, NestMiddleware,
    HttpException, HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class TeacherMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        const user = req.body;
        if (user.typeUser !== "TEACHER") {
            throw new HttpException("Forbidden to create this type of user",
                HttpStatus.FORBIDDEN);
        }
        next();
    }
}