import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/NotificationSchema';

class AppointmentController {
  async index(req, res) {
    const { page, limit } = req.query;
    const appointments = await Appointment.findAll({
      where: {
        canceled_at: null,
        user_id: req.userId,
      },
      limit,
      offset: (page - 1) * limit,
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

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

    const appointmentDate = startOfHour(parseISO(date));

    if (isBefore(appointmentDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'The appointment cant be before the actual date' });
    }

    const existAppointment = await Appointment.findOne({
      where: {
        date: appointmentDate,
        provider_id,
        canceled_at: null,
      },
    });

    if (existAppointment) {
      return res.status(400).json('Provider is not availabe at this time');
    }

    const appointment = await Appointment.create({
      provider_id,
      date: appointmentDate,
      user_id: req.userId,
    });

    const user = await User.findByPk(req.userId);
    const formatDate = format(
      appointmentDate,
      "'dia' dd 'de' MMMM,  hh:MM'h'",
      {
        locale: pt,
      }
    );

    const content = `Agendamento de ${user.name} realizado para ${formatDate} `;
    await Notification.create({
      user: req.userId,
      content,
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
