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
        mobile: `/Mobile`
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
        gpk: `toRgBoard()`
    }
}

/**
 * 連結
 */
const url = "http://localhost:56873/";
/**
 * 站代號 (目前檢查試玩LOGO用的)
 */
const webname = 'AR012-01';
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

let page;
let browser;
const width = 1400;
const height = 900;

const getHtmlContent = async() => {

}

beforeAll(async() => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        args: [`--window-size=${width},${height}`]
    });
    page = await browser.newPage();
    page.on('console', msg => {
        if (msg._type === 'error') {
            errConsole.push(msg._text);
        }
    });
    page.on('response', response => {
        if (response._status === 404) {
            errLoad.push(`404 :: ${response._url}`);
        }
    });
    await page.setViewport({
        width,
        height
    });
});

describe("開啟網頁", async() => {
    test("連線", async() => {
        await page.goto(url);
        const html = await page.content();
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
    // });

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
    //     });
    // }

    //TODO: ng-href 檢查 
    test("a tag", async() => {
        const response = await page.goto(url);
        const content = await response.text();
        const nghref = /ng-href="{{\w*.\w*==''\?\ '#': \w*.\w*}}"/g;
        const nghrefArray = content.match(nghref);

        
        console.log(nghrefArray);
    });
});

// describe("Lobby", () => {
//     test("Live", async () => {
//         await page.goto(`${url}/Lobby/Live`);
//         const html = await page.content();
//         const $ = cheerio.load(html.replace(/\n/g, ''));
//         const list = $('.game-list > li');
//         list.each((index, element) => {
//             const target = element.attribs['game-box'];
//             const click = element.attribs['ng-click'];
//             expect(click).toBe(checkList.live[target]);
//         });
//     });

//     test("Sport", async () => {
//         await page.goto(`${url}/Lobby/Sport`);
//         const html = await page.content();
//         const $ = cheerio.load(html.replace(/\n/g, ''));
//         const list = $('.game-list > li');
//         list.each((index, element) => {
//             const target = element.attribs['game-box'];
//             const click = element.attribs['ng-click'];
//             expect(click).toBe(checkList.sport[target]);
//         });
//     });

//     test("Lottery", async () => {
//         await page.goto(`${url}/Lobby/Lottery`);
//         const html = await page.content();
//         const $ = cheerio.load(html.replace(/\n/g, ''));
//         const list = $('.game-list > li');
//         list.each((index, element) => {
//             const target = element.attribs['game-box'];
//             const click = element.attribs['ng-click'];
//             expect(click).toBe(checkList.lottery[target]);
//         });
//     });
// });

// describe("試玩", () => {
//     test("Logo", async () => {
//         await page.goto(`${url}/Trial/Apply`);
//         const logo = await page.evaluate(() => {
//             const title = document.querySelector('#trial-logo');
//             return getComputedStyle(title)[`background-image`];
//         });
//         const checkUrl = logo.search(webname);
//         expect(checkUrl).not.toBe(-1);
//     });
// });

// describe("錯誤", () => {
//     test("沒有404", async () => {
//         expect(errLoad).toEqual([]);
//     });
//     test("沒有ConsoleError", async () => {
//         expect(errConsole).toEqual([]);
//     });
// });

afterAll(() => {
    browser.close();
});