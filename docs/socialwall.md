# Social Wall

Componente con la función de cubrir un modelo de animación de eventos, armando un formato de presentación
para mostrar contenido de redes sociales asociados directamente al evento en curso.

El anfitrión configura el evento añadiendo una cantidad de Hashtags para Twitter y Instagram, con los que identificar el contenido
relacionado al evento en estas redes sociales.

## Componente Social Wall (Back-Office)

Es el componente principal del consumo del servicio del Social Wall, este consulta los Hashtags registrados para el evento
seleccionado por el anfitrión. De existir estos registros, procedera a ejecutar la dependencia adquirida PHP-Social Stream para
consultar todas las publicaciones (Twitter e Instagram) indexadas con esos Hashtags.

    /resources/js/components/Pages/SocialWall.js

### Consulta de Hashtags

El anfitrion mediante dos campos de opciones, establece el valor de una empresa para posteriormente seleccionar el valor de 
cualquiera de los eventos activos que patrocine esa empresa.

El idenficador de ese evento sera transmitido al endpoint que consultara la existencia de Hashtags registrados.

    GET /api/eventos/redes-sociales/consultar
    - eventoId

### Consultar publicaciones

Una vez confirmada la existencia de Hashtags para el evento, se procede a consultar las publicaciones registradas en las
redes sociales mediante la libreria PHP Social Stream.

Esta se ubica en el directorio public/Lib del proyecto.

Mediante un elemento iFrame, se hace una llamada al archivo index.php que se ubica en el directorio antes mencionado, que se ocupa de recibir los Hashtags como parámetros de ruta y algunas configuraciones con las que el usuario puede personalizar el retorno de las publicaciones.

La función de este archivo es llamar a la función pública principal de la libreria, pasandole un arreglo con los parámetros enviados desde el componente React del Social Wall, y retornar al iFrame el resultado de la libreria dentro del componente.

    https://dominio/Lib/?hashtagsTwitter='['paris']'&hashtagsInstagram='['paris', 'francia']'&eventoId=4063968392

### Moderar contenido

En la configuración del evento, el anfitrión tiene la posibilidad de acceder a una pestaña donde puede personalizar el retorno de las publicaciones, según los parámetros que la libreria PHP Social Stream permite (Vease configuración Social Wall para mas detalles).

Una de las opciones disponibles es la activación del servicio de moderación de contenido posiblemente ofensivo que puede presentarse en las publicaciones a traves del Cognitive Service Content Moderator de Microsoft Azure.

Si el anfitrión activo previamente el servicio, al cargar el iframe con las publicaciones se ejecutaran una seria de funciones que filtraran el contenido ofensivo antes de hacer visible el resultado del iFrame.

### Flujo de moderación de contenido

1. Al cargar el iFrame con las publicaciones se procede a almacenar su contenido en un arreglo de objetos con el siguiente formato.

    {
        id: valor del atributo id único del elemento HTML de la publicación (en formato númerico).
        tipo: valor del atributo class que representa a que Red Social pertenece la publicación (Twitter, Facebook, RSS).
        imagen: valor del atributo src del elemento <img> que contiene la imagen de la publicación (No siempre presente).
        texto: valor del estado que el participante del evento esta expresando en la publicación.
    }

2. Se almacena el arreglo en el estado del componente (State de Redux)

3. Se procede a crear un intervalo de ejecución de 1 seg.       (setInterval( , 1000))
Que toma cinco publicaciones del arreglo y las envía al API de Azure para la moderación.

Esto se debe a que el servicio de Microsoft por temas de rendimiento en sus servidores, límita a sus clientes a realizar no mas de 10 peticiones por segundo.

Cada publicación requiere una petición para moderar su contenido de texto y otra para su imagen. Tomando 5 publicaciones cada segundo, resultan las 10 peticiones permitidas en ese intervalo.

Cuando se finalice la iteración del arreglo, se retira la ejecución del intervalo y se procede al siguiente paso.

Cada resultado de la petición de Azure para las publicaciones, verifica la evaluación y etiqueta a las que contienen contenido ofensivo para hacerlas ocultas al iframe.

4. Por último, se simula un evento de click sobre el filtro de "Ver todos" los tipos de publicación, desencadenando que desaparezcan todas las publicaciones que se etiquetaron como ofensivas.

