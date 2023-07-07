import { ListaCorreo } from '../src/domain/lista-correo';
import { BloqueoUsuarioVerbosoObserver } from '../src/observer/post-observer';
import { Usuario } from '../src/domain/usuario';
import { Post } from '../src/domain/post';
import { BusinessError } from '../src/error/bussiness.error';

describe('TestUsuarioVerboso', () => {
  describe('dada una lista', () => {
    const usuarioVerbosoObserver = new BloqueoUsuarioVerbosoObserver();

    const lista = new ListaCorreo();
    lista.suscribir(new Usuario('usuario1@usuario.com'));
    lista.suscribir(new Usuario('usuario2@usuario.com'));
    lista.agregarPostObserver(usuarioVerbosoObserver);

    it('si un usuario envía muchos posts lo bloquea', () => {
      const usuario = new Usuario('user@usuario.com');
      lista.recibirPost(new Post(usuario, 'Es verdad 1?', 'Jajajaja 1!'));
      lista.recibirPost(new Post(usuario, 'Es verdad 2?', 'Jajajaja 2!'));
      lista.recibirPost(new Post(usuario, 'Es verdad 3?', 'Jajajaja 3!'));
      lista.recibirPost(new Post(usuario, 'Es verdad 4?', 'Jajajaja 4!'));
      lista.recibirPost(new Post(usuario, 'Es verdad 5?', 'Jajajaja 5!'));
      expect(usuario.activo).toBeTruthy();

      lista.recibirPost(new Post(usuario, 'Es verdad 6?', 'Jajajaja 6!'));
      expect(usuario.activo).toBeFalsy();

      // si quiere mandar un post nuevo debería dar error
      expect(() => {
        lista.recibirPost(new Post(usuario, 'Es verdad 7?', 'Jajajaja 7!'));
      }).toThrow(BusinessError);
    });
  });
});
