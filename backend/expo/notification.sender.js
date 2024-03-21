const { Expo } = require('expo-server-sdk');

const expo = new Expo();

function sendNotifications(recievers, room) {
    let messages = [];
    recievers.forEach(user => {
        if (Expo.isExpoPushToken(user.expoPushToken)) {
            messages.push({
                to: user.expoPushToken,
                title: `New entry at ${room.name}`,
                // body: `New entry approval required`,
                sound: 'default',
            });
        }
    });

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                // console.log(ticketChunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

module.exports = { sendNotifications };
