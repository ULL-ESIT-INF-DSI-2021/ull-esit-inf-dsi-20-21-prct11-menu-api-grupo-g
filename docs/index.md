## 1. Introducción

Implementación de una API, haciendo uso de **Node/Express**, que permite llevar a cabo operaciones de creación, lectura, modificiación y borrado(**Create, Read, Update, Delete - CRUD**) de **ingredientes**, **platos** y **menús**. 

A su vez para esto aplicar una base de datos no relacional utilizando **MongoDB/MongoDB Atlas** así como **Mongoose**, por otro lado, desplegar la API utilizando **Heroku**.


## 2. Objetivos

El objetivo principal de la **práctica 11** es poner en práctica lo aprendido a lo largo del curso así como la implementación de conceptos, técnicas y herramientas nuevas cómo son la utilización de **promesas**, el despliegue de una **API Rest** a través de **Heroku**, la implementación de una base de datos no relacional utilizando **MongoDB/MongoDB Atlas** así como la utilización de **Mongoose** utilizando por otro lado además las operaciones **CRUD**.

Para conseguir esto nuestra API tendrá que poder crear, leer, actualizar o borrar un ingrediente a través de los métodos HTTP necesarios, así como platos y menus siguiendo también las pautas de implementación puestos en la práctica 7.

## 3. Desarrollo

Para desarrollar esta práctica se han implementado dos directorios, el directorio src y el directorio public.

En el directorio **src** contiene a su vez los ficheros ------ y los directorios **db**, **models** y **routers**. En el directorio **db** guardamos los ficheros necesarios para conectarnos al servidor de **MongoDB Atlas**, en el directorio **models** guardamos los esquemas e interfaces de los tipos de datos que vamos a manejar en nuestra base de datos, es decir alimentos, platos y menus, por último en el directorio **routers** implementamos las distintas peticiones **HTTP** que recibirá nuestro servidor que serían de tipo **delete**, **get**, **patch** y **post**.

En el directorio **public** almacenaremos el contenido estático que queremos utilizar para mostrar, como contenido **html** o **imagenes**.

### [Directorio src](../src)

En el directorio src, a parte de estar el resto de subdirectorios, tenemos los ficheros **index.ts** y **functions.ts**. El fichero **index.ts** es nuestro fichero principal. En este fichero se incluye tanto el servidor de express, como la base de datos (que es importada de otro fichero) y todas las operaciones Post, delete, get y patch, que también son importadas de otros ficheros. Al tener todo en este fichero, tenemos la ejecución del servidor de manera centralizada.  

En cuanto al fichero **functions.ts** su objetivo es el de hacer el código mas modular, teniendo allí diversas funciones, que usamos a lo largo del código. Al final solo hemos necesitado poner una función en este fichero, que lo que hace es devolver el elemento mas repetido de un array. 

#### [directorio db](../src/db)

El único fichero presente en el directorio **db** es **Mongoose.ts**. En este fichero simplemente iniciamos la base de datos de mongodb, la cual es importada al resto de ficheros del directorio router, para poder conectarnos a la base de datos desplegada en MongoDB, o en su defecto, a la base de datos de MongoDB de nuestra máquina local. 

#### [directorio models](../src/models)

En el directorio models, guardamos, como mencionamos anteriormente, los esquemas e interfaces de los tipos de datos. En este caso, hemos implementado los modelos **Ingredient**, **Plate** y **Menu**. 

Para la interfaz **Ingredient** hemos definido los siguientes atributos: nombre, grupo, origen, hidratos, proteinas, lipidos, kcal, y precio. En cuanto al esquema, tiene los mismos atributos que la interfaz, siendo obligatorios todos los atributos excepto las kcal, que se calculan automáticamente. 
En nuestros modelos tenemos varios atributos que no son obligatorios, ya que el objeto JSON que enviamos a través de la peticion HTTP, no es necesariamente el objeto que se va a guardar en la base de datos. Por ejemplo, cuando creamos un ingrediente, le tenemos que pasar todos los atributos anteriormente mencionados excepto kcal, ya que, las kcal se calculan de manera automática en base a los hidratos, lípidos, y proteinas. 

