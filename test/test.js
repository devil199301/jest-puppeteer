import puppeteer from "puppeteer";
const cheerio = require('cheerio');

const checkList = {
    link: {
        home: `/`,
        board: `/Lobby/Board`,
        live: `/Lobby/Live`,
        sport: `/Lobby/Sport`,
        lottery: `/Lobby/Lottery`,
        slot: `/Lobby/Game`,
        fish: `/Lobby/Fish`,
        promotion: `/Promotion`,
        register: `/Register`,
        mobile: `/Mobile`,
        aboutUS: `/AboutUS`,
        contact: `/Contact`,
        HowDeposit: `/How/Deposit`,
        HowWithdrawal: `/How/Withdrawal`,
        partner: `/Partner`,
        SiteMail: `/SiteMail`,
        BetRecord: `/BetRecord`,
        WithdrawApplication: `/WithdrawApplication`,
        Deposit: `/Deposit`,
        Transaction: `/Transaction`,
        ChangeMoneyPassword: `/Account/ChangeMoneyPassword`,
        ChangePassword: `/Account/ChangePassword`,
        SignOut: `/Account/SignOut`,
        FAQ: `/FAQ`,
        invalid: `javascript:void(0)`,
        empty: `#`
    },
    live: {
        bb: `toBbLive()`,
        ag: `toAgLive()`,
        pt: `toPtLive()`,
        mg: `toMgDealer()`,
        gpi: `toGpiLive()`,
        ab: `toAbLive()`,
        evo: `toEvoLive()`,
        gd: `toGdLive()`,
        sb: `toSunbetLive()`,
        bg: `toBgLive()`,
        ebet: `toEbetLive()`,
        og: `toOgLive()`
    },
    sport: {
        bb: `toBbSport()`,
        saba: `toSabaGame()`,
        hg: `toSingSport()`,
        cmd: `toCmdSport()`,
        im: `toImSport()`,
        ims: `toImsSport()`,
        ibo: `toIboSport()`
    },
    lottery: {
        bb: `toBbLottery()`,
        ig: `toIgLottery()`,
        ig6: `toIgMarkSix()`,
        lx: `toLxLottery()`,
        gpk: `toRgLottery()`,
        vr: `toVrLottery()`
    },
    slot: {
        sg: `toSgFlash()`,
        pt: `toPtFlash()`,
        gpi: `toGpiFlash()`,
        prg: `toPrgFlash()`,
        hb: `toHabaHtml()`,
        ne: `toNetentHtml()`,
        rt: `toRedTigerHtml()`,
        pg: `toPgHtml()`,
        isb: `toIsbHtml()`,
        bb: `toBbGame()`,
        gpk: `toGpkHtml()`,
        mg: `toMgFlash()`,
        ag: `toAgHtml()`,
        gns: `toGnsHtml()`,
        mw: `toMwHtml()`,
        jdb: `toJdbHtml()`,
        cq9: `toCq9Html()`,
        ga: `toGameArtHtml()`,
        lg: `toLgHtml()`,
        pts: `toPtsHtml()`,
        png: `toPngHtml()`,
        fs: `toFsHtml()`,
        fish: `toFish()`,
        kg: `toKgHtml()`
    },
    board: {
        kg: `toKgHtml()`,
        city761: `toCity761Html()`,
        gpk: `toRgBoard()`,
        fg: `toFsBoard()`,
        nw: `toNwBoard()`
    },
    fish: {
        'ag': `toAgFish()`,
        'mw': `toMwFish()`,
        'jdb-dragon': 'toJdbFish()',
        'gns': `toGnsFish()`,
        'pg-all': `toPgFish2()`,
        'bb-expert': `toBbFish()`,
        'pts': `toPtsFish()`,
        'city761': `toCity761Fish()`,
        'fs-thunder': `toFsFishThunder()`,
        'fs-happy': `toFsFishHappy()`,
        'jdb-money': `toJdbFishMoney()`,
        'pt': `toPtFish()`,
        'jdb-dragon2': `toJdbFish2()`,
        'pg-fishking': `toPgFish()`,
        'gpk-tycoon': `toRgFish()`,
        'bb-master': `toBbFish2()`,
        'cq9': `toCq9Fish()`,
        'rg-king': `toRgFish2()`,
        'fs-beauty': `toFsFishBeauty()`,
        'fs-bird': `toFsFishBird()`,
        'fs-everyday': `toFsFishEveryDay()`,
        'gpk-cut': `toRgCutFish()`,
    },
    layout: ['lineChatClick()', 'FreePlayClick()', 'RegisterClick()', 'qqClick(ContactInfo.QQ)', 'agreement()', 'newsClick($index)', 'closeMarquee()', 'close()', 'onTitleClick(item)']
}

