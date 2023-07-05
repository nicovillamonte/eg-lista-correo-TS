export class Usuario {
  constructor(
    readonly mailPrincipal: string,
    readonly mailsAlternativos: string[] = [],
  ) {}
}
