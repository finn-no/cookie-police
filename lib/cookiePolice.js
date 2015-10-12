export const BROWSER_SUPPORT = (function testSupport () {
    if (!Object.getOwnPropertyDescriptor || !Object.defineProperty) { return false; }
    let desc = getCookieDesc();
    return desc && typeof desc.get === 'function' && typeof desc.set === 'function' && desc.configurable;
})();
const ERR_PREFIX = 'Cookie Police \uD83D\uDC6E ';

function getCookieDesc () {
    return Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
}

function arrayContains (array, value) {
    return Array.isArray(array) && array.indexOf(value) !== -1;
}

export default function ({whiteList = [], ignoreList = []} = {}) {
    if (!BROWSER_SUPPORT) { return false; }
    const cookieDesc = getCookieDesc();
    if (!cookieDesc || !cookieDesc.get || !cookieDesc.set) { return false; }
    let isInIgnoreList = arrayContains.bind(null, ignoreList);
    let isWhiteListed = arrayContains.bind(null, whiteList);

    Object.defineProperty(document, 'cookie', {
        configurable: true,
        enumerable: cookieDesc.enumerable,
        get: function () {
            return cookieDesc.get.call(document);
        },
        set: function (cookie) {
            let cookieName = cookie.substring(0, cookie.indexOf('=')).trim();
            if (isInIgnoreList(cookieName)) {
                return;
            }
            if (!isWhiteListed(cookieName)) {
                throw new Error(ERR_PREFIX + 'Cookie "' + cookieName + '" is not in the whitelist. Blocked.');
            }
            cookieDesc.set.call(document, cookie);
        }
    });

    return function reset () {
        Object.defineProperty(document, 'cookie', {
            configurable: true,
            enumerable: cookieDesc.enumerable,
            get: cookieDesc.get,
            set: cookieDesc.set
        });
    };
}
