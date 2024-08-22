import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

class UserController {
    static register = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const userRepository = getRepository(User);

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = userRepository.create({ username, email, password: hashedPassword });
            await userRepository.save(newUser);
            res.status(201).send(newUser);
        } catch (error) {
            res.status(500).send({ message: 'Error registering new user', error });
        }
    };

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        }

        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(400).send('User not found');
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).send('Invalid password');
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            res.status(200).send({ user, token });
        } catch (error) {
            res.status(500).send({ message: 'Error logging in user', error });
        }
    };
}

export default UserController;
