const amqplib = require('amqplib');

let connection = null;
let channel = null;

const getRabbitMQChannel = async () => {
  if (!channel) {
    const url = `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
    connection = await amqplib.connect(url);
    channel = await connection.createChannel();
    console.log('✅ RabbitMQ connected');
  }
  return channel;
};

const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};

module.exports = { getRabbitMQChannel, closeRabbitMQ };
