import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export async function AdminGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user.role !== Role.ADMIN && req.user.role !== Role.SUPER_ADMIN) {
    return res.status(401).send('Unauthorized');
  }

  next();
}
