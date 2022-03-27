// ==UserScript==
// @name         open the link directly
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  点击链接直接跳转
// @author       nediiii
// @match        *://*.csdn.net/*
// @match        *://*.gitee.com/*
// @match        *://*.uisdc.com/*
// @match        *://*.logonews.cn/*
// @match        *://*.afdian.net/*
// @match        *://*.tianyancha.com/*
// @match        *://*.oschina.net/*
// @match        *://*.pixiv.net/*
// @match        *://*.jianshu.com/*
// @match        *://*.juejin.cn/*
// @match        *://*.weibo.cn/*
// @match        *://*.yuque.com/*
// @match        *://*.segmentfault.com/*
// @match        *://*.zhihu.com/*
// @license      GPLv3 License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const urlReg = /\bhttps?:\/\/\S+/gi;

    const weiboResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status == 200) {
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > div > div:nth-child(2)');
                        let str = node.innerText;
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });

                        let realURI = href;
                        var extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                        resolve(realURI)
                    } else {
                        reject(href)
                    }
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const segfaultResolver = async (href) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: href,
                onload: function (response) {
                    console.log({ response });
                    if (response.status == 200) {
                        let doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let node = doc.querySelector('body > p')
                        let str = node.innerText;
                        console.log({ doc });
                        console.log({ node });
                        console.log({ str });

                        let realURI = href;
                        var extractURL = str.match(urlReg);
                        console.log({ extractURL });
                        if (extractURL) {
                            realURI = extractURL[0];
                        }
                        resolve(realURI)
                    } else {
                        reject(href)
                    }
                },
                onerror: function (error) {
                    console.log({ error });
                    reject(href)
                }
            });
        });
    }

    const patter_match = {

        // 注意这里的pattern需要去看对应网站dom里的a标签的实际herf值, console也会打印日志, 可以自己添加正则来增加网站支持
        // https://link.zhihu.com/?target=https%3A//greasyfork.org/en/scripts/5029-yet-another-%25E8%2587%25AA%25E5%258F%25A4cb%25E5%2587%25BA%25E8%25AF%2584%25E8%25AE%25BA-sharing-plugin
        zhihu: { pattern: /https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/ },
        // https://www.jianshu.com/go-wild?ac=2&url=https%3A%2F%2Fnpm.taobao.org%2Fmirrors%2Felectron
        jianshu: { pattern: /https?:\/\/www\.jianshu\.com\/go-wild\?.*url=(.+)$/ },
        // https://links.jianshu.com/go?to=https%3A%2F%2Fnpm.taobao.org%2Fmirrors%2Felectron
        jianshu2: { pattern: /https?:\/\/links\.jianshu\.com\/go\?to=(.+)$/ },
        // href="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.aliyun.com%2Fgroup%2Falisoftwaretech%2F"
        juejin: { pattern: /https?:\/\/link\.juejin\.cn\/?\?target=(.+)$/ },

        // https://gitee.com/meetqy/acss-dnd
        // href="https://gitee.com/link?target=https%3A%2F%2Fcuyang.me%2Facss-dnd%2F"
        gitee: { pattern: /https?:\/\/gitee\.com\/link\?target=(.+)$/ },

        // https://www.uisdc.com/build-b-end-grid-system
        // https://link.uisdc.com/?redirect=https%3A%2F%2Fuxdesign.cc%2Fresponsive-grids-and-how-to-actually-use-them-970de4c16e01
        uisdc: { pattern: /https?:\/\/link\.uisdc\.com\/?\?redirect=(.+)$/ },

        // https://www.logonews.cn/apple-sues-sex-topic-blog-for-logo-infringement.html
        // https://link.logonews.cn/?url=http://aasd.k12.wi.us/district
        logonews: { pattern: /https?:\/\/link\.logonews\.cn\/?\?url=(.+)$/ },

        // https://afdian.net/@AdventCirno
        // https://afdian.net/link?target=https%3A%2F%2Fwww.patreon.com%2Fuser%3Fu%3D6139561
        afdian: { pattern: /https?:\/\/afdian\.net\/link\?target=(.+)$/ },

        // https://www.tianyancha.com/company/28723141
        // https://www.tianyancha.com/security?target=https%3A%2F%2Fss.knet.cn%2Fverifyseal.dll%3Fsn%3De18042711010873571xsuv000000%26pa%3D111332
        tianyancha: { pattern: /https?:\/\/www\.tianyancha\.com\/security\?target=(.+)$/ },

        // https://www.pixiv.net/users/25237
        // href="/jump.php?url=https%3A%2F%2Ftwitter.com%2Fomiya_io"
        // href="/jump.php?https%3A%2F%2Finstagram.com%2Fsnatti89%2F"
        pixiv: { pattern: /\/jump\.php\?(?:url=)?(.+)$/ },

        // https://my.oschina.net/androiddevs/blog/5496556
        // https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzk0NDIwMTExNw%3D%3D%26action%3Dgetalbum%26album_id%3D1879128471667326981%23wechat_redirect
        // href="https://www.oschina.net/action/GoToLink?url=https%3A%2F%2Fmp.weixin.qq.com%2Fmp%2Fappmsgalbum%3F__biz%3DMzk0NDIwMTExNw%3D%3D%26action%3Dgetalbum%26album_id%3D1879128471667326981%23wechat_redirect"
        oschina: { pattern: /https?:\/\/www\.oschina\.net\/action\/GoToLink\?url=(.+)$/ },

        // https://weibo.cn/sinaurl?u=https%3A%2F%2Fwww.freebsd.org%2F
        // https://weibo.cn/sinaurl?toasturl=https%3A%2F%2Ftime.geekbang.org%2F
        // https://weibo.cn/sinaurl?luicode=10000011&lfid=230259&u=http%3A%2F%2Ft.cn%2FA6qHeVlf
        // https://weibo.cn/sinaurl?f=w&u=http%3A%2F%2Ft.cn%2FA66XY2gI&ep=LlAsNz3HD%2C1683963007%2CLlpkandl6%2C7276218544
        // href="https://weibo.cn/sinaurl?f=w&u=http%3A%2F%2Ft.cn%2FA66XY2gI&ep=LlAsNz3HD%2C1683963007%2CLlpkandl6%2C7276218544"
        weibo: { pattern: /https?:\/\/weibo\.cn\/sinaurl\?f=w&u=(.+)$/, resolver: weiboResolver },

        // segmentfault对链接进行加密处理, 不知道如何decode, 所以只能写一个函数去单独处理
        // https://link.segmentfault.com/?enc=LZyRulLABKpXOHl2vbA%2F4w%3D%3D.MWhFMvjhyBk1ReIRoGxyxa0VxGtg%2Foyk0DMtfzZTJoKbsgoJFtGCPHe8%2BZ1HbRdcvNsGaVfll9oGQXLsZCHK7w%3D%3D
        segfault: { pattern: /https?:\/\/link\.segmentfault\.com\/?\?enc=(.+)$/, resolver: segfaultResolver }

        // 以下网站a标签的herf未修改, 推测是js做的弹窗, 所以不需要匹配, 也匹配不出来
        // csdn https://link.csdn.net/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FRegExp
        // 语雀 https://www.yuque.com/r/goto?url=https%3A%2F%2Fwww.canva.cn%2F
    }

    const resolveRealURI = async (href) => {
        const fallbackURI = href;

        for (let i in patter_match) {
            const matcher = href.match(patter_match[i].pattern);
            if (!matcher) {
                continue;
            }
            console.log({ matcher });

            if (patter_match[i].hasOwnProperty('resolver')) {
                // complex customize resolver
                console.log(patter_match[i].resolver)
                let realURI = await patter_match[i].resolver(href);
                return realURI;
            }

            const encodeURI = matcher[1];
            // simple reg resolver
            return decodeURIComponent(encodeURI);
        }
        return fallbackURI;
    }

    const getHref = (e) => {
        let target = e.target;
        while (target) {
            if (target.tagName.toLowerCase() === 'a' && target.hasAttribute('href')) {
                console.log("find element", { target })
                return target.getAttribute('href');
            }
            target = target.parentElement;
        }
        return null;
    }

    document.addEventListener('click', (e) => {
        console.log({ e })
        let href = getHref(e);
        if (href) {
            e.stopPropagation();
            e.preventDefault();
            resolveRealURI(href).then((realURI) => {
                console.log({ realURI })
                window.open(realURI);
            });
        }
    }, { capture: true })


})();
