import File from '../models/File';
import User from '../models/User';

class FileUploadController {
  async store(req, res) {
    const { userId } = req;
    const { originalname: name, filename: path } = req.file;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const file = await File.create({
      name,
      path,
    });

    if (!file) {
      return res.status(500).json('Error occuried while uploading the file');
    }
    await user.update({
      avatar_id: file.id,
    });

    return res.json(file);
  }
}

export default new FileUploadController();
