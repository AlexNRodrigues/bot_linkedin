const puppeteer = require('puppeteer');
const credentials = require('./credentials.json');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/');

    await makeAuth(page);

    await page.waitForNavigation();
    await page.waitForSelector('.search-global-typeahead__input');
    await page.click('.search-global-typeahead__collapsed-search-button');

    await sleep(3000);

    await page.waitForSelector('.search-global-typeahead__input');
    await page.focus('.search-global-typeahead__input');
    await page.keyboard.type('alex nascimento rodrigues');
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    const searchResults = await page.$$('.entity-result');

    for (const searchResult of searchResults) {
        
        const linkUser = await searchResult.$('a');
        if (!linkUser) continue;
        
        const cardUser = await linkUser.$('.search-nec__hero-kcard-v2');
        if (!cardUser) continue;

        const actionButton = await cardUser.$('.search-nec__hero-kcard-v2-actions');
        if (!actionButton) continue;

        const actionButtonDiv = await actionButton.$('div');
        if (!actionButtonDiv) continue;

        const actionButtonDivEntryPoint = await actionButtonDiv.$('.entry-point');
        if (!actionButtonDivEntryPoint) continue;

        const button = await actionButtonDivEntryPoint.$('button');
        if (!button) continue;

        console.log('encontrou botão');

        await button.focus('.artdeco-button');
        await button.click('.artdeco-button__text');

        console.log('click botão');

        const msg = "Olá! está é uma mensagem do experimento 001 utilizando puppeteer para automatizar tarefas no navegador";
        const msg2 = "🎉🎊";

        await sleep(2000);

        await page.keyboard.type(msg);
        await page.keyboard.press('Enter');
        await page.keyboard.type(msg2);

        console.log('msg digitada');

        await page.screenshot({path: 'msg.png'});
        console.log('diga Xiss');
        await sleep(2000);

        await page.focus('.msg-form__send-button');
        console.log("focadão no botão");
        await page.keyboard.press('Enter');
        console.log("msg enviada");

    }

    await browser.close();
})();

async function makeAuth(page) {

    await page.waitForSelector('input[id="session_key"]');
    await page.waitForSelector('input[id="session_password"]');
    await page.waitForSelector('.sign-in-form__submit-button');

    const inputEmail = await page.$('input[id="session_key"]');
    if (!inputEmail) {
        throw new Error('E-mail não encotrado');
    }
    await page.focus('input[id="session_key"]');
    await page.keyboard.type(credentials.user);

    const inputPassword = await page.$('input[id="session_password"]');
    if (!inputPassword) {
        throw new Error('Password não encotrado');
    }
    await page.focus('input[id="session_password"]');
    await page.keyboard.type(credentials.pass);

    await page.click('.sign-in-form__submit-button');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}