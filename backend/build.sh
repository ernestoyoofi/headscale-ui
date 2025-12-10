if [ -d "./build" ]; then
  mkdir -p ./build
else
  rm -rf ./build
  mkdir -p ./build
fi

# For Linux
GOOS=linux GOARCH=amd64 go build -o ./build/server-linux-amd64
GOOS=linux GOARCH=arm64 go build -o ./build/server-linux-arm64
GOOS=linux GOARCH=arm go build -o ./build/server-linux-arm

# For Windows
GOOS=windows GOARCH=amd64 go build -o ./build/server-win-amd64
GOOS=windows GOARCH=arm64 go build -o ./build/server-win-arm64