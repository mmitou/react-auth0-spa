# react typescript memo

## make new project

```
create-react-app $PROJECTNAME --template typescript
```

## modify tsconfig

```json
{
  "compilerOptions": {
		"baseUrl": "src",
		"noImplicitAny": true,
		"sourceMap": true,
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": [
    "src"
  ]
}

```


## install basic packages

```
npm install @types/react @types/react-dom typescript ts-loader source-map-loader
```
- [typescript official document](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## install redux

```
npm install redux redux-saga typescript-fsa typescript-fsa-reducers typescript-fsa-redux-saga
```
- [typescript-fsa-redux-sagaことはじめ](https://qiita.com/kentac55/items/6d2944c86c8e125ac644)

## install other libraries

```
npm install react-router-dom react-redux
npm install @types/react-router-dom @types/react-redux
```

```
npm install @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

```
npm install react-bootstrap bootstrap react-router-bootstrap
npm install @types/react-router-bootstrap
```

## grpc-web

### compile
```
protoc -I backend/echo/ backend/echo/echo.proto --js_out=import_style=commonjs:./src/echo/ --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/echo/
```

### modify package.json and .env

[ref](https://github.com/grpc/grpc-web/issues/447#issuecomment-568559394)

modify package.json 

```
"eslintConfig": {
    "extends": "react-app",
    "ignorePatterns": ["**/*_pb.js"]
  }
```

add this line to .env

```
EXTEND_ESLINT=true
```

### install google-protobuf

It's not protobuf.

[ref](https://stackoverflow.com/questions/36173502/error-cannot-find-module-google-protobuf/58502020#58502020)

```
npm install google-protobuf
```

### run docker 

```
docker run --rm --net=host -it envoy:v1
```
