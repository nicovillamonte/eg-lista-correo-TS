export class Usuario {
  constructor(
    readonly mailPrincipal: string,
    private readonly mailsAlternativos: string[] = [],
  ) {}

  private mailsEnviados = 0;
  activo = true;

  envioPost() {
    this.mailsEnviados++;
  }

  envioMuchosMensajes = () => this.mailsEnviados > 5;

  bloquear() {
    this.activo = false;
  }
}
