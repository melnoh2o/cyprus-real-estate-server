import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

export const sentMail = async (req: Request, res: Response) => {
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
    } as any);

    const response = await transporter.sendMail({
      from: `${name}`,
      to: 'melnoh2o@gmail.com',
      subject: `Здравствуйте, от ${name}`,
      text: `Телефон нового подьзователя - ${phone}`,
      html: `<b>Телефон нового подьзователя - ${phone}</b>`,
    });

    res.json({ response });
  } catch (error) {
    console.log(error);
  }
};

export const letterToUs = async (req: Request, res: Response) => {
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
    } as any);

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
