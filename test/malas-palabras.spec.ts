import { MalasPalabrasObserver } from '../src/observer/post-observer';
import { ListaCorreo } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';
import { Post } from '../src/domain/post';

describe('TestMalasPalabras', () => {
  describe('dada una lista', () => {
    const malasPalabrasObserver = new MalasPalabrasObserver();
    malasPalabrasObserver.agregarMalaPalabra('container');
    malasPalabrasObserver.agregarMalaPalabra('podrido');

    const lista = new ListaCorreo();
    lista.suscribir(new Usuario('usuario1@usuario.com'));
    lista.suscribir(new Usuario('usuario2@usuario.com'));
    lista.agregarPostObserver(malasPalabrasObserver);

    it('al enviar un post con malas palabras se registra en el observer', () => {
      const usuario = new Usuario('user@usuario.com');
      const post = new Post(usuario, 'Es verdad?', 'No me la container!');
      lista.recibirPost(post);
      expect(malasPalabrasObserver.postConMalasPalabras).toContain(post);
    });

    it('al enviar un post que no tiene malas palabras no se registra en el observer', () => {
      const usuario = new Usuario('user@usuario.com');
      const post = new Post(usuario, 'Es verdad?', 'No te la puedo!');
      lista.recibirPost(post);
      expect(malasPalabrasObserver.postConMalasPalabras).not.toContain(post);
    });
  });
});
