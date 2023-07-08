# Lista de Correo

Esta es una implementación del ejemplo de Lista de Correo implementado en NestJS con TypeScript.
Solamente es una traducción de lenguaje del [ejemplo de Lista de Correo del docente Fernando Dodino](https://github.com/uqbar-project/eg-lista-correo-kotlin/tree/02-observers-setter) desarrollado en kotlin.

### Branch 04-observers-service-locator
En la versión que utilizaba singletons vimos que el build fallaba porque no teníamos forma de configurarle la referencia al mailSender. Una variante es implementar un [Service locator](https://www.geeksforgeeks.org/service-locator-pattern/), que consiste en tener un Singleton:

``` typescript
export class ServiceLocator {
  static mailSender: MailSender = new MailSender();
}
```

Luego el MailObserver, en lugar de tener una referencia propia, va a usar la del service locator (así el mail sender queda "tercerizado")

``` typescript
export class MailObserver implements PostObserver {
  private prefijo!: string;

  ...

  postEnviado(post: Post, lista: ListaCorreo) {
    ServiceLocator.mailSender.sendMail({
      from: ...
    });
  }
}
```

Es el test de expectativa (mock) debemos encargarnos previamente de asignar la referencia del service locator (o tendremos un error en runtime). Esta indirección es difícil de ver:

``` typescript
describe('TestEnvioAbierto', () => {
  const mailSender: MailSender = new MailSender();
  ...
  const mailObserver = new MailObserver();
  // cambio la referencia (indirecta) en el service locator
  ServiceLocator.mailSender = mailSender;
  mailObserver.setPrefijo('algo2');
  lista.agregarPostObserver(mailObserver);
```

En cuanto al test de estado, como el stub es un singleton debemos enviar un mensaje reset() para evitar que el efecto colateral corte la independencia de nuestro test unitario:

``` typescript
it('un usuario no suscripto puede enviar posts a la lista y le llegan solo a los suscriptos - prueba con stub fijo anda', () => {
    // cambio la referencia (indirecta) en el service locator y la reseteo para evitar efectos colaterales de otros tests
    ServiceLocator.mailSender = stubMailSender;
    stubMailSender.reset();
```

# Resumen
Muchas personas que desarrollan consideran al service locator como un [anti-pattern](https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/), señalando como desventajas

- que el objeto service locator es poco cohesivo (no tiene un objetivo definido y es en realidad un agrupador de servicios sin mucho criterio)
- tiene una indirección difícil de seguir (no es claro de ver que el test o la aplicación deben asignar el valor y los diferentes objetos de dominio accederlo)
- permite que la referencia sea modificada globalmente en cualquier momento, con lo que podemos tener efectos indeseados

Por otra parte, podemos conceder que tiene ventajas

- permite resolver la inyección de dependencias de manera simple, sobre todo cuando varios objetos tienen que compartir el mismo servicio
- es simple de implementar

![Service Locator Pattern](https://github.com/uqbar-project/eg-lista-correo-kotlin/raw/04-observers-service-locator/images/serviceLocator.jpg)