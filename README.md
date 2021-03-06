# Mandi CMS

![Mandi dashboard screenshot](http://i.imgur.com/n9JSl2A.png)

A lightweight, configurable CMS build using [Koa](http://koajs.com/), [MongoDB](https://www.mongodb.com/), [Pug](https://pugjs.org/), [Vue.js](https://vuejs.org/) and [Stylus](http://stylus-lang.com/).

Setting up and configuring this application will provide you with a simple interface to manage (create, edit, delete, ..) data entries based on a custom JSON schema.

Mandi can be cloned or be installed as an npm module and integrated with a pre-existing node application or HttpServer.

Requirements
---

- Node.js (v7.0.0+)
- MongoDB (v3.2.0+)

Quick usage
---

Install mandi using npm:

```bash
npm install --save mandi
```

#### Attach to a http server

Create a Mandi instance and integrate it onto a pre-existing http node server:

```javascript
const Mandi = require('../lib/Mandi')
const http = require('http')

// Create a simple configuration
let config = {
  mongo     : { url: 'mongodb://localhost/mandi-cms' },
  basePath  : '/admin',
  publicUrl : 'http://localhost:8000/admin'
}
let schema = {
  title: 'My simple blog',
  types: {
    posts: {
      label: 'Post',
      schema: {
        cover: { extends: 'image', label: 'Cover' },
        name: { extends: 'name' },
        content: { extends : 'content' }
      }
    }
  },
  statics: {
    title: { extends: 'title', label   : 'Website title' },
    description: { extend: 'content', label: 'Website description' }
  }
}

// Instanciate Mandi
let mandi = new Mandi(config, schema)

// Instanciate a HTTPServer using Mandi's middleware function
let server = http.createServer(mandi.middleware())

// Start server on port 8000
server.listen(8000)

// The Mandi interface should now be available at localhost:8000/admin
mandi.util.log.info('Running Mandi on', 'http://localhost:8000/admin')
```

#### Run Mandi app on its own

Create a Mandi instance initialise it on its own

```javascript
const Mandi = require('../lib/Mandi')
const http = require('http')

// Create a simple configuration
let config = {
  port : 8000
  // ...
}
let schema = {
  // ...
}

// Instanciate Mandi
let mandi = new Mandi(config, schema)

// Instanciate a HTTPServer using Mandi's middleware function
mandi.listen()
```

#### Run without npm (clone the repo and run standalone)

To setup this codebase on your development environment please follow these steps:

```bash
git clone https://www.github.com/workshape/mandi
cd mandi
npm install
npm run build
```

Before running the app, you still have to

* Confgure the app (Basic configuration)
* Write the CMS JSON schema in `./schema.json` (use `./schema.default.json` as reference)

Then, you just need to run the server:

```bash
npm start
```

Mandi class
---

#### Arguments

* `config` (Object) - an object containing server / db configuration (see 'Basic configuration')
* `schema` (Object) - an object containing the data structure of the CMS (See JSON schema configuration)

#### Methods

* `.listen( port : String )` Listen on given port - if port is not passed, will default to port specified the config Object passed to the constructor
* `.middleware()` Gets callback Function to be attached to a HTTP server (see `callback()` method on [Koa documentation](https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback))
* `.on( eventName : String, callback : Function )` Bind a callback to a specified event

#### Events 

Mandi is an [EventEmitter](https://nodejs.org/api/events.html)

* event: `log` - args: [ `message : String` ] Mandi emits events for each of its logs - the app can also be muted using the `quiet` configuration option, so that it's possible to manage logs in a custom way

Basic configuration
---

The configuration defaults to the one in `config/default.json` but it passed to the `Mandi` constructor

#### Configuration options:

* `publicUrl` (Env. `PUBLIC_URL`) The base URL the CMS will be served at (without trailing slash)
* `basePath` The base path the CMS will be served at (useful if mounting an instance of Mandi on a pre-existing HttpServer)
* `secret` (Env. `SECRET`) A secret used to hash passwords
* `port` (Env. `PORT`) The port the website is gonna be served at by Node.js
* `mongo.url` (Env `MONGO_URL`) The URL of the mongo database (by default `mongodb://localhost/mandi
* `aws.key` (Env. `AWS_KEY`) Your Amazon Web Services key (optional - AWS configuration is used for S3 file uploads, but will fall back on local file system if not setup)
* `aws.secret` (Env. `AWS_SECRET`) Your Amazon Web Services secret
* `aws.bucket` (Env. `AWS_S3_BUCKET`) Your Amazon Web Services S3 Bucket name
* `aws.region` (Env. `AWS_REGION`) Your Amazon Web Services S3 Bucket region (defaults to `us-standard`)
* `uploadsDir` (Env. `UPLOADS_DIR`) Absoute path used to customise the uploads directory
* `quiet` (Env. `QUIET`) Mute all the logs (they can still be detected binding listening to events with `.on('log', msg => { /* ... */ })`)

JSON schema configuration
---

All data types that will be managable through the CMS are defined in a simple JSON schema that can be created by the user.

This schema needs to be created under the `website.json` filename in the root directory - and it will extend the default configuration file `website.default.json`

The default file contains an example of a basic `posts` type that can be used - for example - creating a blogging system

You can use this file as a refence for your `website.json` file

### Website.json properties:

You can override the following properties in the Object exported by `website.json`:

* `title` **String** - *The admin website's title as it will be displayed in the interface*
* `types` **Object** - *The value under each key of this Object contains the JSON schema assigned to the DB collection named with its key*

Defining types
---

Types are basically validation schemas that will determine the UI the CMS generates to administer the various of data entries that will be managed through the CMS

Here's the type you can find in the default CMS configuration `website.default.json`:

```json
{
  "types": {

    "posts": {
      "label": "Post",
      "schema": {

        "cover": {
          "extends" : "image",
          "label"   : "Cover"
        },

        "name": {
          "extends" : "name"
        },

        "excerpt": {
          "extends" : "content",
          "label"   : "Excerpt",
          "tip"     : "Plane text - short and descriptive"
        },

        "content": {
          "extends" : "html",
          "label"   : "HTML content"
        }

      }
    },

  },
  "statics": {

      "title": {
        "extends" : "title",
        "label"   : "Website title"
      },

      "description": {
        "extends" : "content",
        "label"   : "Website description"
      }

  }
}
```

Each type contains the following properties:

* `label` The display name for an individual entry of this type
* `schema` An Object containing the validation schema for given type

Each field in the schema should extend from a basic `validator-preset` - you can set the `extends` property to do so, and every other field is gonna extend the schema it refers to

To learn more about the properties you can override you can look at how the base type presets are defined in `common/util/validator-presets.js`

Types presets
---

When defining the CMS types, you can chose to extend from the following presets (defined in `common/util/validator-presets.js`

* `email` A required 4-100 characters long valid email String
* `url` A required valid url String
* `password` A required 6-100 characters long valid String
* `name` A required 1-100 characters long valid String
* `title` A required 1-150 characters long valid String
* `content` A 0-1500 characters long valid String
* `file` Any file
* `image` A file of mime type matching one of `image/jpeg`, `image/png` or `image/gif`

Running the CMS interface
---

Now that you configured the app and the JSON schema, you need to start the CMS - run

`npm start`

The interface should now be running on [localhost:4000](http://localhost:4000)

By default, a overlord user will be created with the following credentials:

**Username**: `admin`<br>
**Password**: `foobar`

When logged in you will be able to change your password

Development
---

The following npm tasks are available to support development workflow:

* `npm run watch-server` Watch for changes on the server-side codebase and restart server when necessary
* `npm run watch` Watch for changes in the client-side codebase and rebuild what's been changed
* `npm run build` Re-build the codebase
* `npm run dev` Run `watch-server` and `watch` together

Licence
---

Copyright (c) 2017 WorkShape.io Ltd. - Released under the [MIT license](https://github.com/tancredi/mandi/blob/master/LICENSE)