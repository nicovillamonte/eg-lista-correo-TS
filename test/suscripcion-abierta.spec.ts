import { BusinessError } from '../src/error/bussiness.error';
import { ListaCorreo } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';

describe('TestSuscripcionAbierta', () => {
  describe('dada una lista de suscripción abierta', () => {
    const lista = new ListaCorreo();
    const usuario = new Usuario('user@usuario.com');

    it('cualquier usuario debe poder suscribirse directamente', () => {
      lista.suscribir(usuario);
      expect(lista.contieneUsuario(usuario)).toBeTruthy();
    });

    it('tratar de confirmar la suscripción de un usuario debe dar error', () => {
      expect(() => {
        lista.confirmarSuscripcion(new Usuario('otroUsuario@usuario.com'));
      }).toThrow(BusinessError);
    });

    it('tratar de rechazar la suscripción de un usuario debe dar error', () => {
      expect(() => {
        lista.rechazarSuscripcion(new Usuario('otroUsuario@usuario.com'));
      }).toThrow(BusinessError);
    });
  });
});
