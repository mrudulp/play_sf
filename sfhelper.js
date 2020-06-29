// const { firefox } = require('playwright');
// var au = require('autoit');

/**
 * Logs in to Salesforce.
 * It reads SalesForce URL, USERNAME & PASSWORD from env variable
 *
 * @param {Page} page Page Object
 */
async function login(page) {
    const username = process.env.SFUSERNAME
    const password = process.env.SFPASSWORD
    const sf_playgnd_url = process.env.SFURL
    await page.goto(sf_playgnd_url);
    await page.fill('#username',username);
    await page.fill('#password',password);
    await page.click('input#Login');
}


/**
 * Go to Chatter
 *
 * @param {Page} page Page Object
 */
async function goToChatter(page) {
    await page.click('a[title*="Chatter"]');
    await page.waitForSelector('div.feed-content');
}

module.exports.login = login;
module.exports.goToChatter = goToChatter;