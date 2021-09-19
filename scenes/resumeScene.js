const { Telegraf, Scenes: { WizardScene}, Markup } = require('telegraf');
require("dotenv").config();

const exitKeyboard = Markup.keyboard(['Отмена']).oneTime().resize();

const positionHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.fullname = ctx.from.first_name ? ctx.from.first_name : "" + ctx.message.last_name ? ctx.from.last_name : "";
    ctx.scene.state.resume.username = ctx.from.username ? `@${ctx.from.username}` : `отсуствует`;
    ctx.scene.state.resume.position = ctx.message.text;
    await ctx.replyWithMarkdown("В каком городе требуется специалист?\n_Например, Москва_", Markup.keyboard(['Дистанционно', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const cityHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.city = ctx.message.text;
    await ctx.replyWithMarkdown("На какую заработную плату Вы претендуете?\n_Например, до 50.000 руб._", Markup.keyboard(['По договоренности', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const salaryHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.salary = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите свой опыт работы\n_Например, от 1 года_", Markup.keyboard(['Нет опыта', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const experienceHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.experience = ctx.message.text;
    await ctx.replyWithMarkdown("Коротко расскажите о том, что Вы предлагаете?\n_Например, подбор декора и артистов_", exitKeyboard);
    return ctx.wizard.next();
})

const responsibilitiesHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.responsibilities = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите ссылку на портфолио\n", Markup.keyboard(['Нет портфолио', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const portfolioHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.resume.portfolio = ctx.message.text;
    const message = `_Резюме:_\n*${ctx.scene.state.resume.position}*\n${ctx.scene.state.resume.city}\n${ctx.scene.state.resume.salary}\n\n*Опыт работы: *${ctx.scene.state.resume.experience}\n\n*Обязанности: *\n${ctx.scene.state.resume.responsibilities}\n\n*Портфолио: *\n${ctx.scene.state.resume.portfolio}\n\n*Контакты: *\n${ctx.scene.state.resume.fullname}\nTelegram: ${ctx.scene.state.resume.username}`;
    await ctx.replyWithMarkdown(message);
    await ctx.telegram.sendMessage(process.env.ADMIN_ID, message,  { parse_mode: 'markdown'});
    await ctx.replyWithMarkdown("Резюме отправлено администратору");
    return ctx.scene.enter("menuScene");
})

const resumeScene = new WizardScene('resumeScene', positionHandler, cityHandler, salaryHandler, experienceHandler, responsibilitiesHandler, portfolioHandler);
resumeScene.enter(ctx => {
    ctx.scene.state.resume = {};
    return ctx.replyWithMarkdown('На какую должность Вы претендуете?\n_Например, Организатор свадеб_', exitKeyboard)
});

module.exports = resumeScene;