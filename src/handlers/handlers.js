'use strict';

const Router = require('koa-router');
const mongodb = require('mongodb');
const MongoStore = require('../store/mongostore');

const errors = require('../constants/error-constants');
const messagingRoutes = require('../constants/route-constants');
const xhrConstants = require('../constants/xhr-constants');

const mongoAddr = process.env.DBADDR || "localhost:27017";
// TODO add your app name
const someCollectionName = "someCollectionName";
// TODO add your mongo URL
const mongoURL = `mongodb://${mongoAddr}/${someCollectionName}`;

const amqp = require('amqplib');
const mqAddr = process.env.MQADDR || "localhost:5672";
// TODO update queue name, though notifications should be fine
const qName = 'notificationsQ';
// TODO update notification types
const notificationTypes = require('../constants/notification-constants');

const MessageFactory = require('./message-factory');
const MAX_CONNECTION_RETRIES = 5;

const asyncRouter = async () => {

  const db = await mongodb.MongoClient.connect(mongoURL);
  // TODO get your mongo stores
  let someStore = new MongoStore(db, "someStore");

  let mqURL = "amqp://" + mqAddr;
  let connection = await amqp.connect(mqURL);
  let channel = await connection.createChannel();
  let qConf = await channel.assertQueue(qName, {durable: false});

  let MFImpl = new MessageFactory(channel, qName);

  const router = new Router();

  // Messages Specific
  router
    .patch("/somePath", async ctx => {
      // TODO some auth check
      if (true) {
        let body = ctx.request.body;
        if (body && body.body) {
          let updates = {
            body: body.body,
          };
          let IDToUpdate = '';
          // make sure the message ID is relayed to the MQ
          let payload = {
            // TODO update this
            IDToUpdate,
            ...updates
          };
          MFImpl.createAndQueueMessage('someNotificationType', payload);
          respond(ctx, await someStore.update(IDToUpdate, updates));
        } else {
          respondErr(ctx, errors.BAD_REQUEST_BODY);
        }
      } else {
        respondErr(ctx, errors.ACTION_NOT_ALLOWED);
      }
    })
    .del("/somePath", async (ctx) => {
      // TODO some auth check
      let someIDToUpdate = '';
      if (true) {
        await someStore.deleteByID(someIDToUpdate);
        let payload = {
          someIDToUpdate,
        };
        MFImpl.createAndQueueMessage('deleteNotificationMessage', payload);
        respond(ctx, {"message": "message deleted"});
      } else {
        respondErr(ctx, errors.ACTION_NOT_ALLOWED);
      }
    })
    .get("/somePath", async (ctx) => {
      // gets all channels
      respond(ctx, await someStore.getAll());
    })
    .post("/somePath", async (ctx) => {
      // creates a new channel
      let thingToInsert = {
        name: "name",
        description: "description",
        creator: "someUser",
      };
      let newThingAdded = await someStore.insert(thingToInsert);
      MFImpl.createAndQueueMessage("newThingAddedNotificationType", newThingAdded);
      respond(ctx, newChannel);
    });

/*
  Add more router paths
  router
    .get(...)
    .post(...)
*/

  // HELPER FUNCTIONS
  function respond(ctx, data, statusCode) {
    ctx.body = data;
    ctx.status = statusCode || xhrConstants.STATUS_CODE_OK;
    ctx.set(xhrConstants.CONTENT_TYPE_KEY, xhrConstants.CONTENT_TYPE_JSON);
  }

  function respondErr(ctx, rawError) {
    let err = rawError.output.payload;
    ctx.body = err;
    ctx.status = err.statusCode;
    ctx.set(xhrConstants.CONTENT_TYPE_KEY, xhrConstants.CONTENT_TYPE_JSON);
  }

  return router;
};

module.exports = asyncRouter;
