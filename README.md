react-auth0-spa
=============================================================

Auht0 Login and API call sample.

![sample](https://user-images.githubusercontent.com/254112/75658899-6cefb300-5cac-11ea-9509-41640ede899c.gif)

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

Please try this sample on Linux.

### configure Auth0

- sign up [Auth0](https://auth0.com)
- configure auth0 referring to [React: Login](https://auth0.com/docs/quickstart/spa/react/01-login) and write following items down
	- domain
	- client id
- set "redirect uri" in auth0 setting to http://localhost:3000/callback

### execute Frontend

- checkout this sample
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

- run API server

```
go build
./backend
```
