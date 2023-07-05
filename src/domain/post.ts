import { Usuario } from './usuario';

export interface Post {
  readonly emisor: Usuario;
  readonly asunto: string;
  readonly mensaje: string;
}
