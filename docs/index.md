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

#### [directorio models](../src/models)

En el directorio models, guardamos, como mencionamos anteriormente, los esquemas e interfaces de los tipos de datos. En este caso, hemos implementado los modelos **Ingredient**, **Plate** y **Menu**. 

Para la interfaz **Ingredient** hemos definido los siguientes atributos: nombre, grupo, origen, hidratos, proteinas, lipidos, kcal, y precio. En cuanto al esquema, tiene los mismos atributos que la interfaz, siendo obligatorios todos los atributos excepto las kcal, que se calculan automáticamente. 
En nuestros modelos tenemos varios atributos que no son obligatorios, ya que el objeto JSON que enviamos a través de la peticion HTTP, no es necesariamente el objeto que se va a guardar en la base de datos. Por ejemplo, cuando creamos un ingrediente, le tenemos que pasar todos los atributos anteriormente mencionados excepto kcal, ya que, las kcal se calculan de manera automática en base a los hidratos, lípidos, y proteinas.

#### [directorio routers](../src/routers)

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