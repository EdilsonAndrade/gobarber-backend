import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail'; // key for the job
  }

  async handle({ data }) {
    const { appointment } = data;
    const appointmentDate = parseISO(appointment.date);
    // abaixo há nacessidade de usar o await para que caso ocorra algum erro no envio do email podemos pegar este erro
    // para tomarmos alguma ação
    await mail.sendEmail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: `Cancelado Agendamento do ${format(
        appointmentDate,
        "'dia' dd 'de' MMMM,  hh:MM'h'",
        {
          locale: pt,
        }
      )}`,
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointmentDate, "'Dia' dd 'de' MMMM,  hh:MM'h'", {
          locale: pt,
        }),
      },
    });
  }
}
export default new CancellationMail();

// adding get key will make available from outside to get the property value lile
// import CancellationMail from '...'
// CancellationMail.key
