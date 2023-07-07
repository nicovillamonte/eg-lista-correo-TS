import { MailSender } from '../src/domain/mail-sender';
import { ListaCorreo } from '../src/domain/lista-correo';
import { Usuario } from '../src/domain/usuario';
import { Post } from '../src/domain/post';
import { MailObserver } from '../src/observer/post-observer';
import { StubMailSender } from '../src/domain/stub-mail-sender';

describe('TestEnvioAbierto', () => {
  const mailSender: MailSender = new MailSender();
  const mockedSendMailMethod = jest.fn();
  mailSender.sendMail = mockedSendMailMethod;

  const lista: ListaCorreo = new ListaCorreo();
  lista.suscribir(new Usuario('usuario1@usuario.com'));
  lista.suscribir(new Usuario('usuario2@usuario.com'));
  lista.suscribir(new Usuario('usuario3@usuario.com'));
  const mailObserver = new MailObserver();
  // como es un Singleton no puedo cambiar el mail sender
  // mailObserver.setMailSender(mailSender);
  mailObserver.setPrefijo('algo2');
  lista.agregarPostObserver(mailObserver);

  it('un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos  - prueba con mock falla', () => {
    const usuario: Usuario = new Usuario('user@usuario.com');
    const post: Post = new Post(
      usuario,
      'Sale asado?',
      'Lo que dice el asunto',
    );
    lista.recibirPost(post);

    expect(mockedSendMailMethod).toHaveBeenCalledTimes(1);
    expect(mockedSendMailMethod).toHaveBeenCalledWith({
      from: 'user@usuario.com',
      to: 'usuario1@usuario.com, usuario2@usuario.com, usuario3@usuario.com',
      subject: '[algo2] Sale asado?',
      content: 'Lo que dice el asunto',
    });
  });

  //   it("un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos - prueba con stub fijo anda") {
  //     // Como el StubMailSender es una instancia global, nunca se recrea en los tests unitarios
  //     // otra desventaja es que para que este test pase hay que blanquear las referencias
  //     StubMailSender.reset()
  //     //
  //     val usuario = Usuario(mailPrincipal = "user@usuario.com")
  //     val post = Post(emisor = usuario, asunto = "Sale asado?", mensaje = "Lo que dice el asunto")
  //     lista.recibirPost(post)

  //     StubMailSender.mailsEnviados.size shouldBe 1
  //     StubMailSender.envioMail(usuario) shouldBe true
  // }

  it('un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos - prueba con stub fijo anda', () => {
    // Como el StubMailSender es una instancia global, nunca se recrea en los tests unitarios
    // otra desventaja es que para que este test pase hay que blanquear las referencias
    StubMailSender.reset();
    const usuario: Usuario = new Usuario('user@usuario.com');

    const post: Post = new Post(
      usuario,
      'Sale asado?',
      'Lo que dice el asunto',
    );
    lista.recibirPost(post);

    expect(StubMailSender.mailsEnviados.length).toBe(1);
    expect(StubMailSender.envioMail(usuario)).toBe(true);
  });
});
