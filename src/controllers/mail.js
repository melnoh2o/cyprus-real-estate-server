import nodemailer from 'nodemailer';

export const sentMail = async (req, res) => {
  try {
    const { name, phone } = req.body;
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      logger: true,
    });

    const response = await transporter.sendMail({
      from: `${name}`,
      to: 'imperialkktc@gmail.com',
      subject: `Здравствуйте, от ${name}`,
      text: `Телефон нового подьзователя - ${phone}`,
      html: `<b>Телефон нового подьзователя - ${phone}</b>`,
    });

    res.json({ response });
  } catch (error) {
    console.log(error);
  }
};

export const letterToUs = async (req, res) => {
  try {
    const { mail, name, theme, description } = req.body;
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      logger: true,
    });

    const response = await transporter.sendMail({
      from: `${name}`,
      to: 'imperialkktc@gmail.com',
      subject: `Здравствуйте, от ${name}`,
      text: `Новая почта - ${mail}`,
      html: `
          <h3>Новое письмо</h3>
          <h4>Тема ${theme}:</h4>
          <p>Описание: ${description}</p>
          <p>Почто нового подьзователя - ${mail}</p>
      `,
    });

    res.json({ response });
  } catch (error) {
    console.log(error);
  }
};
