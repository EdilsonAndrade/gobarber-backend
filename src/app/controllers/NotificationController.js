import Notification from '../schemas/NotificationSchema';

class NotificationController {
  async index(req, res) {
    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' });

    return res.json(notifications);
  }

  async update(req, res) {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        read: true,
      },
      {
        new: true,
      }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
