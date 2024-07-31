const {chromium} = require("playwright");
async function main() {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const executionTimeout = 300000;
    let timeoutId;
    let keyword= [
        "maison à vendre djerba titre bleu"
        // ,"maison à vendre djerba pas cher","maison à vendre hammamet pas cher","houni annonce immobilière","Appartements à EL Haouaria","Appartements meublés et climatisés à Louer à EL Haouaria",
        // "immobilier sousse"
    ];
    let location = ["Tunis", "Ariana", "La Marsa, Tunis", "Manouba", "Monastir","Sfax"]
    try {
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });
        timeoutId = setTimeout(async () => {
            await browser.close();
            console.log("Bot execution timed out");
            process.exit(0); // Exit the process with an error code
        }, executionTimeout);
        await page.goto('https://www.google.com');
        const randomLocation = await randomizer(location);
        const randomKeyword = await randomizer(keyword);
        await page.type('#APjFqb', randomKeyword);
        await page.press('#APjFqb', 'Enter');
        await page.waitForSelector('.g');
        await page.waitForTimeout(4000);
        async function scrollToBottom() {
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 300;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeight || totalHeight >= 10000) {
                            clearInterval(timer);
                            resolve();
                        }}, 1000);
                });});}

        let previousHeight = 0;
        let currentHeight = 0;
        do {
            previousHeight = currentHeight;
            await scrollToBottom();
            await page.waitForSelector('div.MjjYud');
            currentHeight = await page.evaluate(() => document.body.scrollHeight);
        } while (currentHeight > previousHeight);

        const linksToHouniTn = await page.$$('div.MjjYud a[href*="https://houni.tn"]');
        if (linksToHouniTn.length === 0) {
            await page.fill('#APjFqb', '');
            await page.type('#APjFqb', randomKeyword + ' houni');
            await page.press('#APjFqb', 'Enter');
            await page.waitForSelector('div.g');
            const searchResults = await page.$$('div.MjjYud a[href*="https://houni.tn"]');
            if (searchResults.length > 0) {
                await searchResults[0].click();
                await page.waitForTimeout(1000);
            }
        }
        else{
            await linksToHouniTn[0].click();
            await page.waitForTimeout(1000)
        }
        if (!await page.$('#__layout > div > div > div > section > div > div.gallery > div:nth-child(1)')&& page.url() !== 'https://houni.tn/en') {
            await scrollToBottom();
            await page.goto('https://houni.tn/immobiliers/location?categories=0&categories=1&viewType=gallery');
            await page.waitForTimeout(2000);
            await performActionsOnGalleryPage(page,executionTimeout);
        }
        if (!await page.$('#__layout > div > div > div > section > div > div.gallery > div:nth-child(1)')&& page.url() === 'https://houni.tn/en') {
            await page.goto('https://houni.tn');
            await page.waitForTimeout(2000);
            await scrollToBottom();
            await page.click('#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-8-desktop.is-8-tablet.is-12-mobile.pb-0 > div > div > div.multiselect__tags > span');
            await page.type('#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-8-desktop.is-8-tablet.is-12-mobile.pb-0 > div > div > div.multiselect__tags',randomLocation);
            await page.keyboard.press('Enter');
            await page.click('#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-4-desktop.is-4-tablet.is-12-mobile.pb-0 > div > div.dropdown-trigger > button > span:nth-child(1) > div')
            const button=["#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-4-desktop.is-4-tablet.is-12-mobile.pb-0 > div > div.dropdown-menu > div > div > div > section > section > div > div > div > div:nth-child(1)","#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-4-desktop.is-4-tablet.is-12-mobile.pb-0 > div > div.dropdown-menu > div > div > div > section > section > div > div > div > div:nth-child(2)","#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-4-desktop.is-4-tablet.is-12-mobile.pb-0 > div > div.dropdown-menu > div > div > div > section > section > div > div > div > div:nth-child(3)"];
            await page.click(button[Math.floor(Math.random() * button.length)]);
            await page.waitForTimeout(2000);
            await page.click('#__layout > div > div > section.banner.hero.is-fullheight-with-navbar > div > div > div > div > div > div.column.is-full.is-full-mobile.container.has-background-white.has-rounded-border > div > div.column.is-4-desktop.is-4-tablet.is-12-mobile.pb-0 > div > div.dropdown-menu > div > div > div > footer > button')
            await page.click('#landing\\.search\\.apply')
            await page.waitForTimeout(2000);
            await performActionsOnGalleryPage(page,executionTimeout);
        }
        else {
            await performActionsOnGalleryPage(page,executionTimeout);
        }
        clearTimeout(timeoutId);
        await page.waitForTimeout(2000);
        process.exit(0);
    } catch (err) {
        clearTimeout(timeoutId);
        let e = err.stack;
        console.log(e)
        process.exit(0);
    }
}

