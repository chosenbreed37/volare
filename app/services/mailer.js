import 'dotenv/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

export const send = (to, subject, text, html) => {
  const messageData = {
    from: 'Volare <info@volare.com>',
    to,
    subject,
    text,
    html
  };
  return client.messages.create(DOMAIN, messageData);
}