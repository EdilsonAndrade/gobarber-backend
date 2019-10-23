import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!schema.validate(req.body)) {
      return res.json('Validation failed');
    }

    const { provider_id, date } = req.body;
    const isAProvider = await User.findOne({
      where: { provider: true, id: provider_id },
    });

    if (!isAProvider) {
      return res
        .status(400)
        .json('Appointment can only be created to a provider');
    }

    const appointment = await Appointment.create({
      provider_id,
      date,
      user_id: req.userId,
    });

    return res.json(appointment);
  }
}
export default new AppointmentController();
