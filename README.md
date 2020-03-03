react-auth0-spa
=============================================================

Auht0 Login and API call example.

![sample](https://user-images.githubusercontent.com/254112/75743456-66b51180-5d54-11ea-84d8-53ac563f88a2.gif)

<br />
This sample mainly depends on some tools below.

- Frontend
	- TypeScript
	- auth0-spa-js
	- react, redux, redux-saga 
	- grpc-web

- Backend
	- Go
	- grpc-go

## Usage

Please try this example on Linux.

### configure Auth0

- sign up [Auth0](https://auth0.com)
- configure auth0 referring to [React: Login](https://auth0.com/docs/quickstart/spa/react/01-login) and write following items down
	- domain
	- client id
- set "redirect uri" in auth0 setting to http://localhost:3000/callback

### execute Frontend

- checkout this repository
- execute this command

```
npm install
```

- edit .env file like this

```
REACT_APP_DOMAIN=YOUR_AUTH0_DOMAIN_WROTE_DOWN_IN_THE_PREVIOUS_SECTION
REACT_APP_CLIENT_ID=YOUR_AUTH0_CLIENT_ID_WROTE_DOWN_IN_THE_PREVIOUS_SECTION
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
REACT_APP_ECHOSERVICE_URL=http://localhost:8080
EXTEND_ESLINT=true
```
- execute this command

```
npm run start
```

### execute Backend

- change directory

```
cd backend
```

- build proxy image

```
docker build -t envoy:v1 .
```

- run envoy

```
docker run --rm -d --net=host envoy:v1
```

- run API server with env variables

```
go build
JWKS_ENDPOINT=YOUR_JWKS_ENDPOINT CLIENT_ID=YOUR_AUTH0_CLIENT_ID ISSUER=YOUR_ISSUER_URI ./backend
```

env examples
- JWKS_ENDPOINT https://dev-ag9zx3un.auth0.com/.well-known/jwks.json
- ISSUER https://dev-ag9zx3un.auth0.com/

