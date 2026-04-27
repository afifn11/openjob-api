require('dotenv').config();
const amqplib = require('amqplib');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
});

const QUEUE_NAME = 'application_notifications';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const getApplicationDetails = async (applicationId) => {
  // Get application + applicant + job + job owner info from DB
  const query = {
    text: `
      SELECT
        a.id AS application_id,
        a.applied_at,
        u_applicant.name AS applicant_name,
        u_applicant.email AS applicant_email,
        j.title AS job_title,
        u_owner.name AS owner_name,
        u_owner.email AS owner_email
      FROM applications a
      JOIN users u_applicant ON a.user_id = u_applicant.id
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      JOIN users u_owner ON c.user_id = u_owner.id
      WHERE a.id = $1
    `,
    values: [applicationId],
  };
  const result = await pool.query(query);
  return result.rows[0] || null;
};

const sendNotificationEmail = async (details) => {
  const mailOptions = {
    from: `"OpenJob Notification" <${process.env.MAIL_USER}>`,
    to: details.owner_email,
    subject: `New Application for ${details.job_title}`,
    html: `
      <h2>New Job Application Received</h2>
      <p>Hello <strong>${details.owner_name}</strong>,</p>
      <p>A new candidate has applied for the position: <strong>${details.job_title}</strong></p>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr><td><strong>Applicant Name</strong></td><td>${details.applicant_name}</td></tr>
        <tr><td><strong>Applicant Email</strong></td><td>${details.applicant_email}</td></tr>
        <tr><td><strong>Applied Date</strong></td><td>${new Date(details.applied_at).toLocaleString()}</td></tr>
      </table>
      <p>Please log in to OpenJob to review this application.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✉️  Email sent to job owner: ${details.owner_email}`);
};

const startConsumer = async () => {
  try {
    const url = `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`;
    const connection = await amqplib.connect(url);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);

    console.log(`🐇 Consumer started. Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      try {
        const payload = JSON.parse(msg.content.toString());
        const { application_id } = payload;

        console.log(`📩 Received message: application_id=${application_id}`);

        const details = await getApplicationDetails(application_id);
        if (!details) {
          console.warn(`⚠️  Application not found: ${application_id}`);
          channel.ack(msg);
          return;
        }

        await sendNotificationEmail(details);
        channel.ack(msg);
        console.log(`✅ Notification processed for application: ${application_id}`);
      } catch (err) {
        console.error('❌ Error processing message:', err.message);
        channel.nack(msg, false, false); // discard on error
      }
    });
  } catch (err) {
    console.error('❌ Consumer failed to start:', err.message);
    setTimeout(startConsumer, 5000); // retry after 5s
  }
};

startConsumer();
