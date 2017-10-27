/// <reference path="../typings/index.d.ts" />
var select = document.getElementById("select");
var input = document.getElementById("input");
var urlArray: any = [];
function load(): void {
    urlArray = chrome.storage.local.get("urlArray", function () { });
    if (urlArray == null) {
        chrome.storage.local.set({ "urlArray": [] }, function () { })
        urlArray = [];
    }
    for (var i = 0; i < urlArray.length; i++) {
        var url = urlArray[i];
        var urlElement = document.createElement("option");
        urlElement.appendChild(document.createTextNode(url));
        select.appendChild(urlElement);
    }
}
function add(): void {
    if ((<HTMLInputElement>input).value != "") {
        var op = document.createElement("option");
        //localStorage.setItem((<HTMLInputElement>input).value, (<HTMLInputElement>input).value);
        urlArray.push((<HTMLInputElement>input).value);
        op.appendChild(document.createTextNode((<HTMLInputElement>input).value));
        select.appendChild(op);
        (<HTMLInputElement>input).value = "";
        console.log(urlArray);
        chrome.storage.local.set({ "urlArray": urlArray }, function () { });
    } else { alert("input url"); }

}
function remove(): void {
    var index = (<HTMLSelectElement>select).selectedIndex;
    if (index == -1) {
        alert("select url")
    } else {
        for (var i = 0; i < select.childElementCount; i++) {
            if (i == index) {
                //localStorage.removeItem((<HTMLSelectElement>select)[i].value);
                urlArray.splice(i, 1);
                chrome.storage.local.set({ "urlArray": urlArray }, function () { });
                <HTMLSelectElement>select[i].remove();

                var str=chrome.storage.local.get("urlArray", function () {
                console.log(str); });
            }
        }
    }
}
window.addEventListener("load", load);
document.getElementById("add").addEventListener("click", add);
document.getElementById("remove").addEventListener("click", remove);
