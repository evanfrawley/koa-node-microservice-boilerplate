const Boom = require('boom');

module.exports = {
  CHANNEL_NOT_FOUND: Boom.badRequest("channel not found"),
  MESSAGE_NOT_FOUND: Boom.badRequest("message not found"),
  USER_NOT_FOUND: Boom.badRequest("user not found"),
  ACTION_NOT_ALLOWED: Boom.forbidden("user is not able to perform action"),
  BAD_REQUEST_BODY: Boom.badRequest("bad request: did not recieve data in body"),
};