Para la interfaz **Plate** hemos definido los atributos: nombre, categoria, ingredientes, hidratos, proteinas, lípidos, kcal, precio, y grupo predominante. 
El caso de plato es igual que para ingrediente, no le enviamos todos los atributos. Son estrictamente necesarios los atributos nombre, categoría, y una lista de ingredientes de los que está compuesto ese plato. La categoría de los platos necesariamente tiene que ser "Entrante", "Primer plato", "Segundo plato" o "Postre".
A partir de estos datos, el propio programa busca los ingredientes en la base de datos, y calcula el resto de atributos a partir de ellos.

Por último, la interfáz **Menu** está compuesta por un nombre, platos, precio, hidratos, lípidos, proteinas, kcal, grupos, e ingredientes. En este caso, para crear un Menu, solo requerimos pasarle un nombre, y la lista de platos, ya que el resto de atributos se calculan buscando los platos en la base de datos y se añaden automáticamente a la base de datos. 

#### [directorio routers](../src/routers)

En este directorio tenemos los ficheros que corresponden a las operaciones CRUD: **Post**, **Get**, **Patch**, **Delete** y **Default**. Cada fichero define las diferentes operaciones para los diferentes esquemas. Esto quiere decir que definimos, por ejemplo 3 POSTs, 1 para cada modelo que tenemos (Ingrediente, Plato, y Menú).

El fichero **post.ts** es el fichero que usamos para gestionar las solicitudes tipo POST que enviamos al servidor. El objetivo de POST es el de crear lo que le pasemos el body de nuestro request en la base de datos, siempre y cuando siga el esquema que tenemos predefinido. Para visualizar mejor el funcionamiento del Post, lo ilustraremos con un ejemplo. Nestra Request Url y el contenido enviado en el body de la petición Post es el siguiente: 

https://grupog-nutritional-app.herokuapp.com/ingredients

```json
{
  "name": "Arroz blanco",
  "group": "Cereales",
  "origin": "Madrid",
  "hydrates": 86,
  "proteins": 7,
  "lipids": 0.9,
  "price": 1.5
}
```
El caso del ingrediente, es el mas simple, ya que cuando recibimos todos estos datos, sólo tenemos que calcular las kilocalorias en base a las proteinas, lípidos,e hidratos, y se la añadimos al objeto. Una vez añadidas, guardamos ese objeto en nuestra base de datos, que quedaría de la siguiente manera:
```json
{
    "_id":"60aa2dc451e0120015b7524f",
    "name":"Arroz blanco",
    "group":"Cereales",
    "origin":"Madrid",
    "hydrates":86,
    "proteins":7,
    "lipids":0.9,
    "price":1.5,
    "kcal":380.1,
    "__v":0
}
```

Para el post de platos, enviamos un objeto con el siguiente formato y con la siguiente Request Url:

https://grupog-nutritional-app.herokuapp.com/courses

```json
{
  "name": "Queso asado",
  "category": "Entrante",
  "ingredients": [
    {
      "name": "Queso de cabra",
      "quantity": 200
    }
  ]
}
```
En el caso de platos, solo le pasamos, el nombre del plato, y los ingredientes que lo componen, y el programa se encargará de buscar en la base de datos los ingredientes proporcionados. Una vez encuentra estos ingredientes, accede a sus propiedades de hidratos. proteinas, etc, y hace los cálculos necesarios para que al final quede un objeto con el siguiente formato:
```json
{
  "_id": "60aa53035e5d040015b02838",
  "name": "Queso asado",
  "category": "Entrante",
  "ingredients": [
    {
      "name": "Queso de cabra",
      "quantity": 200
    }
  ],
  "hydrates": 2,
  "proteins": 26.2,
  "lipids": 31.6,
  "price": 2.99,
  "kcal": 397.20000000000005,
  "predominant": "Quesos",
  "__v": 0
}
```
Por ejemplo, para que este objeto pueda ser guardado en la base de datos, el ingrediente `Queso de cabra` tiene que estar ya introducido en la base de datos de ingredientes, de manera que se puedan hacer los cálculos.

