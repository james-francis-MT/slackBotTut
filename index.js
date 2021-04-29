"use strict";
require("dotenv").config();
const downloadImage = require("./image-download");
const { App } = require("@slack/bolt");
const { default: axios } = require("axios");

const token = process.env.SLACK_BOT_TOKEN;
const channelId = "C020E5QSSNN";

const bot = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
    // Start the app
    await bot.start(process.env.PORT || 3000);

    console.log("⚡️ Bolt app is running!");
})();

bot.event("file_shared", async ({ event, say }) => {
    console.log(event);
    if (event.channel_id === channelId) {
        await say("Hello, nice image");
        const imageUrl = await request(event.file_id);
        await downloadImage(imageUrl);
    }
});

const request = async (fileID) => {
    var config = {
        method: "get",
        url: "https://slack.com/api/files.list",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            channel: channelId,
        },
    };

    axios(config)
        .then(function (response) {
            let latestImage;
            response.data.files.forEach((image) => {
                if (image.id === fileID) {
                    latestImage = image;
                }
            });
            return JSON.stringify(latestImage.url_private_download);
        })
        .catch(function (error) {
            console.log(error);
        });
};
