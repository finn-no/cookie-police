import cookiePolice, { BROWSER_SUPPORT } from '../lib/cookiePolice.js';

if (BROWSER_SUPPORT) {
    describe('Cookie police', () => {
        let resetFn;
        let cookiePoliceWrap;

        before(() => {
            cookiePoliceWrap = function (...args) {
                resetFn = cookiePolice.apply(null, args);
            };
        });

        afterEach(() => {
            if (resetFn) {
                resetFn();
            }
            ['foo', 'bar'].forEach((cookieName) => {
                document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            });
        });

        function getCookieNames () {
            return (document.cookie || '').split(/\s*;\s/).map((str) => { return str.substring(0, str.indexOf('=')); });
        }

        it('should be a function', () => {
            expect(cookiePolice).to.be.a('function');
        });

        it('should not allow setting a non-whitelisted cookie', () => {
            cookiePoliceWrap({whiteList: ['x', 'foo', 'loo']});
            expect(() => {
                document.cookie = 'bar=1';
            }).to.throw();

            expect(getCookieNames()).to.not.contain('bar');
        });

        it('should allow setting a whitelisted cookie', () => {
            cookiePoliceWrap({whiteList: ['x', 'foo', 'loo']});
            expect(getCookieNames()).not.to.contain('foo');
            expect(() => {
                document.cookie = 'foo=bar';
            }).to.not.throw();
            expect(getCookieNames()).to.contain('foo');
        });

        it('should ignore a cookie in the ignoreList', () => {
            cookiePoliceWrap({ignoreList: ['x', 'foo', 'loo']});
            expect(() => {
                document.cookie = 'loo=1';
            }).to.not.throw();

            expect(getCookieNames()).to.not.contain('loo');
        });

        it('should allow customizing how breaches are handled', () => {
            var onErrorCalled = false;
            cookiePoliceWrap({whiteList: ['foo'], onViolation: function (errMsg, cookieName) {
                onErrorCalled = true;
                expect(cookieName).to.equal('bar');

                expect(errMsg).to.be.a('string');
                expect(errMsg).to.contain('"bar" is not in the whitelist. Blocked.');
            }});

            expect(() => {
                document.cookie = 'bar=1';
            }).to.not.throw();

            expect(onErrorCalled).to.equal(true);
            expect(getCookieNames()).to.not.contain('bar');
        });
    });
} else {
    console.log('This browser does not have necessary features for Code police. Skipping tests.');
    describe('thou', function () {
        it('should pass', function () {
            expect(true).to.be(true);
        });
    });
}
