import { Usuario } from './usuario';

export class Post {
  constructor(
    readonly emisor: Usuario,
    readonly asunto: string,
    readonly mensaje: string,
  ) {}

  mailEmisor = () => this.emisor.mailPrincipal;

  enviado() {
    this.emisor.envioPost();
  }

  tienePalabra(palabra: string) {
    return this.mensaje.toUpperCase().includes(palabra.toUpperCase());
  }
}
