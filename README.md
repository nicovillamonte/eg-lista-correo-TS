# Lista de Correo

Esta es una implementación del ejemplo de Lista de Correo implementado en NestJS con TypeScript.
Solamente es una traducción de lenguaje del [ejemplo de Lista de Correo del docente Fernando Dodino](https://github.com/uqbar-project/eg-lista-correo-kotlin/tree/02-observers-setter) desarrollado en kotlin.

### Branch 02-observers-setter
En esta pequeña variante el MailObserver no define un constructor específico, entonces la referencia al mailSender se inyecta vía setter:

``` typescript
describe('TestEnvioAbierto', () => {
  const mailSender: MailSender = new MailSender();
  const mockedSendMailMethod = jest.fn();
  mailSender.sendMail = mockedSendMailMethod;
  ...
  const mailObserver = new MailObserver();
  mailObserver.setMailSender(mailSender);
  mailObserver.setPrefijo('algo2');
```

La referencia mailSender se puede inicializar en forma lazy mediante el modificador `!`:

``` typescript
export class MailObserver implements PostObserver {
  private mailSender!: MailSender;
  private prefijo!: string;
```

En TypeScript, a diferencia de Kotlin, el programa no va a romper si no le asignamos alguno de estos atributos antes de utilizar la referencia. El problema va a surgir cuando lo intentemos, ya que nos arrojará un error como el siguiente:

```
TypeError: Cannot read properties of undefined (reading '...')
```
Los valores no seteados en Typescript comienzan como `undefined` y no esperaran a ser seteados para ser utilizados, con la particularidad de que no referencian a ningún objeto, lo que los hace inútiles a la hora de querer usarlo como uno de ellos.

## Ejecución
La ejecucion de este proyecto es meramente con propósito educativo. Por lo tanto la ejecución con el comando `npm start` solo comenzaría la ejecución de un programa que no tiene funcionalidad.<br><br>
Por lo tanto, para testear el código se debe ejecutar el siguiente comando:
```
npm test
```