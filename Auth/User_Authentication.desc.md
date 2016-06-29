# Objectives

* Explain how user authentication works
* Use bcrypt to check if a password is valid
* Explain what a cookie is
* Explain what a session is
* Add routes to authenticate a user
* Create express middleware to detect whether user is authenticated

# How does user authentication work?

When a user is logging in, they provide an identifier (e.g. username, email, employee number, etc.) as well as their password. Since passwords are stored in as a hash, more work needs to be done to check whether the password is valid. When a user attempts to login, their password is hashed with their particular salt and compared to the encoded string stored in the database. If they are equivalent, the user is who they claim and can successfully login.

In short,

1. User enters identifier and password on login
1. Find user in the database using identifier
1. Plain-text password is hashed
1. Encoded string is compared to hash from database
1. If match, user is authenticated

## Using `bcrypt`

In the previous lesson, we learned how to use `bcrypt` to hash a password and store it in the database. In hashing the password, `bcrypt` generates a salt and includes that in the final encoded string. `bcrypt` also allows the ability to check if a user's password is equivalent to the hash with the `compare()` method. It takes three arguments:

1. The plain-text password from a user login attempt
1. The stored hash from the database
1. A callback with two parameters:
  - `err` details any errors
  - `isMatch` is a boolean informing whether the plain-text password is equivalent to the hash

```javascript
bcrypt.compare(plainTextPassword, hash, (err, isMatch) => {
  if (err) {
    // Handle err
  }

  if (isMatch) {
    // User authenticated
  } else {
    // Incorrect password
  }
});
```

Now let's create a route for logging in and use `bcrypt`.

```javascript
router.post('/session', (req, res, next) => {
  const { email, password } = req.body;

  // Find user in the database using identifier (email).
  knex('users')
    .where('email', email)
    .first()
    .then((user) => {
      if (!user) {
        // User does not exist.
        return res.sendStatus(400);
      }

      // Hash password with bcrypt and compare it to the database's hash.
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) {
          // Error in hashing
          return next(err);
        }

        if (!isMatch) {
          // Password is not correct.
          return res.sendStatus(400);
        }

        // User is authenticated
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      next(err);
    });
});
```

# What is a cookie?

The process of **user authentication** starts when a user provides a password to be stored for future login. Instead of requiring authentication for each request the browser needs to make, the server sends a small piece of data to the browser called a **cookie** to hold onto authentication information.

Cookies are sent in the response header called `Set-Cookie`. This header informs the web browser to optionally store the cookie and send it back in future requests to the server (the user can disable cookies).

Example HTTP Response Header:
```
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: theme=light
Set-Cookie: sessionToken=abc123; Expires=Wed, 09 Jun 2021 10:18:14 GMT
```

Express JS offers an easy way to set the cookie and clear a cookie in the response.

```javascript
res.cookie(name, value [, options]);
res.clearCookie(name[, options]);
```

See the documentation for [setting cookies](http://expressjs.com/en/4x/api.html#res.cookie) and [clearing cookies](http://expressjs.com/en/4x/api.html#res.clearCookie).

Clients request contains a `Cookie` HTTP header.

Example HTTP Request Header:
```
GET / HTTP/1.1
Cookie: theme=light; sessionToken=abc123;
```

## `cookie-parser` middleware

Parsing the `Cookie` HTTP header can be an annoying task. Luckily, there's a piece of middleware that can parse the cookies for you named `cookie-parser`.

```shell
npm install --save cookie-parser
```

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/hello', function(req, res, next) {
  console.log(req.cookies); // object
  // ...
});
```

# What is a session?

Broadly speaking, a session refers to an ongoing dialogue between two system. In the case of Express, the systems are the client and the server. When a client makes a request to the server, the server creates a session token to identify the client. The server can then use that session token throughout the ongoing dialogue to keep track of who the client is.

We can store the session anywhere, but it is commonly stored in a cookie. Since anybody can create a cookie and falsify information, like a session token, the server needs a way to ensure the token is authentic and not fraudulent. A session token can be signed cryptographically using secret keys to ensure the data has not been tampered with or falsified. The server then sends the session token along with the signature. The client responds with the session token and signature. The server verifies signature by resigning the session token with it's secret key. If the signatures match the server can be confident the session has not been modified.

## `cookie-session` middleware

`cookie-session` is a piece of middleware that is useful for storing, reading and signing sessions and storing them in a cookie. the library modifies the req object providing the following properties:

* req.session represents the session stored in the cookie.
* req.sessionOptions represents the settings of the session.

These properties provide a way to set cookies and send them to the client and a way to sign cookies and verify their authenticity.

```shell
npm install --save cookie-session
```

```javascript
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session', //name of cookie to set
  // other cookie attributes like maxAge, expires, domain can be set here
  keys: ['some_secure_key']
}));

// ...

router.post('/session', (req, res, next) => {
  const { email, password } = req.body;

  // Find user in the database using identifier (email).
  knex('users')
    .where('email', email)
    .first()
    .then((user) => {
      if (!user) {
        // User does not exist.
        return res.sendStatus(400);
      }

      // Hash password with bcrypt and compare it to the database's hash.
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) {
          // Error in hashing
          return next(err);
        }

        if (!isMatch) {
          // Password is not correct.
          return res.sendStatus(400);
        }

        // User is authenticated. Store user in the session.
        req.session.user = user;
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      next(err);
    });
});
```

*Note:* The cookie is marked as `HttpOnly`, which means that the cookie can only be set over HTTP and HTTPS. It also means you cannot access cookies in JavaScript on the browser using `document.cookie`. If there is any user information, you'd like the client to use, another cookie that's accessible needs to be set.

# Detecting whether user is authenticated

# Logging a user out

Logging a user out is as easy as destroying the request session. This clears the session cookies so that the user cannot be authenticated.

```javascript
router.delete('/session', (req, res, next) => {
  req.session = null;
  res.sendStatus(200);
});
```