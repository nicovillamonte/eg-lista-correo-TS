import { MailSender } from '../src/domain/mail-sender';
import { ListaCorreo } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';
import { Post } from '../src/domain/post';
import { MailObserver } from '../src/observer/post-observer';

describe('TestEnvioAbierto', () => {
  const mailSender: MailSender = new MailSender();
  const mockedSendMailMethod = jest.fn();
  mailSender.sendMail = mockedSendMailMethod;

  const lista: ListaCorreo = new ListaCorreo();
  lista.suscribir(new Usuario('usuario1@usuario.com'));
  lista.suscribir(new Usuario('usuario2@usuario.com'));
  lista.suscribir(new Usuario('usuario3@usuario.com'));
  lista.agregarPostObserver(new MailObserver(mailSender, 'algo2'));

  it('un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos', () => {
    const usuario: Usuario = new Usuario('user@usuario.com');
    const post: Post = new Post(
      usuario,
      'Sale asado?',
      'Lo que dice el asunto',
    );
    lista.recibirPost(post);

    // Esta verificación es exhaustiva pero también hace que este test se rompa muy fácilmente.
    // Este test es muy social, está testeando:
    // 1. El mail que se genera (con todos los destinatarios en orden).
    // 2. Que no se envía el mail al usuario que envía el post.
    // 3. Que se envía un solo mail.
    //
    // Otra alternativa podría ser crear tests unitarios.
    expect(mockedSendMailMethod).toHaveBeenCalledTimes(1);
    expect(mockedSendMailMethod).toHaveBeenCalledWith({
      from: 'user@usuario.com',
      to: 'usuario1@usuario.com, usuario2@usuario.com, usuario3@usuario.com',
      subject: '[algo2] Sale asado?',
      content: 'Lo que dice el asunto',
    });
  });
});