/**
 * 把 checkList 裡面的 link 轉成 array
 */
const linkArray = Object.values(checkList.link);

let clickArray = [];
Object.keys(checkList).forEach((key) => {
    if (key !== 'link') {
        clickArray = clickArray.concat(Object.values(checkList[key]));
    } else if (key === 'layout') {
        clickArray = clickArray.concat(checkList[key]);
    }
});

/**
 * 連結
 */
const url = "http://localhost:56873/";
/**
 * 站代號 (目前檢查試玩LOGO用的)
 */
const webname = 'HD002-01';
/**
 * 首頁大廳連結
 */
const homeLobbylink = true;
/**
 * 404 error
 */
const errLoad = [];
/**
 * 存console.log的
 */
const errConsole = [];

/**
 * 有使用到的文案(從footer-nav和sidebar抓)
 */
let unlobby = [];

let page;
let browser;
const width = 1400;
const height = 900;

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
        // const html = await page.content();
        // const $ = cheerio.load(html);
        // const head = $('html').attr('ng-app');
        // expect(head).toBe('portalApp');
    }, 15000);

    // test("Nav連結", async () => {
    //     const html = await page.content();
    //     const $ = cheerio.load(html.replace(/\n/g, ''));
    //     const liList = $('#nav > ul > li');
    //     liList.each((index, element) => {
    //         const target = element['attribs']['data-link'];
    //         for (let i = 0; i < element.children.length; i++) {
    //             if (element.children[i][`type`] === `tag` && element.children[i][`name`] === `a`) {
    //                 const link = element.children[i]['attribs']['href'];
    //                 if (target === undefined) continue
    //                 expect(link).toBe(checkList.link[target]);
    //             }
    //         }
    //     })
    // });

    test("找出全部的 href", async () => {
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const aTagList = $('a[href]');
        aTagList.each((index, element) => {
            if (element.attribs.target === '_blank') return;
            const target = element.attribs.href;
            if (target !== 'javascript:void(0)' && target !== '/Mobile' && !unlobby.includes(target)) unlobby = unlobby.concat(target);
            expect(linkArray).toContain(target);
        })
    }, 15000);

    test("找出全部的 ng-click", async () => {
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const ngClickList = $("[ng-click]");
        ngClickList.each((index, element) => {
            const target = element.attribs['ng-click'];
            if (target.match(/(\w*\s?=\s?\w|qqClick\((\w*.\w*|\d)\)|\w*\=\'\w*\')/g)) return;
            expect(clickArray).toContain(target);
        })
    }, 15000);

    // test("下拉", async () => {
    //     const html = await page.content();
    //     const $ = cheerio.load(html.replace(/\n/g, ''));
    //     const liList = $('#nav > ul > li');
    //     liList.each((index, element) => {
    //         const kind = element['attribs']['data-link'];
    //         for (let i = 0; i < element.children.length; i++) {
    //             if (element.children[i][`name`] === `ol`) {
    //                 for (let j = 0; j < element.children[i].children.length; j++) {
    //                     if (element.children[i].children[j][`name`] === `li`) {
    //                         const target = element.children[i].children[j].attribs['game-box'];
    //                         const link = element.children[i].children[j].attribs['ng-click'];
    //                         if (target === undefined) continue
    //                         expect(link).toBe(checkList[kind][target]);
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // }, 15000);

    // if (homeLobbylink) {
    //     test("首頁大廳連結(GAME-BOX)", async () => {
    //         const html = await page.content();
    //         const $ = cheerio.load(html.replace(/\n/g, ''));
    //         const lobbyList = $('#game-box > li');
    //         lobbyList.each((index, element) => {
    //             const target = element.attribs['data-img'];
    //             for (let i = 0; i < element.children.length; i++) {
    //                 if (element.children[i][`type`] === `tag` && element.children[i][`name`] === `a`) {
    //                     const link = element.children[i]['attribs']['href'];
    //                     expect(link).toBe(checkList.link[target]);
    //                 }
    //             }
    //         })
    //     }, 15000);
    // }

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
    }, 15000);
});

