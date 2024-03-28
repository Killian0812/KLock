const { Expo } = require('expo-server-sdk');

const expo = new Expo();

function sendNotifications(recievers, room, isGuest) {
    let messages = [];
    if (!isGuest) {
        recievers.forEach(user => {
            if (Expo.isExpoPushToken(user.expoPushToken)) {
                messages.push({
                    to: user.expoPushToken,
                    title: `Someone entered ${room.name}`,
                    sound: 'default',
                });
            }
        });
    }
    else {
        recievers.forEach(user => {
            if (Expo.isExpoPushToken(user.expoPushToken)) {
                messages.push({
                    to: user.expoPushToken,
                    title: `New entry at ${room.name}`,
                    body: `Approval required`,
                    sound: 'default',
                });
            }
        });
    }

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
