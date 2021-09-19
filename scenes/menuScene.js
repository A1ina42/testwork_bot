const { Scenes: { BaseScene}, Markup} = require('telegraf');

const menuScene = new BaseScene("menuScene");

menuScene.enter(ctx => {
    ctx.reply("Хочу разместить: ", Markup.keyboard([
        ['Разместить вакансию'],
        ['Разместить резюме']
    ]).oneTime().resize());
})

module.exports = menuScene;