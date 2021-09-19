const { Telegraf, Scenes: { WizardScene}, Markup } = require('telegraf');
require("dotenv").config();

const exitKeyboard = Markup.keyboard(['Отмена']).oneTime().resize();

const specialistHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.fullname = ctx.from.first_name ? ctx.from.first_name : "" + ctx.message.last_name ? ctx.from.last_name : "";
    ctx.scene.state.vacancy.username = ctx.from.username ? `@${ctx.from.username}` : `отсуствует`;
    ctx.scene.state.vacancy.specialist = ctx.message.text;
    await ctx.replyWithMarkdown("В каком городе требуется специалист?\n_Например, Москва_", Markup.keyboard(['Дистанционно', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const cityHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.city = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите заработную плату\n_Например, до 130.000 руб._", Markup.keyboard(['Договорная', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const salaryHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.salary = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите требуемый опыт работы\n_Например, от 1 года_", Markup.keyboard(['Не требуется', 'Отмена']).oneTime().resize());
    return ctx.wizard.next();
})

const experienceHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.experience = ctx.message.text;
    await ctx.replyWithMarkdown("Какие обязанности несёт должность?\n_Например, приём входящих звонков_", exitKeyboard);
    return ctx.wizard.next();
})

const responsibilitiesHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.responsibilities = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите требования к соискателю\n_Например, грамотная речь_", exitKeyboard);
    return ctx.wizard.next();
})

const requirementsHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.requirements = ctx.message.text;
    await ctx.replyWithMarkdown("Укажите условия работы\n_Например, график работы 5/2_", exitKeyboard);
    return ctx.wizard.next();
})

const conditionsHandler = Telegraf.on('text', async(ctx) => {
    if (ctx.message.text === "Отмена") return ctx.scene.enter("menuScene");
    ctx.scene.state.vacancy.conditions = ctx.message.text;
    const message = `_Вакансия:_\n*${ctx.scene.state.vacancy.specialist}*\n${ctx.scene.state.vacancy.city}\n${ctx.scene.state.vacancy.salary}\n\n*Опыт работы: *${ctx.scene.state.vacancy.experience}\n\n*Обязанности: *\n${ctx.scene.state.vacancy.responsibilities}\n\n*Требования: *\n${ctx.scene.state.vacancy.requirements}\n\n*Условия: *\n${ctx.scene.state.vacancy.conditions}\n\n*Контакты: *\n${ctx.scene.state.vacancy.fullname}\nTelegram: ${ctx.scene.state.vacancy.username}`;
    await ctx.replyWithMarkdown(message);
    await ctx.telegram.sendMessage(process.env.ADMIN_ID, message,  { parse_mode: 'MarkdownV2'});
    await ctx.replyWithMarkdown("Вакансия отправлена администратору");
    return ctx.scene.enter("menuScene");
})

const vacancyScene = new WizardScene('vacancyScene', specialistHandler, cityHandler, salaryHandler, experienceHandler, responsibilitiesHandler, requirementsHandler, conditionsHandler);
vacancyScene.enter(ctx => {
    ctx.scene.state.vacancy = {};
    return ctx.replyWithMarkdown('Какого специалиста вы ищите?\n_Например, Менеджер по продаже автомобилей_', exitKeyboard)
});

module.exports = vacancyScene;