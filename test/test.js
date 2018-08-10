const cheerio = require('cheerio');

import puppeteer from "puppeteer";

import {
    url,
    webname
} from "../setting";

import {
    checkList,
    linkArray,
    ngClickArray
} from '../checkList';

/**
 * 404 error
 */
const errLoad = [];
/**
 * 存console.log的
 */
const errConsole = [];

let page;
let browser;
const width = 1400;
const height = 900;

/**
 * 放網站內所有連結，最後會全部進去一遍
 */
const doCheckLinks = [];

/**
 * 用 cheerio load Html (方便使用 $(selector))
 */
const getCheerioHtml = async () => {
    const html = await page.content();
    return cheerio.load(html.replace(/\n/g, ''))
};

/**  
 *  檢查 href (排除連外 + mobile) 並 push 到 doCheckLinks
 *  @param elementList element陣列
 */
const checkHref = async (elementList) => {
    elementList.each((index, element) => {
        const target = element.attribs.href;
        if (element.attribs.target === '_blank' || target.match(/(^http.*|^javascript|\/Mobile)/g)) return;
        if (!doCheckLinks.includes(target) && target !== `/Account/SignOut`) doCheckLinks.push(target);
        expect(target).toCheckHref(linkArray);
    })
}

// 驗證連結有沒有在預期的清單，主要檢查錯字
expect.extend({
    toCheckHref(received, argument) {
        const pass = argument.includes(received);
        if (pass) {
            return {
                pass: true,
            };
        } else {
            return {
                message: () => `${received} 不在 linkArray 清單內`,
                pass: false,
            };
        }
    },
});

/**  
 *  檢查 ng-click 
 *  @param elementList element陣列
 *  @param kind 類別：live . sport . lottery . slot . board . fish
 */
const checkNgClick = async (elementList, kind) => {
    elementList.each((index, element) => {
        const target = element.attribs['ng-click'];
        if (target.match(/(\w*\s?=\s?\w|lineChatClick\(.+\)|\w*\=\'\w*\')/g)) {
            // console.log(`特殊的 ng-click : "${target}"`);
            return
        };
        if (kind) {
            expect(target).toCheckNgClick(Object.values(checkList[kind]));
        } else {
            expect(target).toCheckNgClick(ngClickArray);
        }
    })
}

// 驗證連結有沒有在預期的清單，主要檢查錯字
expect.extend({
    toCheckNgClick(received, argument) {
        const pass = argument.includes(received);
        if (pass) {
            return {
                pass: true,
            };
        } else {
            return {
                message: () => `${received} 不在 ngClickArray 清單內`,
                pass: false,
            };
        }
    },
});

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        args: [`--window-size=${width},${height}`]
    });
    page = await browser.newPage();
    page.on('console', msg => {
        if (msg._type === 'error' && !errConsole.includes(msg._text)) {
            errConsole.push(msg._text);
        }
    });
    page.on('response', response => {
        if (response._status === 404 && !errLoad.includes(`404 :: ${response._url}`)) {
            errLoad.push(`404 :: ${response._url}`);
        }
    });
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
    });
    await page.setViewport({
        width,
        height
    });
});

describe("開啟網頁", async () => {
    test("連線", async () => {
        await page.goto(url);
        const $ = await getCheerioHtml();
        const head = $('html').attr('ng-app');
        expect(head).toBe('portalApp');
    }, 20000);

    test("找出全部的 href 並檢查是否正確", async () => {
        const $ = await getCheerioHtml();
        const aTagList = $('a[href]');
        await checkHref(aTagList);
    }, 20000);

    test("找出全部的 ng-click", async () => {
        const $ = await getCheerioHtml();
        const ngClickList = $("[ng-click]");
        await checkNgClick(ngClickList);
    }, 20000);

    test("ng-href 前後比對", async () => {
        // 取網頁原始碼(render前))
        const response = await page.goto(url);
        const content = await response.text();
        // 取所有ng-href
        const nghrefArray = content.match(/ng-href="{{.*}}"/g);
        // 把擷取 ng-href 內容
        for (let i = 0; i < nghrefArray.length; i++) {
            const content = nghrefArray[i].match(/\w*\.\w*/g);
            expect(content[0]).toBe(content[1]);
        }
    }, 20000);
});

describe("Lobby", async () => {

    test("Game", async () => {
        await page.goto(`${url}/Lobby/Game`);
        const $ = await getCheerioHtml();
        const ngClickList = $('#lobby [ng-click]');
        await checkNgClick(ngClickList, `slot`);
    }, 20000);

    test("Live", async () => {
        await page.goto(`${url}/Lobby/Live`);
        const $ = await getCheerioHtml();
        const ngClickList = $('#lobby [ng-click]');
        await checkNgClick(ngClickList, `live`);
    }, 20000);

    test("Sport", async () => {
        await page.goto(`${url}/Lobby/Sport`);
        const $ = await getCheerioHtml();
        const ngClickList = $('#lobby [ng-click]');
        await checkNgClick(ngClickList, `sport`);
    }, 20000);

    test("Lottery", async () => {
        await page.goto(`${url}/Lobby/Lottery`);
        const $ = await getCheerioHtml();
        const ngClickList = $('#lobby [ng-click]');
        await checkNgClick(ngClickList, `lottery`);
    }, 20000);
});

describe("Logo", () => {
    test("試玩", async () => {
        await page.goto(`${url}/Trial/Apply`);
        const getLogoUrl = await page.evaluate(() => {
            const title = document.querySelector('#trial-logo');
            return getComputedStyle(title)[`background-image`];
        });
        const LogoUrl = getLogoUrl.match(/[A-Z]{2}[\d]{3}-[\d]{2}/g);
        expect(LogoUrl[0]).toBe(webname);
    }, 20000);

    test("遊戲登入口", async () => {
        await page.goto(`${url}/Account/LoginToGame`);
        // const imgs = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src')));
    }, 20000);
});

// describe("登入後", () => {
//     test("找出全部的 href", async () => {
//         await page.goto(`${url}?pleaseLogin`);
//         await page.waitFor(20000);
//         const $ = await getCheerioHtml();
//         const aTagList = $('a[href]');
//         await checkHref(aTagList);
//     }, 60000);

//     test("#account Title色碼檢查", async () => {
//         await page.goto(`${url}/WithdrawApplication`);
//         const getTitleColor = await page.evaluate(() => {
//             const title = document.querySelector('.body #title');
//             return getComputedStyle(title)[`background-color`];
//         });
//         expect(getTitleColor).not.toBe('rgb(204, 0, 51)');
//     }, 20000);
// });

// describe("內頁", () => {
//     test("關於我們", async () => {
//         await page.goto(`${url}/AboutUS`);
//         const $ = await getCheerioHtml();
//         const aTagList = $('a[href]');
//         await checkHref(aTagList);
//     }, 20000);

//     test("全部內頁跑一遍", async () => {
//         console.log(`全部頁面：${doCheckLinks}`);
//         // for (let i = 0; i < doCheckLinks.length; i++) {
//         //     await page.goto(`${url}${doCheckLinks[i]}`);
//         //     await page.waitFor(500);
//         // }
//     }, 1000000);
// });

// describe("錯誤", () => {
//     test("404", async () => {
//         expect(errLoad).toEqual([]);
//     }, 15000);
//     test("ConsoleError", async () => {
//         expect(errConsole).toEqual([]);
//     }, 15000);
// });

afterAll(() => {
    browser.close();
});