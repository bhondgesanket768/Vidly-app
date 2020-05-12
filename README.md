# Vidly-app
Imaginary Movie Rental api with node.js

# Features

* Customers can take movies on rent
* Updating and deleting of genres, Movies etc..

### Prerequisites

* Nodejs
* MongoDB

# Setup

## Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

## Install the Dependencies

> Download latest version of Node

```Javascript
    npm i
```

##  Setting Environment Variables

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control

On Mac:

```Javascript
    export vidly_jwtPrivateKey=yourKey
```

On Windows:

```Javascript
    set vidly_jwtPrivateKey=yourKey
```

## Start the server

```Javascript
    nodemon index.js
```
This will launch the Node server on port 3000. If that port is busy, you can set a different point in config/default.json.



