const fs = require("fs");
const puppeteer = require("puppeteer");

/**
 * Add website URL to get cookies
 */
let url = "https://www.interviewbit.com/es6-interview-questions/#es6-features";
let interval = 1500; // in seconds
/**
 * 1s = 1000;
 * 1min = 1000 * 60
 * 5min - 1000 * 60 * 5
 */

getCookies(url); // for first time we need to call this function

/**
 * It will call getCookies function after given interval
 */
let id = setInterval(() => {
    getCookies(url);
}, interval);

/**
 * @param {string} url
 * @returns {boolean} promise
 */
async function getCookies(url) {
    try {
        console.log("fetching cookies...");
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();

        await page.goto(url); // it will visite given url

        const cookies = await page.cookies();

        if (cookies) {
            // console.log("Cookies", cookies);
            await writeFileToJson(cookies);
        }
        await browser.close();
        console.log("Cookies stored successfully");
        return true;
    } catch (err) {
        console.log("Something went wrong", err);
        return false;
    }
}

/**
 * @param {Array of object} data
 */
async function writeFileToJson(data) {
    let date = new Date();
    let payload = {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        cookies: data,
    };

    //check if file exist
    if (!fs.existsSync("cookies.json")) {
        //create new file if not exist
        fs.closeSync(fs.openSync("cookies.json", "w"));
    }

    const file = fs.readFileSync("cookies.json");

    //check if file is empty
    if (file.length == 0) {
        //add data to json file
        fs.writeFileSync("cookies.json", JSON.stringify([payload]));
    } else {
        const oldData = JSON.parse(file.toString());

        //append data to json file
        oldData.push(payload);

        //add oldData element to json object/file
        fs.writeFileSync("cookies.json", JSON.stringify(oldData));
    }
}
