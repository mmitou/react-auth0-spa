package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pb "github.com/mmitou/react-auth0-spa/backend/echo"
)

var (
	port = flag.Int("port", 9090, "The server port")
)

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
