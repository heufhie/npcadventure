const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Initialize the bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Replace with your real bot token and Gemini API key
let BOT_TOKEN = process.env.BOT_TOKEN;
const genAI = new GoogleGenerativeAI('AIzaSyDaHT95wCFiw_CMUZD3A0J6U3p13petI3I');

let chatHistory = {};

async function generateResponse(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return { error: true, statusText: error.statusText || "Unknown Error" };
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.channel.id !== '1363474099871027432') return;


    const userId = message.author.id;
    const content = message.content;

    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push(content);

    const previous = chatHistory[userId].length > 1 ? chatHistory[userId][chatHistory[userId].length - 2] : null;

    let prompt = `Reply to this message naturally and respond to it in an NPC kind of way and cringe and adventurous.`;

    if (previous) {
        prompt += `\nTheir last message before this: "${previous}"`;
    }

    prompt += `\nNow respond to this: "${content}"`;

    const response = await generateResponse(prompt);

    if (!response.error) {
        try {
            await message.reply(response);
            console.log(`Replied to ${userId}:`, response);
        } catch (err) {
            console.error("Error replying to message:", err);
        }
    } else {
        await message.reply(`i failed to generate response. Status: ${response.statusText}`);
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(BOT_TOKEN);

// ADD THIS TO PREVENT "Timed out / no open ports detected" ON RENDER
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

app.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});
