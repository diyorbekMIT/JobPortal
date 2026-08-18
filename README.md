go-rabbitmq
A wrapper of rabbitmq/amqp091-go that provides reconnection logic and sane defaults. Hit the project with a star if you find it useful ⭐

Supported by Boot.dev. If you'd like to learn about RabbitMQ and Go, check out the course here.

Motivation
Streadway's AMQP library is a robust and well-supported Go client. It is a great option when you need a low-level AMQP client, but it intentionally stays close to the AMQP protocol and does not provide reconnection logic or many ease-of-use abstractions.

Goal
go-rabbitmq provides much of the useful functionality of an AMQP client through a higher-level API designed specifically for RabbitMQ. The project focuses on:

Automatic reconnection

Multithreaded consumers through handler functions

Reasonable defaults

Flow-control handling

TCP-block handling

Quick Start
Installation
Inside a Go module:

bash
go get github.com/wagslane/go-rabbitmq
Consumer
The queue is declared automatically. Exchanges are not declared unless you enable the exchange-declaration option. Consumers can also declare routing-key bindings.

go
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
Publisher
The exchange is not declared by default, so use the exchange options when the application should create it automatically.

go
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
Usage
Options and configuration
Queues are declared automatically by new consumers unless configured otherwise.

Routing-key bindings are declared by consumers when WithConsumerOptionsRoutingKey is used.

Exchanges are not declared automatically unless WithPublisherOptionsExchangeDeclare or WithConsumerOptionsExchangeDeclare is provided.

See the Go documentation for all available options.

Closing resources
Close publishers and consumers when you are finished with them. Do not reuse a publisher or consumer after closing it. Close the connection only after all associated publishers and consumers have been closed.

Examples
See the examples directory for additional usage examples.

Integration tests
Set ENABLE_DOCKER_INTEGRATION_TESTS=TRUE while running the test suite to launch a RabbitMQ container through the local Docker daemon:

bash
ENABLE_DOCKER_INTEGRATION_TESTS=TRUE go test -v ./...
See integration_test.go.

Deploy
This library is imported into a Go application and does not require a separate deployment. Deploy the application together with a reachable RabbitMQ instance. Configure the AMQP connection string through an environment variable or another secret-management system rather than hard-coding credentials.

Contributing
Contributions are welcome. Fork the repository, create a branch, and open a pull request against the main branch.

Before submitting a pull request:

Run the existing tests and linters.

Add or update tests for your changes where appropriate.

Keep the public API and documentation consistent.

Explain any breaking or behavioral changes in the pull request description.

Stability
The API is currently in v0. There are no plans for major changes, but small breaking changes may occur before v1.

Dependencies
The project aims to keep transient dependencies limited to github.com/rabbitmq/amqp091-go.

Contact
Open an issue on GitHub

Follow on Twitter

License
See the repository's license file for licensing information.
