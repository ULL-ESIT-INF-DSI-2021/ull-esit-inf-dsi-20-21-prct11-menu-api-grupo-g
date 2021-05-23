## 1. Introducción

Implementación de una API, haciendo uso de **Node/Express**, que permite llevar a cabo operaciones de creación, lectura, modificiación y borrado(**Create, Read, Update, Delete - CRUD**) de **ingredientes**, **platos** y **menús**. 

A su vez para esto aplicar una base de datos no relacional utilizando **MongoDB/MongoDB Atlas** así como **Mongoose**, por otro lado, desplegar la API utilizando **Heroku**.


## 2. Objetivos

El objetivo principal de la **práctica 11** es poner en práctica lo aprendido a lo largo del curso así como la implementación de conceptos, técnicas y herramientas nuevas cómo son la utilización de promesas, el despliegue de una **API Rest** a través de **Heroku**, la implementación de una base de datos no relacional utilizando **MongoDB/MongoDB Atlas** así como la utilización de **Mongoose** utilizando por otro lado además las operaciones **CRUD**.

Para conseguir esto nuestra API tendrá que poder crear, leer, actualizar o borrar un ingrediente a través de los métodos HTTP necesarios, así como platos y menus siguiendo también las pautas de implementación puestos en la práctica 7.

## 3. Desarrollo

Para desarrollar esta práctica se han implementado dos directorios, el directorio src y el directorio public.

En el directorio **src** contiene a su vez los ficheros ------ y los directorios **db**, **models** y **routers**. En el directorio **db** guardamos los ficheros necesarios para conectarnos al servidor de **MongoDB Atlas**, en el directorio **models** guardamos los esquemas e interfaces de los tipos de datos que vamos a manejar en nuestra base de datos, es decir alimentos, platos y menus, por último en el directorio **routers** implementamos las distintas peticiones **HTTP** que recibirá nuestro servidor que serían de tipo **delete**, **get**, **patch** y **post**.

En el directorio **public** almacenaremos el contenido estático que queremos utilizar para mostrar, como contenido **html** o **imagenes**.

### [Directorio src](../src)

#### [directorio db](../src/db)

El único fichero presente en el directorio **db** es **Mongoose.ts**. En este fichero simplemente iniciamos la base de datos de mongodb, la cual es importada al resto de ficheros del directorio router, para poder conectarnos a la base de datos desplegada en MongoDB, o en su defecto, a la base de datos de MongoDB de nuestra máquina local. 

#### [directorio models](../src/models)

En el directorio models, guardamos, como mencionamos anteriormente, los esquemas e interfaces de los tipos de datos. En este caso, hemos implementado los modelos **Ingredient**, **Plate** y **Menu**. 

Para la interfaz **Ingredient** hemos definido los siguientes atributos: nombre, grupo, origen, hidratos, proteinas, lipidos, kcal, y precio. En cuanto al esquema, tiene los mismos atributos que la interfaz, siendo obligatorios todos los atributos excepto las kcal, que se calculan automáticamente. 
En nuestros modelos tenemos varios atributos que no son obligatorios, ya que el objeto JSON que enviamos a través de la peticion HTTP, no es necesariamente el objeto que se va a guardar en la base de datos. Por ejemplo, cuando creamos un ingrediente, le tenemos que pasar todos los atributos anteriormente mencionados excepto kcal, ya que, las kcal se calculan de manera automática en base a los hidratos, lípidos, y proteinas. 

Para la interfaz **Plate** hemos definido los atributos: nombre, categoria, ingredientes, hidratos, proteinas, lípidos, kcal, precio, y grupo predominante. 
El caso de plato es igual que para ingrediente, no le enviamos todos los atributos. Son estrictamente necesarios los atributos nombre, categoría, y una lista de ingredientes de los que está compuesto ese plato. A partir de estos datos, el propio programa busca los ingredientes en la base de datos, y calcula el resto de atributos a partir de ellos.

Por último, la interfáz **Menu** está compuesta por un nombre, platos, precio, hidratos, lípidos, proteinas, kcal, grupos, e ingredientes. En este caso, para crear un Menu, solo requerimos pasarle un nombre, y la lista de platos, ya que el resto de atributos se calculan y se añaden automáticamente a la base de datos. 

#### [directorio routers](../src/routers)

En este directorio tenemos los ficheros que corresponden a las operaciones CRUD: **Post.ts**, **Get.ts**, **patch.ts**, **post.ts** y **default.ts**. Cada fichero define las diferentes operaciones para los diferentes esquemas. Esto quiere decir que definimos, por ejemplo 3 POSTs, 1 para cada modelo que tenemos (Ingrediente, Plato, y Menú).

El fichero **Post.ts** es el fichero que usamos para gestionar los solicitudes tipo POST que enviamos al servidor. El objetivo de POST es el de crear lo que le pasemos el body de nuestro request en la base de datos, siempre y cuando siga el esquema que tenemos predefinido. Para visualizar mejor el funcionamiento del Post,lo ilustraremos con un ejemplo. El contenido enviado en el body de la petición Post es el siguiente: 
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

Para el post de platos, recibimos un objeto con el siguiente formato:
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
Para que este objeto pueda ser guardado en la base de datos, el ingrediente `Queso de cabra` tiene que estar ya introducido en la base de datos de ingredientes, de manera que se puedan hacer los cálculos.



### [Directorio public](../public)

Tenemos un archivo **index.html**, este archivo html se seleccionara y se mostrará cuando el servidor reciva una petición de tipo GET en el que se acceda a la URL base.

## 4. Conclusiones



## 5. Bibliografía y refencias

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