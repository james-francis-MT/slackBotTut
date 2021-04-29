const Fs = require("fs");
const Path = require("path");
const axios = require("axios");

const downloadImage = async (url) => {
    const path = Path.resolve(__dirname, "images", "code.jpg");
    const writer = Fs.createWriteStream(path);

    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

module.exports = downloadImage;