Para el Post de menus, enviamos un objeto con el siguiente formato y la siguiente Request Url:

https://grupog-nutritional-app.herokuapp.com/menus

```json
{
  "name": "Menu 1",
  "plates": [
    {
      "name": "Queso asado"
    },
    {
      "name": "Ensalada"
    },
    {
      "name": "Carne fiesta"
    },
    {
      "name": "Arroz con leche"
    }
  ]
}
```
Para los menus solo le pasamos el nombre del mismo y de que platos se encuentra compuesto, nuestro programa distinguira el número de platos pasados, si es menor de 3 envia una respuesta con estado 400. Si cuenta con 3 o más platos buscara los platos en la base de datos y si los encuentra buscará los ingredientes de cada plato para así de esta manera realizar los calculos necesarios para conseguir la composición nutricional, el precio y cuales son los ingredientes y grupos alimenticios que componen el menú, además de saber que categoría de platos contiene y guardar el menú en la base de datos si contiene 3 o más categorias de platos diferentes. Una vez que este guardado guardariamos el siguiente objeto:

```json
[
  {
    "_id": "60aa5e1db43aaa001558a425",
    "name": "Menu 1",
    "plates": [
      {
        "name": "Queso asado"
      },
      {
        "name": "Ensalada"
      },
      {
        "name": "Carne fiesta"
      },
      {
        "name": "Arroz con leche"
      }
    ],
    "hydrates": 248.265,
    "proteins": 159.44,
    "lipids": 185.8985,
    "price": 17.24,
    "kcal": 3303.9065,
    "ingredients": [
      "Aguacate",
      "Arroz blanco",
      "Leche entera",
      "Zanahoria",
      "Ajo",
      "Queso de cabra",
      "Calabacín",
      "Tomate",
      "Lechuga",
      "Chuleta de ternera",
      "Naranja",
      "Mandarina"
    ],
    "groups": [
      "Frutas",
      "Cereales",
      "Leche",
      "Hortalizas",
      "Verduras",
      "Quesos",
      "Carne"
    ],
    "__v": 0
  }
]
```

En los casos de que no se pueda guardar un ingrediente, un plato o un menu se enviará un respuesta con estado 400, pero si ha resultado de manera exitosa enviará un estado 201, de tal manera de que si ha estado buscando un ingrediente o un plato y no lo encuentra enviará un estado 404 y si ha ocurrido un error interno del sistema será un estado 500.

El fichero **get.ts** es el fichero que usamos para gestionar las solicitudes tipo **GET** que enviamos al servidor. El objetivo de GET es el de buscar y mostrar lo que le pasemos en el Request Url de nuestra petición en caso de que existiera. Podemos realizar una petición GET para buscar todos los ingredientes, todos los platos o todos los menus, así cómo también buscar y mostrar los objetos de estas categorías de manera individual buscando por nombre o ID. por ejemplo si queremos conseguir la información de nuestro ingrediente Arroz blanco enviariamos la siguiente petición de tipo GET

https://grupog-nutritional-app.herokuapp.com/ingredients?name=Arroz blanco

y se nos mostraría la siguiente información

```json
[
  {
    "_id": "60aa2dc451e0120015b7524f",
    "name": "Arroz blanco",
    "group": "Cereales",
    "origin": "Madrid",
    "hydrates": 86,
    "proteins": 7,
    "lipids": 0.9,
    "price": 1.5,
    "kcal": 380.1,
    "__v": 0
  }
]
```

y si se quisiera conseguir por ID se enviaría la siguiente petición:

https://grupog-nutritional-app.herokuapp.com/ingredients/60aa2dc451e0120015b7524f

Así mismo para realizar la busqueda de un plato o un menu sería cambiar la parte que pone ingredients en nuestra Request Url por courses o menus respectivamente y añadir el nombre o ID a buscar y mostrar. En caso de no encontrar el objeto remitira un respuesta de estado 404, pero si lo ha encontrado su respuesta será de tipo 200, así también si ocurre un error interno enviará un estado 500.

