const express = require("express");
const { google } = require("googleapis");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
require('dotenv').config();
const port = 3000;
const { connectToDatabase } = require('./database');
const apiKey = process.env.API_KEY;
const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

//Defino el schema de mi coleccion de videos
const videoSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    viewCount: String,
    url: String
});

const Video = mongoose.model('Video', videoSchema);

// Definir función para buscar los top videos de un canal
async function fetchTopVideos(channelId) {
    try {

        const searchResponse = await youtube.search.list({
            part: "snippet",
            channelId: channelId,
            maxResults: 10,
            order: "viewCount",
        });

        const videoIds = searchResponse.data.items.map(item => item.id.videoId);

        if (videoIds.length === 0) {
            return { error: "No se han encontrado vídeos para este canal." };
        }

        const videoDetailsResponse = await youtube.videos.list({
            part: "snippet,statistics",
            id: videoIds.join(","),
        });

        const topVideos = videoDetailsResponse.data.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            viewCount: video.statistics.viewCount,
            url: `https://www.youtube.com/watch?v=${video.id}`,
        }));

        return topVideos;
    } catch (err) {
        console.error("Error buscando los top videos:", err);
        throw new Error("Error al buscar los top videos");
    }
}

// GET para recuperar los top videos de un canal
app.get('/top-videos', async (req, res) => {
    try {
        const channelId = req.query.channel_id;
        const topVideos = await fetchTopVideos(channelId);
        res.json(topVideos);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al buscar los top videos" });
    }
});

// GET para recuperar la info de un video segun el id
app.get('/top-videos/:id', async (req, res) => {
    try{
        const { client, collection } = await connectToDatabase();
        const videoId = req.params.id;
        const video = await collection.findOne({ _id: new mongoose.Types.ObjectId(videoId)});
        if (!video) {
            res.status(404).json({ error: "Video no encontrado" });
        } else {
            res.json(video);
        }
    }catch(err){
        res.status(500).json({ error: err.message || "Error al buscar el video" });
    }
});

// POST para guardar todos los top videos de un canal
app.post('/top-videos', async (req, res) => {
    try{
        const { client, collection } = await connectToDatabase();
        const channelId = req.query.channel_id;
        const topVideos = await fetchTopVideos(channelId);
        const savedVideos = await collection.insertMany(topVideos);
        res.json(savedVideos);
    }catch(err){
        res.status(500).json({ 
            error: err.message || "Error al insertar los top videos" 
        });
    }
});

// PUT para actualizar un video segun el id
app.put('/top-videos/:id', async (req, res) => {
    try{
        const { client, collection } = await connectToDatabase();
        const videoId = req.params.id;
        const updatedVideo = req.body;
        
        if (!updatedVideo || Object.keys(updatedVideo).length === 0) {
            return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío." });
        }

        const result = await collection.updateOne({ _id: new mongoose.Types.ObjectId(videoId) }, { $set: updatedVideo });
        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Video no encontrado." });
        } else {
            res.json({ message: "Video actualizado correctamente" });
        }
    }catch(err){
        console.error("Error al actualizar el video:", err);
    }
});

//DELETE para borrar un video segun el id
app.delete('/top-videos/:id', async (req, res) => {
    try{
        const { client, collection } = await connectToDatabase();
        const videoId = req. params.id;
        const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(videoId) });

        if (result.deletedCount === 1) {
            res.json({ message: "Video eliminado correctamente" });
        } else {
            res.status(404).json({ error: "No se encontró ningún video con ese id" });
        }

    }catch(err){
        res.status(500).json({ 
            error: err.message || "Error al borrar el video" 
        });
    }
});

// DELETE para borrar todos los registros
app.delete('/top-videos', async (req, res) => {
    try {
        const { client, collection } = await connectToDatabase();
        const result = await collection.deleteMany({});
        if (result.deletedCount > 0) {
            res.json({ message: "Todos los videos han sido eliminados correctamente" });
        } else {
            res.status(404).json({ error: "No se encontraron videos para eliminar" });
        }
    }catch(err){
        console.error("Error al eliminar los videos:", err);
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
