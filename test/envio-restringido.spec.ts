import { EnvioRestringido, ListaCorreo } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';

describe('TestEnvioRestringido', () => {
  describe('dada una lista de envio restringido', () => {
    const usuarioSuscripto = new Usuario('usuario1@usuario.com');
    const mockedMailSender = {
      sendMail: jest.fn(),
    };
    const lista = new ListaCorreo();
    lista.mailSender = mockedMailSender;
    lista.prefijo = 'algo2';
    lista.validacionEnvio = new EnvioRestringido();
    lista.suscribir(usuarioSuscripto);
    lista.suscribir(new Usuario('usuario2@usuario.com'));
    lista.suscribir(new Usuario('usuario3@usuario.com'));

    it('un usuario no suscripto no puede enviar posts a la lista', () => {
      const usuario = new Usuario('user@usuario.com');
      const post = {
        emisor: usuario,
        asunto: 'Pregunta',
        mensaje:
          'Hola, se que no estoy suscripto, pero quería preguntar cuándo era el asado',
      };
      expect(() => {
        lista.recibirPost(post);
      }).toThrow();
    });

    it('un usuario suscripto puede enviar post a la lista y sale a los demás usuarios de la misma', () => {
      const post = {
        emisor: usuarioSuscripto,
        asunto: 'Sale asado?',
        mensaje: 'Lo que dice el asunto',
      };
      lista.recibirPost(post);
      expect(mockedMailSender.sendMail).toHaveBeenCalledTimes(1);
      expect(mockedMailSender.sendMail).toHaveBeenCalledWith({
        from: 'usuario1@usuario.com',
        to: 'usuario2@usuario.com, usuario3@usuario.com',
        subject: '[algo2] Sale asado?',
        content: 'Lo que dice el asunto',
      });
    });
  });
});