El fichero **delete.ts** es el fichero que usamos para gestionar las solicitudes de tipo **DELETE** que eliminaria los ingredientes, platos o menus que hemos solicitado en nuestra Request Url. Primero buscará el objeto y en caso de encontrarlo lo eliminaría de nuestra base de datos y enviaría el objeto que ha conseguido enviar además de un estado 200, en caso de no encontrarlo enviaría un estado 404 y si ocurre un fallo interno será un estado 500. Para cada tipo de objeto se podría eliminar buscando por su nombre o por ID. Si quisieramos eliminar nuestro alimento Arroz blanco podriamos hacerlo de las siguientes maneras.

https://grupog-nutritional-app.herokuapp.com/ingredients?name=Arroz blanco

ó 

https://grupog-nutritional-app.herokuapp.com/ingredients/60aa2dc451e0120015b7524f

El fichero **patch.ts** es el fichero que usamos para gestionar las solicitudes de tipo PATCH. El objetivo de PATCH es el de encontrar el objeto pedido en la Request Url y modificarlo según el body de nuestra request, siempre y cuando cumpla el esquema que tenemos predefinido. Podemos realizar un patch tanto de ingredientes, platos y menus y escoger que atributo queremos modificar, por otro lado podemos escoger los objetos a modificar tanto por su nombre como por su ID.

Si quisieramos modificar un ingrediente podriamos modificar uno o varios de los siguientes atributos: Nombre, grupo, origen, hidratos, proteinas, lipidos o el precio, las kcal al igual que en el post se calcular a partir de los hidratos, proteinas o lipidos. Primero comprobamos si es posible la actualización, y en caso de que se pueda realizar, calculamos los atributos que se tienen que actualizar automaticamente basandonos en el POST de ingredientes, y se actualiza el body de la petición, para luego buscar el ingrediente, y al encontrarlo modificarlo con el contenido del body, en caso de que finalmente no se encuentre el ingrediente se enviará un error 404. Por ejemplo, al enviar la siguiente petición y con el siguiente body:

https://grupog-nutritional-app.herokuapp.com/ingredients?name=Atún

```json
{
  "name": "Coco rallado",
  "group": "Semillas",
  "origin": "Madrid",
  "hydrates": 6.4,
  "proteins": 5.6,
  "lipids": 62,
  "price": 4.08
}
```

Se modificaría de la siguiente manera

```json
{
  "_id": "60aa2fa351e0120015b75257",
  "name": "Coco rallado",
  "group": "Semillas",
  "origin": "Madrid",
  "hydrates": 6.4,
  "proteins": 5.6,
  "lipids": 62,
  "price": 4.08,
  "kcal": 200,
  "__v": 0
}
```

Si quisieramos modificar un plato podriamos modificar uno o varios de los atributos: Nombre, categoria y lista de ingredientes. Los demás atributos se recalculan automáticamente en caso de que los ingredientes de la lista de ingredientes se modifiquen, es decir se volverian a calcular los hidratos, las proteinas, los lipidos, las kcal, el precio y su grupo predominante. Primero comprobamos si es posible la actualización, y en caso de que se pueda realizar, calculamos los atributos que se tienen que actualizar automaticamente si se han cambiado algún ingrediente siguiendo la realización de como se hace en el POST de platos, una vez hecho esto se actualiza el body para luego buscar el plato, una vez que lo encuentre lo modificará con el body del request actualizado, en caso de no encontrar el plato se enviará un error 404. Por ejemplo, al enviar la siguiente petición y con el siguiente body:

https://grupog-nutritional-app.herokuapp.com/courses?name=Escaldón

```json
{
  "name": "Croquetas",
  "category": "Entrante",
  "ingredients": [
    {
      "name": "Pan",
      "quantity": 250
    },
    {
      "name": "Patata",
      "quantity": 800
    },
    {
      "name": "Leche entera",
      "quantity": 0.5
    },
    {
      "name": "Huevo de gallina",
      "quantity": 73
    },
    {
      "name": "Jamón cocido",
      "quantity": 150
    }
  ]
}
```

Se modificaría de la siguiente manera

