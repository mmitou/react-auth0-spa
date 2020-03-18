package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"os"

	jwt "github.com/dgrijalva/jwt-go"
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
	port = flag.Int("port", 9090, "The server port")
)

// auth
func getKey(token *jwt.Token) (interface{}, error) {
	jwksUri := os.Getenv("JWKS_ENDPOINT")
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
		return nil, status.Errorf(codes.Unauthenticated, "jwt parse failed: %v", err)
	}
	if !token.Valid {
		return nil, status.Errorf(codes.Unauthenticated, "token is invalid")
	}

	fmt.Printf("token header: %v\n", token.Header)
	err = token.Claims.Valid()
	if err != nil {
		return nil, status.Errorf(codes.Unauthenticated, "token.claims are invalid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "token.claims are invalid")
	}
	fmt.Printf("token claims: %v\n", claims)

	clientID := os.Getenv("CLIENT_ID")
	ok = claims.VerifyAudience(clientID, true)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "aud claim is invalid")
	}

	issuer := os.Getenv("ISSUER")
	ok = claims.VerifyIssuer(issuer, true)
	if !ok {
		return nil, status.Errorf(codes.Unauthenticated, "iss claim is invalid")
	}

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
	server := grpc.NewServer()
	pb.RegisterEchoServiceServer(server, &echoServer{})
	reflection.Register(server)
	server.Serve(lis)
}