describe("Lobby", () => {
    test("Live", async () => {
        await page.goto(`${url}/Lobby/Live`);
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const list = $('.game-list > li');
        list.each((index, element) => {
            const target = element.attribs['game-box'];
            const click = element.attribs['ng-click'];
            expect(click).toBe(checkList.live[target]);
        });
    }, 15000);

    test("Sport", async () => {
        await page.goto(`${url}/Lobby/Sport`);
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const list = $('.game-list > li');
        list.each((index, element) => {
            const target = element.attribs['game-box'];
            const click = element.attribs['ng-click'];
            expect(click).toBe(checkList.sport[target]);
        });
    }, 15000);

    test("Lottery", async () => {
        await page.goto(`${url}/Lobby/Lottery`);
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const list = $('.game-list > li');
        list.each((index, element) => {
            const target = element.attribs['game-box'];
            const click = element.attribs['ng-click'];
            expect(click).toBe(checkList.lottery[target]);
        });
    }, 15000);
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
    }, 15000);

    test("遊戲登入口", async () => {
        await page.goto(`${url}/Account/LoginToGame`);
        // const imgs = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src')));
    }, 15000);
});

// describe("登入後", () => {
//     test("找出全部的 href", async () => {
//         await page.goto(`${url}?pleaseLogin`);
//         await page.waitFor(20000);
//         await page.goto(`${url}/Deposit`);
//         const html = await page.content();
//         const $ = cheerio.load(html.replace(/\n/g, ''));
//         const aTagList = $('a[href]');
//         aTagList.each((index, element) => {
//             if (element.attribs.target === '_blank') return;
//             const target = element.attribs.href;
//             expect(linkArray).toContain(target);
//         })
//     }, 60000);

//     test("#account Title色碼檢查", async () => {
//         await page.goto(`${url}/WithdrawApplication`);
//         const getTitleColor = await page.evaluate(() => {
//             const title = document.querySelector('.body #title');
//             return getComputedStyle(title)[`background-color`];
//         });
//         expect(getTitleColor).not.toBe('rgb(204, 0, 51)');
//     }, 15000);
// });

describe("內頁", () => {
    test("關於我們", async () => {
        await page.goto(`${url}/AboutUS`);
        const html = await page.content();
        const $ = cheerio.load(html.replace(/\n/g, ''));
        const unlobbyList = $('#sidebar a[href]');
        unlobbyList.each(async (index, element) => {
            const target = element.attribs.href;
            if (target !== 'javascript:void(0)' && target !== '/Mobile' && !unlobby.includes(target)) unlobby = unlobby.concat(target);
        })
    }, 15000);

    test("全部內頁跑一遍", async () => {
        console.log(`全部頁面：${unlobby}`);
        for (let i = 0; i < unlobby.length; i++) {
            await page.goto(`${url}${unlobby[i]}`);
            const html = await page.content();
            const $ = cheerio.load(html);
            const head = $('html').attr('ng-app');
            // expect(head).toBe('portalApp');
        }

    }, 60000);

});

describe("錯誤", () => {
    test("404", async () => {
        expect(errLoad).toEqual([]);
    }, 15000);
    test("ConsoleError", async () => {
        expect(errConsole).toEqual([]);
    }, 15000);
});

afterAll(() => {
    browser.close();
});