```json
{
  "_id": "60aa56c2b43aaa001558a403",
  "name": "Croquetas",
  "category": "Entrante",
  "ingredients": [
    {
      "name": "Pan",
      "quantity": 250
    },
    {
      "name": "Patata",
      "quantity": 800
    },
    {
      "name": "Leche entera",
      "quantity": 0.5
    },
    {
      "name": "Huevo de gallina",
      "quantity": 73
    },
    {
      "name": "Jamón cocido",
      "quantity": 150
    }
  ],
  "hydrates": 291.03450000000004,
  "proteins": 76.2405,
  "lipids": 28.411,
  "price": 3.17,
  "kcal": 1724.7990000000002,
  "predominant": "Cereales",
  "__v": 0
}
```

Si quisieramos modificar un menu podriamos modificar uno o varios atributos: Nombre o lista de platos. Los demás atributos se recalculan automáticamente en caso de que los platos de la lista de platos se modifiquen, es decir se volverían a calcular el precio, los hidratos, las proteinas, los lípidos, las kcal, los grupos alimenticios utilizados y los ingredientes utilizados. Primero comprobamos si es posible la actualización, y en caso de que se pueda realizar calculamos los atributos que se tienen que actualizar si se ha cambiado algún plato, siguiendo las pautas de la misma manera realizada en el POST de menus, así cómo las restricciones, es decir, para actualizar los platos mínimo tienen que ser tres platos y de tres categorías diferentes, una vez hecho esto se actualiza el body de la request y se procede a buscar el menu ebn la base de datos, una vez encontrado se modifica, en caso de no encontrarlo se enviará un error 404. Por ejemplo, al enviar la siguiente petición y con el siguiente body:

https://grupog-nutritional-app.herokuapp.com/menus?name=Menu 1

```json
{
  "name": "Menu 1",
  "plates": [
    {
      "name": "Croquetas"
    },
    {
      "name": "Ensalada"
    },
    {
      "name": "Carne fiesta"
    },
    {
      "name": "Arroz con leche"
    }
  ]
}
```

Se modificaría de la siguiente manera

```json
{
  "_id": "60aa5e1db43aaa001558a425",
  "name": "Menu 1",
  "plates": [
    {
      "name": "Croquetas"
    },
    {
      "name": "Ensalada"
    },
    {
      "name": "Carne fiesta"
    },
    {
      "name": "Arroz con leche"
    }
  ],
  "hydrates": 537.2995000000001,
  "proteins": 209.48049999999998,
  "lipids": 182.70950000000002,
  "price": 17.42,
  "kcal": 4631.5055,
  "ingredients": [
    "Patata",
    "Pan",
    "Leche entera",
    "Huevo de gallina",
    "Jamón cocido",
    "Chuleta de ternera",
    "Ajo",
    "Zanahoria",
    "Aguacate",
    "Naranja",
    "Mandarina",
    "Tomate",
    "Calabacín",
    "Lechuga",
    "Arroz blanco"
  ],
  "groups": [
    "Hortalizas",
    "Cereales",
    "Leche",
    "Huevos",
    "Embutidos",
    "Carne",
    "Verduras",
    "Frutas"
  ],
  "__v": 0
}
```

Nuestro fichero **default.ts** es el fichero que usaremos para gestionar todas las peticiones y rutas que nuestro servidor no tienen implementado, en caso de que se active enviará un mensaje con el estado 501 avisando de que no se encuentra implementado.

### [Directorio public](../public)

Tenemos un archivo **index.html**, este archivo html se seleccionara y se mostrará cuando el servidor reciva una petición de tipo GET en el que se acceda a la URL base.

## 4. Utilización de la API

Para utilizar la API desplegada por Heroku, así como para acceder a la base de datos en mongoDB Atlas se pueden realizar las siguientes peticiones **HTTP** y siguiendo los siguientes bodys para los request de las peticiones de tipo **POST** y **PATCH** 

Si queremos acceder a la url base de nuestro servidor utilizariamos la siguiente:

https://grupog-nutritional-app.herokuapp.com

