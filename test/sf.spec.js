const { firefox } = require('playwright');
var au = require('autoit');

var sfh =require('../sfhelper');
var chatter = require('../chatterhelper');
var utils = require('../utils');

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
    });

    afterEach(async () => {
        await page.close();
        await context.clearCookies();
    });

    it('should attach file & Verify Download', async function () {
        // go to chatter and do actions there
        const uploadFileName =  " C:\\Users\\MrudulPendharkar\\devel\\devspace\\js\\playwright\\hellow\\helloworld.txt";
        await sfh.goToChatter(page);
        await chatter.clearChat(page).catch(e => console.log("Nothing found in chatter ignoring..."));
        await chatter.shareAttachment(page, au);
        const downloadFileName = await utils.getDownloadFileName(page);
        expect(downloadFileName).to.equal("helloworld.txt");
    });

    it('should add a message with url & verify url on clicking', async function () {
        await sfh.goToChatter(page);
        await chatter.clearChat(page).catch(e => console.log("Nothing found in chatter ignoring..."));
        await chatter.sharegUrl(page);
        const redirectUrl = await utils.getRedirectUrl(page);
        expect(redirectUrl).to.equal("https://www.google.com/");
    });
});