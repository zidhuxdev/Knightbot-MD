const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');

async function viewonceCommand(sock, chatId, message) {
    // Owner JID
    const ownerJid = settings.ownerNumber + '@s.whatsapp.net';

    // Extract quoted imageMessage or videoMessage from your structure
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;

    if (quotedImage && quotedImage.viewOnce) {
        // Download and send the image
        const stream = await downloadContentFromMessage(quotedImage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(ownerJid, {
            image: buffer,
            fileName: 'media.jpg',
            caption: quotedImage.caption || ''
        });

    } else if (quotedVideo && quotedVideo.viewOnce) {
        // Download and send the video
        const stream = await downloadContentFromMessage(quotedVideo, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(ownerJid, {
            video: buffer,
            fileName: 'media.mp4',
            caption: quotedVideo.caption || ''
        });

    } else {
        await sock.sendMessage(chatId, {
            text: '❌ Please reply to a view-once image or video.'
        }, { quoted: message });
    }
}

module.exports = viewonceCommand;
