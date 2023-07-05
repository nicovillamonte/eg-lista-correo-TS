export class MailSender {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  sendMail(mail: Mail): void {}
}

export interface Mail {
  readonly from: string;
  readonly to: string;
  readonly subject: string;
  readonly content: string;
}
