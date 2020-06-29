/**
 * Gets Downloaded File name.
 *
 * @param {Page} page Page Object
 * @returns {string}
 */
async function getDownloadFileName(page) {
    const [download] = await Promise.all([
        page.waitForEvent('download'), // <-- start waiting for the download
        page.click('div.slds-button.slds-button--icon.slds-button--icon-x-small') // <-- perform the action that directly or indirectly initiates it.
    ]);
    return download.suggestedFilename();
}

/**
 * Gets Redirect Url after url is clicked in chatter
 *
 * @param {Page} page Page Object
 * @returns {string}
 */
async function getRedirectUrl(page) {
    const ahandle = await page.$('a[href="https://www.google.com"]');
    const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        await page.click('a[href="https://www.google.com"]') // Triggers a navigation after a timeout.
    ]);
    return await newPage.evaluate('location.href');
}

module.exports.getDownloadFileName = getDownloadFileName;
module.exports.getRedirectUrl = getRedirectUrl;