5. Se retira el elemento de carga y se revela el iframe con las publicaciones resultantes al usuario.

## Componente de Configuración de Redes Sociales

Este componente permite al anfitrión registrar los hashtags que activaran el servicio de Social Wall para el evento.

    /resources/js/components/Pages/configuracion/Eventos/RedesSociales.js

### Consultar Hashtags registrados

Se consultan los Hashtags registrados (de existir un registro previo para el evento).

Vease "Consulta de Hashtags" en la documentación del componente Social Wall.

El resultado de esa consulta (Un arreglo con los Hashtags), se convierte en una cadena (join()) y se inserta en los campos de texto correspondiente a la red social.

### Registro y/o actualización de Hashtags

El evento (onClick) sobre el botón "Guardar", desencadena el flujo de actualización y/o registro de Hashtags que se describe a continuación:

1. Se verifica si ambos campos estan vacios. Se tienen que registrar Hashtags para al menos una Red Social (Twitter o Instagram).

2. Se extraen los hashtags de los campos separados por comas (,) y se almacenan en arreglos en el estado del componente (State Redux).

3. Se realiza una instancia al objeto FormData(), donde se almacenan los siguientes parámetros para el cuerpo de la petición.
    {
        eventoId: identificador del evento,
        HashtagsTwitter: cadena compatible con JSON, con los Hashtags de Twitter ingresados por el usuario,
        HashtagsInstagram: cadena compatible con JSON, con los Hashtags de Instagram ingresados por el usuario
    }

4. Se enviá la petición POST con los Hashtags relacionados al evento.
    api/eventos/redes-sociales/actualizar

## Publicar contenido del evento en las Redes

Para que el flujo completo se cumpla, se debe garantizar que el usuario publique contenido en las redes con los hashtags del evento.

La aplicación móvil de OneShow permite difunder la experiencia del participante en otras plataformas sociales (Twitter e Instagram) desde su interfaz.

La caracteristica principal esta en que la redirección a las otras plataformas, esta acompañada de los Hashtags del evento. De esta forma el usuario no requiere colocar los Hashtags manualmente en cada publicación.

El Social Wall del anfitrión no tendrá problemas en ubicar el contenido difundido por los participantes del evento, si publican desde la APP de OneShow.

## Componente de Redes Sociales (APP Móvil)

Componente que consulta los hashtags del evento (Vease la secciones anteriores). Y de existir hashtags registrados en el evento para cualquiera de las plataformas sociales permitidas.

El componente añadira al menú de la aplicación las opciones correspondientes para compartir en las redes sociales que contengan hashtags registrados por el anfitrión.

### Compartir en Twitter

El evento (onClick) sobre la opción de Twitter en el menú lanza la siguiente linea:
    window.location.href = "https://twitter.com/intent/tweet?hashtags=" + this.obtenerHashtags("Twitter");

- Si el usuario tiene la aplicación de Twitter instalada en el dispositivo, sera redirigido a esta en la vista de publicar Tweet, con los hashtags correspondientes al evento, ingresados en el cuadro de texto.

- Si el usuario no posee la aplicación instalada, sera redirigido al navegador por defecto con la vista de publicación de Tweet de la aplicación web de Twitter y los hashtags pre-ingresados.

### Compartir en Instagram

El evento (onClick) sobre la opción de Instagram en el menú lanza el plugin de Cordova (@cordova-plugin-camera), que redirige por medio de una intención de Android, a la aplicación nativa de la Cámara del dispositivo, con las siguientes opciones:
    {
        quality: 50, -> Calidad de la imagen en un rango de 0-100 (50 por defecto)
        destinationType: Camera.DestinationType.DATA_URL, -> Imagen retornada en codificación Base64
        sourceType: 1, -> Foto capturada o almacenada en la galeria
        encodingType: 1 -> Formato de codificación de la imagen. (JPEG -> 0, PNG -> 1)
    }

La cadena codificada (base64) que representa la imagen se pasa como parámetro al plugin de Instagram de Cordova (@cordova-instagram-plugin), que muestra al usuario la opción de publicación en Instagram en sus tres formatos de publicación (Feed, History, Direct message)