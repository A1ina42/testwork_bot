const { Telegraf, Scenes: { Stage }, session} = require("telegraf");
require("dotenv").config();

const vacancyScene = require('./scenes/vacancyScene');
const menuScene = require('./scenes/menuScene');
const resumeScene = require('./scenes/resumeScene');
const stage = new Stage([menuScene, vacancyScene, resumeScene]);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());

bot.hears("Разместить вакансию", ctx => ctx.scene.enter('vacancyScene'));
bot.hears("Разместить резюме", ctx => ctx.scene.enter('resumeScene'));

bot.start((ctx) => ctx.scene.enter("menuScene"))

bot.launch();