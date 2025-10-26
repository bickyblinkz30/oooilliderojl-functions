const emailjs = require('@emailjs/node');

// These are your private keys from EmailJS
// IMPORTANT: These are set in your Netlify Environment Variables, not in the code.
const {
    PUBLIC_KEY,
    PRIVATE_KEY,
    SERVICE_ID,
    TEMPLATE_ID
} = process.env;

// --- Configuration ---
// Define your receiving email addresses here.
// You can add as many as you want.
const RECIPIENTS = [
    'salesoil@inbox.ru',
    'salesoil@ooooilliderojl.com'
];

exports.handler = async (event, context) => {
    // --- CORS Headers ---
    const headers = {
        'Access-Control-Allow-Origin': 'https://www.oooilliderojl.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: 'OK' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing required fields: name, email, or message.' }),
            };
        }

        // Initialize EmailJS with your credentials
        emailjs.init(PUBLIC_KEY, PRIVATE_KEY, SERVICE_ID);

        // Prepare the parameters for the email
        const emailParams = {
            // Send the email to all recipients
            to_email: RECIPIENTS.join(','),
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: `You have a new message from ${data.name} (${data.email}):\n\n${data.message}`,
        };

        // Send the email
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Success! Your message has been sent.' }),
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to send message. Please try again later.' }),
        };
    }
};