async function performActionsOnGalleryPage(page) {
    let continueLoop = true;
    const maxLocationAttempts = 3;
    const location=await randomizer("Tunis", "Ariana", "La Marsa, Tunis", "Manouba", "Monastir","Sfax");
    let runLocationAttempts = false;

    async function runLocationAttemptsFunction() {
        let locationAttempts = 0;
        while (locationAttempts < maxLocationAttempts) {
            let location = await randomizer("Tunis", "Ariana", "La Marsa, Tunis", "Manouba", "Monastir","Sfax");
            await page.click('#__layout > div > div > div > div.navsearch.is-flex > div.collapse > div.collapse-content > div > div.column.px-0.is-12-mobile.is-12-tablet.is-5-desktop > div > div.column.is-7-desktop > div > div > div > div.multiselect__tags');
            await page.type('#__layout > div > div > div > div.navsearch.is-flex > div.collapse > div.collapse-content > div > div.column.px-0.is-12-mobile.is-12-tablet.is-5-desktop > div > div.column.is-7-desktop > div > div > div > div.multiselect__tags', location);
            await page.press('#__layout > div > div > div > div.navsearch.is-flex > div.collapse > div.collapse-content > div > div.column.px-0.is-12-mobile.is-12-tablet.is-5-desktop > div > div.column.is-7-desktop > div > div > div > div.multiselect__tags', 'Enter');
            console.log("selectedLocation", location);
            locationAttempts++;
            if (locationAttempts == 1) {
                break;
            }
        }
    }

    while (continueLoop) {

        const scrollDirection = Math.random() < 0.5 ? -1 : 1;
        const scrollDistance = Math.floor(Math.random() * 500) + 1;
        await page.evaluate(({ scrollDirection, scrollDistance }) => {
            window.scrollBy(0, scrollDirection * scrollDistance);
        }, { scrollDirection, scrollDistance });

        const maxDivCount = 20;
        const randomDivIndex = Math.floor(Math.random() * maxDivCount) + 1;
        const divSelector = `#__layout > div > div > div > section > div > div.gallery > div:nth-child(${randomDivIndex})`;
        await page.waitForTimeout(3000);

        if (!await page.$(divSelector)) {
            continueLoop = false;
            break;
        }

        await page.click(divSelector);
        await page.waitForTimeout(3000);

        await page.evaluate(() => window.scrollBy(0, 500));
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollBy(0, -500));
        await page.waitForTimeout(1000);

        await page.click('#name');
        await page.waitForTimeout(1000);
        await page.click('#email');
        await page.waitForTimeout(1000);
        await page.click('#phone');
        await page.waitForTimeout(1000);
        await page.click('#__layout > div > div > section > div.container > div.columns.is-multiline > div.singlePageUser.column.is-one-third-desktop.is-full-tablet.is-full-mobile > div > div.column.info > div.subtitle.is-size-6 > a');
        await page.waitForTimeout(1000);
        await page.click('#__layout > div > div > section > div.container > div.columns.is-multiline > div.singlePageUser.column.is-one-third-desktop.is-full-tablet.is-full-mobile > div > div.loginModal > div > div.animation-content > div > div > button');

        await page.goBack();

        if (!runLocationAttempts) {
            runLocationAttempts = true;
            setTimeout(runLocationAttemptsFunction, 60000);
        }
        if (!(await page.evaluate(() => document.body))) {
            continueLoop = false;
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
}
async function randomizer(data) {
    let array = data;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
main();