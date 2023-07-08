import { MailSender } from './mail-sender';

export class ServiceLocator {
  static mailSender: MailSender = new MailSender();
}
