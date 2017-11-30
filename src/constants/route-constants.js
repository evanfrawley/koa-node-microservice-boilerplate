// TODO update route constants to fit your needs

const version = 'v1';
const messages = 'messages';
const messageID = 'messageID';
const channels = 'channels';
const channelBase = `/${version}/${channels}`;
const channelID = 'channelID';

const messagingRoutes = {
  APP_NAME: "info344",
  channelsKey: channels,
  messagesKey: messages,
  channelID: channelID,
  messageID: messageID,
  channels: `${channelBase}`,
  channelsSpecific: `${channelBase}/:${channelID}`,
  messagesSpecific: `/${version}/${messages}/:${messageID}`,
};

module.exports = messagingRoutes;