Al acceder a la url se mostraría el contenido que guardamos en el fichero index.html que se encuentra alojado en nuestra carpeta public

Para los tipos **GET** se envía un request cuyo query indique el nombre o ID del ingrediente, plato o menú que deseas obtener. Un ejemplo de uso sería:

https://grupog-nutritional-app.herokuapp.com/ingredients?name=Arroz blanco.

para un plato:

https://grupog-nutritional-app.herokuapp.com/courses?name=Croquetas.

y para un menu:

https://grupog-nutritional-app.herokuapp.com/menus?name=Menu 1.

Para los tipos **DELETE** se envía un request cuyo query indique el nombre o ID del ingrediente, plato o menú que se desea eliminar de la base de datos. La sintaxis sería la misma que para las peticiones tipo **GET**

Para los tipos **POST** se envía un request cuyo body indique que atributos va a tener nuestro objeto

Para hacer un **POST** de un ingrediente, el formato del body sería el siguiente:

```json
{
  "name": "Nombre del ingrediente",
  "group": "Grupo alimenticio",
  "origin": "Ciudad de origen",
  "hydrates": <Cantidad de hidratos>,
  "proteins": <Cantidad de proteinas>,
  "lipids": <Cantidad de lípidos>,
  "price": <Precio en €/kg> 
}
```
Este objeto se tendría que enviar a la dirección
https://grupog-nutritional-app.herokuapp.com/ingredients

```json
{
  "name": "Nombre del plato",
  "category": "Categoria del plato",
  "ingredients": [
    {
      "name": "Ingrediente 1",
      "quantity": <Cantidad en gramos>
    },
    {
      "name": "Ingrediente 2",
      "quantity": <Cantidad en gramos>
    },
    .
    .
    .
  ]
}
```
Se enviaría el objeto anterior a la siguiente dirección:
https://grupog-nutritional-app.herokuapp.com/courses


Por último, para hacer un **POST** de un menú, hay que enviar un objeto con el siguiente formato:
```json
{
  "name": "Nombre del menu",
  "plates": [
    {
      "name": "Nombre del primer plato"
    },
    {
      "name": "Nombre del segundo plato"
    },
    {
      "name": "Nombre del tercer plato"
    }
    .
    .
    .
  ],
}
```
A la dirección
https://grupog-nutritional-app.herokuapp.com/menus

Para los tipos **PATCH** se envía un request cuyo body indique que atributos va a tener nuestro objeto, es decir cuales queremos modificar, este body tiene que tener como máximo los atributos que se exponen en los ejemplos **POST** anteriores, así cómo tambien especificar en el query de nuestra URL Request que ingrediente, plato o menú queremos modificar, ya sea pasandole el nombre o el ID de la misma manera que lo hacemos en los apartado **GET** y **DELETE**.

## 5. Conclusiones

En conclusión, esta práctica nos ha permitido entender y profundizar en los conocimientos para crear nuestra propia API REST desplegada por Heroku, y enlazada junto con una base de datos de mongoDB Atlas. Para poder realizar esto ha sido necesario aprender la utilización de **promesas**, las operaciones **CRUD** y utilizar **Mongoose**.

Se ha aprendido bastante con esta práctica, sobretodo porque nos acerca muchismo a casos de la vida real y se puede complementar con otras asignaturas para así de esta manera crear una **API** que sea usable y saber que cosas tener en cuenta para el **back-end**

## 6. Bibliografía y refencias

[Guión práctica 11](https://ull-esit-inf-dsi-2021.github.io/prct11-menu-api/)
[Página de Mongodb](https://www.mongodb.com/es)
[Página de Mongoose](https://mongoosejs.com/)
[Página de Heroku](https://www.heroku.com/)
[Apuntes de Servidores Web a través de Express](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-express.html)
[Apuntes de Promesas](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-promises.html)
[Apuntes de Operaciones CRUD con MongoDB](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-mongodb.html)
[Apuntes de Modelado de objetos con Mongoose](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-mongoose.html)
[Apuntes de API REST](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-rest-api.html)
[Apuntes de Despliegue del API REST](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-deployment.html)
