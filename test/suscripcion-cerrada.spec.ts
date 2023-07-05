import { ListaCorreo, SuscripcionCerrada } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';

describe('TestSuscripcionCerrada', () => {
  describe('dada una lista de suscripción cerrada', () => {
    const lista = new ListaCorreo();
    lista.tipoSuscripcion = new SuscripcionCerrada();
    const usuario = new Usuario('user@usuario.com');

    beforeEach(() => {
      lista.resetear();
    });

    it('el usuario debe quedar pendiente cuando se intenta suscribir', () => {
      lista.suscribir(usuario);
      expect(lista.contieneUsuario(usuario)).toBeFalsy();
    });

    it('el usuario queda suscripto si intenta suscribirse y lo aceptan', () => {
      // el usuario solicita suscribirse
      lista.suscribir(usuario);
      // el administrador confirma la suscripción
      lista.confirmarSuscripcion(usuario);
      expect(lista.contieneUsuario(usuario)).toBeTruthy();
    });

    it('si el usuario solicita suscribirse y lo rechazan no debe quedar suscripto', () => {
      // el usuario solicita suscribirse
      lista.suscribir(usuario);
      // el administrador rechaza la suscripción
      lista.rechazarSuscripcion(usuario);
      expect(lista.contieneUsuario(usuario)).toBeFalsy();
    });
  });
});
