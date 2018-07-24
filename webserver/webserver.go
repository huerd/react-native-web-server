package webserver

import (
	"fmt"
	"github.com/braintree/manners"
	"github.com/gorilla/mux"
	"log"
	"net"
	"net/http"
)

type serverConfig struct {
	isRunning  bool
	fileDir    string
	isEmbedded bool
}

var serverUrl string

var config = serverConfig{
	isEmbedded: false,
	fileDir:    "./",
}

func SetConfig(fileDir string, isEmbedded bool) {
	config.isEmbedded = isEmbedded
	config.fileDir = fileDir
}

func findAvailablePort() (int, error) {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	if err != nil {
		return -1, err
	}
	l, err := net.ListenTCP("tcp", addr)
	if err != nil {
		return -1, err
	}
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port, nil
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Alive!")
}

func ServerUrl() string {
	return serverUrl
}

func IsRunning() bool {
	return config.isRunning
}

func Start() (string, error) {
	log.SetPrefix("GO: ")
	r := mux.NewRouter()
	port, err := findAvailablePort()
	if err != nil {
		return "", err
	}
	r.HandleFunc("/ping", ping)
	go func() {
		config.isRunning = true
		log.Printf("Starting a serve: https://localhost:%d/ping\n", port)
		err := manners.ListenAndServe(fmt.Sprintf(":%d", port), r)
		if err != nil {
			log.Printf("%v\n", err)
		}
	}()
	serverUrl = fmt.Sprintf("http://localhost:%d", port)
	return serverUrl, nil
}

func Stop() {
	config.isRunning = false
	serverUrl = ""
	manners.Close()
}
