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
        empty: `#`,
        empty1: ``,
        responsibleGambling: `/ResponsibleGambling`,
        guide: `/Guide`
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
    layout: ['qqClick(ContactInfo.QQ)', 'lineChatClick()', 'FreePlayClick()', 'RegisterClick()', 'qqClick(ContactInfo.QQ)', 'agreement()', 'newsClick($index)', 'closeMarquee()', 'close()', 'onTitleClick(item)', 'newsClick()', 'AgentLoginClick()']
}

/**
 * 把 checkList 裡面的 link 轉成 array
 */
const linkArray = Object.values(checkList.link);

/**
 * 把 checkList 裡面的 ngclick 轉成 array
 */
let ngClickArray = [];
Object.keys(checkList).forEach((key) => {
    if (key !== 'link') {
        ngClickArray = ngClickArray.concat(Object.values(checkList[key]));
    } else if (key === 'layout') {
        ngClickArray = ngClickArray.concat(checkList[key]);
    }
});

export {
    checkList,
    linkArray,
    ngClickArray
}