// const playwright = require('playwright')
const { firefox } = require('playwright');
var au = require('autoit');
const chai = require('chai')
const expect = chai.expect
// playwright variables
let page, browser, context


describe('Test SalesForce Chatter Functionality', () => {

    before(async () => {
        // Initialising AutoIt
        au.Init();
        // const browser = await chromium.launch({ headless: false, slowMo:50,  devtools: true});
        // browser = await firefox.launch({ headless: false, slowMo: 50 });
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
        // let isLogged = true;
        // Create a page.
        page = await context.newPage();
        // Login to SF
        await login(page).catch(error => console.log("Error is::", error));
    });

    afterEach(async () => {
        await page.close();
        await context.clearCookies();
    });

    async function login(page) {
        // const sf_playgnd_url = "https://resourceful-bear-mjuv0o-dev-ed.lightning.force.com/lightning/page/home"
        const sf_playgnd_url = "https://resourceful-bear-mjuv0o-dev-ed.my.salesforce.com/0052o000009KWCN?noredirect=1&isUserEntityOverride=1";
        await page.goto(sf_playgnd_url);
        // await page.waitForSelector('text=Home');
        await page.fill('#username', 'mrudulpen@resourceful-bear-mjuv0o.com');
        await page.fill('#password', 'Salesforce2020');
        await page.click('input#Login');
    }

    function uploadFile() {
        const uploadfile = " C:\\Users\\MrudulPendharkar\\devel\\devspace\\js\\playwright\\hellow\\helloworld.txt";
        au.WinWait("File Upload");
        au.Send(uploadfile);
        au.Send("{ENTER}");
    }

    async function shareAttachment(page) {
        await page.click("button[title='Share']");
        await page.evaluate(() => console.log('Editor is ${"div.ql-editor"}'));
        await page.click('div.ql-editor');
        await page.$eval('div.ql-editor', el => { return el.innerText = 'this is attachment message' });
        await page.click('li.cuf-attachmentsItem');
        await page.click('button.attachButton');
        uploadFile();
        await page.click('button.cuf-publisherShareButton');
    }

    async function sharegUrl(page) {
        // const gurl =;
        await page.click("button[title='Share']");
        // await page.evaluate(() => console.log('Editor is ${"div.ql-editor"}'));
        await page.click('div.ql-editor');
        await page.$eval('div.ql-editor', el => { return el.innerText = "https://www.google.com" });
        await page.click('button.cuf-publisherShareButton');
        await page.screenshot({ path: `url.png` });
    }

    async function getRedirectUrl(page) {
        const ahandle = await page.$('a[href="https://www.google.com"]');
        const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            await page.click('a[href="https://www.google.com"]') // Triggers a navigation after a timeout.
        ]);
        return await newPage.evaluate('location.href');
    }

    async function goToChatter(page) {
        await page.click('a[title*="Chatter"]');
        await page.waitForSelector('div.feed-content');
    }

    async function clearChat(page) {
        await page.click('div.cuf-feedItemActionTrigger')
        await page.click('text=Delete');
        await page.click('button[title="Delete"]')
    }

    async function getDownloadFileName(page) {
        const [download] = await Promise.all([
            page.waitForEvent('download'), // <-- start waiting for the download
            page.click('div.slds-button.slds-button--icon.slds-button--icon-x-small') // <-- perform the action that directly or indirectly initiates it.
        ]);
        // const path = await download.path();
        return download.suggestedFilename();

        // console.log("Path::", path);
        // console.log("filename::", download.suggestedFilename());
        // console.log('url::' + download.url());
    }

    it('should attach file & Verify Download', async function () {
        // go to chatter and do actions there
        await goToChatter(page);
        await clearChat(page).catch(e => console.log("Nothing found in chatter ignoring..."));
        await shareAttachment(page);
        const downloadFileName = await getDownloadFileName(page);
        expect(downloadFileName).to.equal("helloworld.txt");
    });

    it('should add a message with url & verify url on clicking', async function () {
        await goToChatter(page);
        await clearChat(page).catch(e => console.log("Nothing found in chatter ignoring..."));
        await sharegUrl(page);
        const redirectUrl = await getRedirectUrl(page);
        expect(redirectUrl).to.equal("https://www.google.com/");
    });
});