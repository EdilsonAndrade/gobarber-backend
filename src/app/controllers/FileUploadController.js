import File from '../models/File';

class FileUploadController {
  async store(req, res) {
    const { originalname: path, filename: name } = req.file;

    const file = await File.create({
      name,
      path,
    });

    if (!file) {
      return res.status(500).json('Error occuried while uploading the file');
    }

    return res.json(file);
  }
}

export default new FileUploadController();
