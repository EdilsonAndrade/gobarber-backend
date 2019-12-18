import jwt from 'jsonwebtoken';
import File from '../models/File';
import User from '../models/User';
import auth from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    if (!user) {
      return res.status(401).json('User does not exist');
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json('Password does not match');
    }
    const { id, name, avatar, provider } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
      },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
