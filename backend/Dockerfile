FROM golang:1.13 as builder
WORKDIR /root/go/src/github.com/mmitou/react-auth0-spa/backend
COPY ./ .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -v -o echo-service main.go

FROM scratch
WORKDIR /bin/
COPY --from=builder /root/go/src/github.com/mmitou/react-auth0-spa/backend/echo-service .
ENTRYPOINT [ "/bin/echo-service" ]
EXPOSE 9090
