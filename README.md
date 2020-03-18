react-auth0-spa
=============================================================
This sample contains some codes and configurations of 
- Login by OpenID connect with Auth0
- grpc-web with redux-saga
- envoy and gRPC service on GKE

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

- run envoy

```
docker run --rm -d --net=host -v ${PWD}/:/etc/envoy/  envoyproxy/envoy:v1.12.3 
```

- run API server

```
docker build -t mmitou/echo-service .
docker run --rm -it --env-file env -p 9090:9090 mmitou/echo-service
```

### execute Backend on GKE

```
cd backend
gcloud builds submit -t gcr.io/[YOUR_GCP_PROJECT_ID]/echo-service .
cd envoy
gcloud builds submit -t gcr.io/[YOUR_GCP_PROJECT_ID]/envoy-grpc .
gcloud container clusters create sample
gcloud container clusters get-credentials sample
kubectl apply -f sample-sidecar.yaml
kubectl get services -w
```

after a while, if sample-lb gets external ip, set the ip to frontend env file and execute "npm run start".
