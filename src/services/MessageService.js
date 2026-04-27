const QUEUE_NAME = 'application_notifications';

class MessageService {
  async publishApplicationCreated(applicationId) {
    try {
      const { getRabbitMQChannel } = require('../config/rabbitmq');
      const channel = await getRabbitMQChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      const payload = JSON.stringify({ application_id: applicationId });
      channel.sendToQueue(QUEUE_NAME, Buffer.from(payload), { persistent: true });
      console.log(`📨 Published: application_id=${applicationId}`);
    } catch (err) {
      // Non-blocking: log error but don't fail the API response
      console.error('⚠️  RabbitMQ publish failed (non-fatal):', err.message);
    }
  }
}

module.exports = new MessageService();
