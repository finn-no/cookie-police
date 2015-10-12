# Cookie Police :cop:

Protects `document.cookie` for you!

It's almost impossible to have control over what cookies third parties store on your domain. Since Safari started blocking third party cookies, most third parties have moved to store *their* third party cookies on your domain. So the number of cookies and the total size of cookies have started to become a problem. Because cookies are sent on every request to your server, it can slow down the user experience. You might also get problems if your infrastructure can't handle more than X cookies or the requests get so big that your server automatically responds with *400 Bad Request*!

If you have a large site, it might be hard to track down where every cookie come from. They often have bad cookie names.

By providing a white-list of allowed cookies, Cookie Police can throw an error or call a callback whenever someone tries to set an unknown cookie. This way you can track it down locally, or create a way to report breaches from real users.

## API

### cookiePolice(options)
Available options:
+ `whiteList`: Array of allowed cookie-names. A breach will happen if anyone tries to set a cookie not in the list.


## Examples

    var cookiePolice = require('cookie-police');
    cookiePolice({ whiteList: ['myCookie', 'thirdPartyCookie'] });

    document.cookie = 'myCookie=test'; // stored
    document.cookie = 'unknownThirdParty=foo'; // Throws Error: Cookie "unknownThirdParty" is not in the whitelist. Blocked.
