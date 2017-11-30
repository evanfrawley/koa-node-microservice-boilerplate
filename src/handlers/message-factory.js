'use strict';

class MessageFactory {
    constructor(channel, qName) {
        this.channel = channel;
        this.qName = qName;
    }
    createAndQueueMessage(type, payload) {
        let message = {
            type,
            payload
        };
        this.channel.sendToQueue(this.qName, new Buffer(JSON.stringify(message)));
    };
}

module.exports = MessageFactory;