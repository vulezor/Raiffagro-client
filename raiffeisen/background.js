
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('raiffeisen_agro.html', {
		bounds: {
			width: 1160,
			height: 960,
			left: 100,
			top: 100,

		},
        state: 'maximized',
		minWidth: window.screen.availWidth,//1160,
		minHeight: window.screen.availHeight   //960
	});
});

chrome.runtime.onSuspend.addListener(function() {
	// Do some simple clean-up tasks.
});

chrome.runtime.onInstalled.addListener(function() {
		// chrome.storage.local.set(object items, function callback);
});

/*function cookieinfo(){
    chrome.cookies.getAll({},function (cookie){
        console.log(cookie.length);
        for(i=0;i<cookie.length;i++){
            console.log(JSON.stringify(cookie[i]));
        }
    });
    chrome.cookies.getAllCookieStores(function (cookiestores){
        for(i=0;i<cookiestores.length;i++){
            console.log(JSON.stringify(cookiestores[i]));
        }
    });
    chrome.cookies.set({"name":"Sample1","url":"http://developer.chrome.com/extensions/cookies.html","value":"Dummy Data"},function (cookie){
        console.log(JSON.stringify(cookie));
        console.log(chrome.extension.lastError);
        console.log(chrome.runtime.lastError);
    });
    chrome.cookies.onChanged.addListener(function (changeInfo){
        console.log(JSON.stringify(changeInfo));
    });
}
window.onload=cookieinfo;*/
