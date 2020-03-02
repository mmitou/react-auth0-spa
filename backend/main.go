package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/grpc-ecosystem/go-grpc-middleware"
	"github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"github.com/lestrrat/go-jwx/jwk"
	"golang.org/x/xerrors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"

	pb "github.com/mmitou/react-auth0-spa/backend/echo"
)

var (
	port    = flag.Int("port", 9090, "The server port")
	jwksUri = "https://dev-ag9zx3un.auth0.com/.well-known/jwks.json"
)

// auth
func getKey(token *jwt.Token) (interface{}, error) {
	jwks, err := jwk.FetchHTTP(jwksUri)
	if err != nil {
		xerr := xerrors.Errorf("jwk.FetchHTTP(%s) failed: %v", jwksUri, err)
		return nil, xerr
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		xerr := xerrors.Errorf("type assertion failed. %+v", token.Header["kid"])
		return nil, xerr
	}

	keys := jwks.LookupKeyID(keyID)
	if len(keys) == 0 {
		xerr := xerrors.Errorf("not found kid(%s) in jwks(%v)", keyID, jwks)
		return nil, xerr
	}

	return keys[0].Materialize()
}

func authFunc(ctx context.Context) (context.Context, error) {
	tokenString, err := grpc_auth.AuthFromMD(ctx, "bearer")
	if err != nil {
		return nil, err
	}
	fmt.Printf("tokenString: %s\n", tokenString)
	token, err := jwt.Parse(tokenString, getKey)
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "token parse failed: %v", err)
	}

	fmt.Println("token: %+v\n", token)
	newCtx := context.WithValue(ctx, "token", token)

	return newCtx, nil
}

func unaryServerInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		fmt.Println("in middleware")
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, xerrors.New("no metadata")
		}
		authHeader := md["authorization"]
		fmt.Printf("authHeader %v\n", authHeader)
		resp, err := handler(ctx, req)
		return resp, err
	}
}

// Echo server
type echoServer struct {
}

func (s *echoServer) Echo(ctx context.Context, req *pb.EchoRequest) (*pb.EchoResponse, error) {
	res := &pb.EchoResponse{Message: req.Message + ", " + req.Message}
	fmt.Printf("Echo(req: %v) res: %v\n", req, res)
	return res, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("listening port %d\n", *port)
	server := grpc.NewServer(grpc.UnaryInterceptor(
		grpc_middleware.ChainUnaryServer(
			unaryServerInterceptor(),
			grpc_auth.UnaryServerInterceptor(authFunc))))
	pb.RegisterEchoServiceServer(server, &echoServer{})
	reflection.Register(server)
	server.Serve(lis)
}
