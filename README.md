# Lista de Correo

Esta es una implementación del ejemplo de Lista de Correo implementado en NestJS con TypeScript.
Solamente es una traducción de lenguaje del [ejemplo de Lista de Correo del docente Fernando Dodino](https://github.com/uqbar-project/eg-lista-correo-kotlin/tree/01-observers-constructor) desarrollado en kotlin.

### Branch 01-observers-constructor: parte 1
En esta rama definimos varios observers:

- el envío de mails pasa a estar en un observer aparte, al cual le pasamos el mailSender utilizando la técnica constructor injection.

``` typescript
  const usuarioVerbosoObserver = new BloqueoUsuarioVerbosoObserver();

  const lista = new ListaCorreo();
  lista.suscribir(new Usuario('usuario1@usuario.com'));
  lista.suscribir(new Usuario('usuario2@usuario.com'));
  lista.agregarPostObserver(usuarioVerbosoObserver);
```

El MailObserver define un constructor que exige que le pasemos el mailSender:

``` typescript
export class MailObserver implements PostObserver {
  constructor(
    private readonly mailSender: MailSender,
    private readonly prefijo: string,
  ) {}
```

- también se implementan el bloqueo al usuario que envía muchos post (fíjense que se delega al usuario muchas de las preguntas, pero es el observer el que dispara el cambio)
class BloqueoUsuarioVerbosoObserver : PostObserver {

``` typescript
postEnviado(post: Post, lista: ListaCorreo) {
  this.mailSender.sendMail({
    from: post.mailEmisor(),
    to: lista.getMailsDestino(post),
    subject: `[${this.prefijo}] ${post.asunto}`,
    content: post.mensaje,
  });
}
```

- y por último el registro de post con "malas palabras" que se puede configurar

``` typescript
export class MalasPalabrasObserver implements PostObserver {
  private readonly malasPalabras: string[] = [];
  readonly postConMalasPalabras: Post[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postEnviado(post: Post, lista: ListaCorreo) {
    if (this.tieneMalasPalabras(post)) {
      this.postConMalasPalabras.push(post);
    }
  }

  tieneMalasPalabras(post: Post) {
    return this.malasPalabras.some((palabra) => post.tienePalabra(palabra));
  }
```

# Notificación a los observers
La lista de correo notifica a los interesados en el evento "post recibido":

``` typescript
recibirPost(post: Post) {
  if (!post.emisor.activo)
    throw new BusinessError(
      'El usuario está inhabilitado para enviar posts.',
    );
  this.validacionEnvio.validarPost(post, this);

  post.enviado();
  this.postObservers.forEach((observer) => observer.postEnviado(post, this));
}
```

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm test
```