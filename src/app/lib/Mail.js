import nodemailer from 'nodemailer';
import mailConfig from '../../config/mail';

class Mail {
  constructor() {
    const { auth, host, port, secure } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null,
      secure,
    });
  }

  sendEmail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
