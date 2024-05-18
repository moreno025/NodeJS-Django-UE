const express = require("express");
const { google } = require("googleapis");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const { connectToDatabase } = require('./database');
const apiKey = 'AIzaSyD4ah8b2ggczdb9NKuCqMSFFwayA4q1Ta4';
const apiUrl = "https://www.googleapis.com/youtube/v3";
const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

//Defino el schema de mi coleccion de videos
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    viewCount: String,
    url: String
});

const Video = mongoose.model('Video', videoSchema);

//Obtener los videos más vistos de un canal
app.get("/top-videos", async (req, res, next) => {
    try {
        const { client, collection } = await connectToDatabase();
        const channelId = req.query.channel_id;
        console.log(`Buscando los top videos del channel por ID: ${channelId}`);

        const searchResponse = await youtube.search.list({
        part: "snippet",
        channelId: channelId,
        maxResults: 10,
        order: "viewCount",
        });

        console.log("Search response:", JSON.stringify(searchResponse.data, null, 2));

        const videoIds = searchResponse.data.items.map(item => item.id.videoId);
        console.log("Video IDs:", videoIds);

        if (videoIds.length === 0) {
            return res.status(404).json({ error: "No se han encontrado vídeos para este canal." });
        }

        const videoDetailsResponse = await youtube.videos.list({
        part: "snippet,statistics",
        id: videoIds.join(","),
        });

        console.log("Response details Video:", JSON.stringify(videoDetailsResponse.data, null, 2));

        const topVideos = videoDetailsResponse.data.items.map(video => ({
            title: video.snippet.title,
            description: video.snippet.description,
            viewCount: video.statistics.viewCount,
            url: `https://www.youtube.com/watch?v=${video.id}`,
        }));

        //Para guardar en mi base de datos de mongodb la info de los vídeos mas vistos
        const savedVideos = await collection.insertMany(topVideos);
        res.json(savedVideos);

    } catch (err) {
        console.error("Error buscando los top videos:", err);
        next(err);
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
