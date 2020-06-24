function cookieinfo(){
	 chrome.cookies.set({"name":"Sample1","url":"http://developer.chrome.com/extensions/cookies.html","value":"Dummy Data"},function (cookie){
        console.log(JSON.stringify(cookie));
        console.log(chrome.extension.lastError);
        console.log(chrome.runtime.lastError);
    });
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
    
    chrome.cookies.onChanged.addListener(function (changeInfo){
        console.log(JSON.stringify(changeInfo));
    });
}
window.onload=cookieinfo;