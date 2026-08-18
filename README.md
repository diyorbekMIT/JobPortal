# go-rabbitmq

A wrapper of [`rabbitmq/amqp091-go`](https://github.com/rabbitmq/amqp091-go) that provides reconnection logic and sane defaults. Hit the project with a star if you find it useful ⭐

Supported by Boot.dev. If you'd like to learn about RabbitMQ and Go, you can check out the course [here](https://www.boot.dev/lessons/0a483dcd-2d69-435e-9216-d5915c88b8e1).

## Motivation

Streadway's AMQP library is a robust, well-supported Go client. It intentionally stays close to the AMQP protocol, so it does not provide reconnection logic or many high-level convenience abstractions.

The goal of `go-rabbitmq` is to provide a higher-level API designed specifically for RabbitMQ, while keeping sensible defaults.

Features include:

- Automatic reconnection
- Multithreaded consumers through handler functions
- Reasonable defaults
- Flow-control handling
- TCP-block handling

## Quick Start

### Install

Inside a Go module, install the package:

```bash
go get github.com/wagslane/go-rabbitmq
```

### Consumer

The queue is declared automatically. The exchange is not declared unless you explicitly enable that option.

```go
conn, err := rabbitmq.NewConn(
    "amqp://guest:guest@localhost",
    rabbitmq.WithConnectionOptionsLogging,
)
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

consumer, err := rabbitmq.NewConsumer(
    conn,
    "my_queue",
    rabbitmq.WithConsumerOptionsRoutingKey("my_routing_key"),
    rabbitmq.WithConsumerOptionsExchangeName("events"),
    rabbitmq.WithConsumerOptionsExchangeDeclare,
)
if err != nil {
    log.Fatal(err)
}
defer consumer.Close()

err = consumer.Run(func(d rabbitmq.Delivery) rabbitmq.Action {
    log.Printf("consumed: %v", string(d.Body))
    return rabbitmq.Ack
})
if err != nil {
    log.Fatal(err)
}
```

### Publisher

Use the exchange declaration option if your application needs to create the exchange.

```go
conn, err := rabbitmq.NewConn(
    "amqp://guest:guest@localhost",
    rabbitmq.WithConnectionOptionsLogging,
)
if err != nil {
    log.Fatal(err)
}
defer conn.Close()

publisher, err := rabbitmq.NewPublisher(
    conn,
    rabbitmq.WithPublisherOptionsLogging,
    rabbitmq.WithPublisherOptionsExchangeName("events"),
    rabbitmq.WithPublisherOptionsExchangeDeclare,
)
if err != nil {
    log.Fatal(err)
}
defer publisher.Close()

err = publisher.Publish(
    []byte("hello, world"),
    []string{"my_routing_key"},
    rabbitmq.WithPublishOptionsContentType("application/json"),
    rabbitmq.WithPublishOptionsExchange("events"),
)
if err != nil {
    log.Println(err)
}
```

## Usage

### Configuration

- Queues are declared automatically for new consumers.
- Routing-key bindings are declared when `WithConsumerOptionsRoutingKey` is used.
- Exchanges are not declared automatically unless you use:
  - `WithPublisherOptionsExchangeDeclare`
  - `WithConsumerOptionsExchangeDeclare`

See the [Go documentation](https://pkg.go.dev/github.com/wagslane/go-rabbitmq) for all configuration options.

### Closing resources

Close publishers and consumers when you are finished with them. Do not reuse them after closing. Close the RabbitMQ connection only after closing all associated publishers and consumers.

### Integration tests

Run integration tests with Docker enabled:

```bash
ENABLE_DOCKER_INTEGRATION_TESTS=TRUE go test -v ./...
```

The tests start a RabbitMQ container using your local Docker daemon.

## 🤝 Contributing

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub repository details.

### Run tests

```bash
go test ./...
```

### Run integration tests

```bash
ENABLE_DOCKER_INTEGRATION_TESTS=TRUE go test -v ./...
```

### Submit a pull request

1. Fork the repository.
2. Create a branch for your change.
3. Add or update tests where appropriate.
4. Ensure tests and linting pass.
5. Open a pull request to the `main` branch.

## Stability

The API is currently in v0. Small breaking changes may occur before v1.

## License

See the repository license file for licensing information.
