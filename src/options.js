var select = document.getElementById("select");
var input = document.getElementById("input");
var urlArray = [];
function load() {
    urlArray = chrome.storage.local.get("urlArray", function () { });
    if (urlArray == null) {
        chrome.storage.local.set({ "urlArray": [] }, function () { });
        urlArray = [];
    }
    for (var i = 0; i < urlArray.length; i++) {
        var url = urlArray[i];
        var urlElement = document.createElement("option");
        urlElement.appendChild(document.createTextNode(url));
        select.appendChild(urlElement);
    }
}
function add() {
    if (input.value != "") {
        var op = document.createElement("option");
        //localStorage.setItem((<HTMLInputElement>input).value, (<HTMLInputElement>input).value);
        urlArray.push(input.value);
        op.appendChild(document.createTextNode(input.value));
        select.appendChild(op);
        input.value = "";
        console.log(urlArray);
        chrome.storage.local.set({ "urlArray": urlArray }, function () { });
    }
    else {
        alert("input url");
    }
}
function remove() {
    var index = select.selectedIndex;
    if (index == -1) {
        alert("select url");
    }
    else {
        for (var i = 0; i < select.childElementCount; i++) {
            if (i == index) {
                //localStorage.removeItem((<HTMLSelectElement>select)[i].value);
                urlArray.splice(i, 1);
                chrome.storage.local.set({ "urlArray": urlArray }, function () { });
                select[i].remove();
                var str = chrome.storage.local.get("urlArray", function () {
                    console.log(str);
                });
            }
        }
    }
}
window.addEventListener("load", load);
document.getElementById("add").addEventListener("click", add);
document.getElementById("remove").addEventListener("click", remove);
