# Lista de Correo

Esta es una implementación del ejemplo de Lista de Correo implementado en NestJS con TypeScript.
Solamente es una traducción de lenguaje del [ejemplo de Lista de Correo del docente Fernando Dodino](https://github.com/uqbar-project/eg-lista-correo-kotlin/tree/02-observers-setter) desarrollado en kotlin.

### Branch 03-observers-singleton
En esta rama vas a notar que el build falla, y eso es esperable, porque aquí en el MailObserver no inyectamos la dependencia al mail sender sino que utilizamos un Singleton:

``` typescript
export class MailObserver implements PostObserver {
  private prefijo!: string;

  setPrefijo(prefijo: string) {
    this.prefijo = prefijo;
  }

  postEnviado(post: Post, lista: ListaCorreo) {
    stubMailSender.sendMail({
      from: post.mailEmisor(),
      to: lista.getMailsDestino(post),
      subject: `[${this.prefijo}] ${post.asunto}`,
      content: post.mensaje,
    });
  }
}
```

El objetivo del Singleton es proveer un acceso global a un objeto desde cualquier parte de mi aplicación. Esto es

- cómodo, porque es fácil acceder a la referencia StubMailSender
- pero ahora ya no puedo configurar el mail sender, está hardcoded (fijo)

Si justamente tenemos dos tipos de tests: 1. de comportamiento (mock) y 2. de estado (stub), no podemos cambiarlo dinámicamente y los tests que dependen de los mocks fallan.

# La definición del Singleton
En otros lenguajes como en Kotlin puede existir el concepto `object`, pero en TypeScript no tenemos esa facilidad, por lo que debemos crear una clase que añada lo que necesitemos para luego exportar solamente una instancia de la misma:

``` typescript
class ExtendedMailSender implements MailSender {
  mailsEnviados: Mail[] = [];

  sendMail(mail: Mail): void {
    this.mailsEnviados.push(mail);
  }

  envioMail(usuario: Usuario): boolean {
    return this.mailsEnviados.some(
      (mail) => mail.from === usuario.mailPrincipal,
    );
  }

  reset(): void {
    this.mailsEnviados = [];
  }
}

export const StubMailSender = new ExtendedMailSender();
```

# El efecto en lo global
Aun cuando este test funciona:

``` typescript
it('un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos - prueba con stub fijo anda', () => {
  // Como el stubMailSender es una instancia global, nunca se recrea en los tests unitarios
  // otra desventaja es que para que este test pase hay que blanquear las referencias
  stubMailSender.reset();

  const usuario: Usuario = new Usuario('user@usuario.com');
  const post: Post = new Post(
    usuario,
    'Sale asado?',
    'Lo que dice el asunto',
  );
  lista.recibirPost(post);

  expect(stubMailSender.mailsEnviados.length).toBe(1);
  expect(stubMailSender.envioMail(usuario)).toBe(true);
});
```

la referencia global StubMailSender nunca se limpia. Esto provoca que cuando queremos verificar que solo se envió 1 mail, ese assert fallará si algún otro test anteriormente pudo enviar correctamente mails. Esto es porque nunca se recrea el estado del stub mail sender, es decir nunca limpiamos después de cada test los mails que se enviaron, que quedan en la lista del Stub.

Esto requiere como solución que llamemos a un método reset() en forma manual, para que deje la colección vacía:
``` typescript
reset(): void {
  this.mailsEnviados = [];
}
```

# El Singleton como anti-pattern
En definitiva, utilizar singletons para esta solución introdujo muchos problemas que no teníamos:

- resolví la inyección de dependencias eliminando la posibilidad de configurar las referencias a un objeto
- pero eso me obliga a utilizar una instancia concreta y no poder cambiarla: no puedo tener un mail sender para los tests y otro para el código productivo (tendría que correr los tests y enviar mails o bien que no mande mails cuando la aplicación esté deployada)
- y como la referencia es global, corta la independencia de los tests y hay que solucionarlo manualmente

> Por lo dicho antes, nuestro consejo es que el singleton es una técnica que debe introducirse con mucho cuidado en nuestras soluciones y debemos estar al tanto de las desventajas de su utilización

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm test
```