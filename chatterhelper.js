/**
 * Uploads a local file using AutoIt apis
 * (Known Issue: AutoIt is sometimes too eager to type and as a result keys in text even before dialog is ready for the keyboard input.
 * This causes partial path field leading to error)
 * @param {string} uploadFileName Full path of filename that needs to be uploaded
 * @param {AutoIt} au AutoIt handle
 *
 */
function uploadFile(uploadFileName,au) {
    const uploadfile = uploadFileName;
    au.WinWait("File Upload");
    au.Send(uploadfile);
    au.Send("{ENTER}");
}

/**
 * Share Attachment in chatter after file is uploaded
 * It read environment variable UPLOADFILENAME to find the full path of filename to be uploaded
 *
 * @param {Page} page Page Object
 * @param {AutoIt} au AutoIt handle
 */
async function shareAttachment(page, au) {
    await page.click("button[title='Share']");
    await page.evaluate(() => console.log('Editor is ${"div.ql-editor"}'));
    await page.click('div.ql-editor');
    await page.$eval('div.ql-editor', el => { return el.innerText = 'this is attachment message' });
    await page.click('li.cuf-attachmentsItem');
    await page.click('button.attachButton');
    const uploadFileName = process.env.UPLOADFILENAME
    uploadFile(uploadFileName, au);
    await page.click('button.cuf-publisherShareButton');
}

/**
 * Share Url in chatter text
 *
 * @param {Page} page Page Object
 */
async function sharegUrl(page) {
    await page.click("button[title='Share']");
    await page.click('div.ql-editor');
    await page.$eval('div.ql-editor', el => { return el.innerText = "https://www.google.com" });
    await page.click('button.cuf-publisherShareButton');
}

/**
 * Clear existing Chat message.
 * Note: Does not clear all messages but just recent one
 * (Known Issue: Assumes atleast one chat message is present.)
 *
 * @param {Page} page Page Object
 */
async function clearChat(page) {
    await page.click('div.cuf-feedItemActionTrigger')
    await page.click('text=Delete');
    await page.click('button[title="Delete"]')
}

module.exports.uploadFile = uploadFile;
module.exports.shareAttachment = shareAttachment;
module.exports.sharegUrl = sharegUrl;
module.exports.clearChat = clearChat;