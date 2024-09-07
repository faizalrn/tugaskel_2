import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword } from '@/utils/auth.utils';

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data
    });

    res.status(200).json({ message: 'User data updated successfully!', user });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const data = req.body;
    const payload : any = jwt.verify(token, process.env.JWT_SECRET!)
    const password = data.password

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  

    const user = await prisma.user.update({
      where: { id: Number(payload.id) },
      data: {
        ...data, password: hashedPassword, isVerified: true
      }
    });

    res.status(200).json({ message: 'User data updated successfully!',  });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const password = updateData.password;

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { ...updateData, password: hashedPassword },
    });

    res.status(200).json({ message: 'User data updated successfully!', user });
  } catch (error) {
    console.error('Error updating user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const payload : any = jwt.verify(token, process.env.JWT_SECRET!)
    const {password} = req.body;
    console.log(req.body);
    

    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'User password updated successfully!', user });
  } catch (error) {
    console.error('Error updating user password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params

    const user = await prisma.user.findUnique({
        where:{
            id: Number(id)
        }
    })
    if(!user) {
        res.status(401).json({message: 'User not found.'})
    }

    res.status(200).json({ message: 'Getting user datas successfully!', user });

  } catch (error) {
    console.error('Error getting user data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};