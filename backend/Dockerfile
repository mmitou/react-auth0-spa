FROM golang:alpine as build
WORKDIR /root/go/src/github.com/mmitou/react-auth0-spa/backend
COPY ./ .
RUN CGO_ENABLED=0 GOOS=linux go build -v -o echo-service main.go

FROM scratch
COPY --from=build /root/go/src/github.com/mmitou/react-auth0-spa/backend/echo-service /bin/
ENTRYPOINT [ "/bin/echo-service" ]
EXPOSE 9090
