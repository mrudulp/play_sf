const { firefox } = require('playwright');
var au = require('autoit');

var sfh = require('../src/sfhelper');
var chatter = require('../src/chatterhelper');
var utils = require('../src/utils');

const chai = require('chai')
const expect = chai.expect
// playwright variables
let page, browser, context


describe('Test SalesForce Chatter Functionality', () => {

    before(async () => {
        // Initialising AutoIt
        au.Init();
        browser = await firefox.launch({ headless: false, slowMo: 50 });
        // Create a context
        context = await browser.newContext({ acceptDownloads: true });
        // browser.ov
        await context.grantPermissions(['notifications'], "https://resourceful-bear-mjuv0o-dev-ed.my.salesforce.com")
    });

    after(async () => {
        await context.close()
        await browser.close();
    });

    beforeEach(async () => {
        // Create a page.
        page = await context.newPage();
        // Login to SF
        await sfh.login(page).catch(error => console.log("Error is::", error));
        await sfh.goToChatter(page);
        let hasChatterFeed = true;
        await chatter.clearChat(page).catch(e => { console.log("Nothing found in chatter ignoring..."); hasChatterFeed = false });
        if (!hasChatterFeed) await page.focus('.feed-content');
    });

    afterEach(async () => {
        await page.close();
        await context.clearCookies();
    });

    it('should attach file & Verify Download', async function () {
        await chatter.shareAttachment(page, au);
        const downloadFileName = await utils.getDownloadFileName(page);
        expect(downloadFileName).to.equal("helloworld.txt");
    });

    it('should add a message with url & verify url on clicking', async function () {
        await chatter.sharegUrl(page);
        const redirectUrl = await utils.getRedirectUrl(page);
        expect(redirectUrl).to.equal("https://www.google.com/");
    });
});