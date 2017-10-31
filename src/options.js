var select = document.getElementById("select");
var input = document.getElementById("input");
var urlArray = [];
function load() {
    chrome.storage.sync.get("urlArray", function (s) {
        urlArray = s.urlArray;
        console.log("load ", s);
        if (s == null) {
            chrome.storage.sync.set({ "urlArray": [] }, function () { });
        }
        for (var i = 0; i < s.urlArray.length; i++) {
            var url = s.urlArray[i];
            var urlElement = document.createElement("option");
            console.log(url, urlElement);
            urlElement.appendChild(document.createTextNode(url));
            select.appendChild(urlElement);
        }
    });

    document.getElementById("add").addEventListener("click", add);
    document.getElementById("remove").addEventListener("click", remove);
}
function add() {
    if (input.value != "") {
        var op = document.createElement("option");
        //localStorage.setItem((<HTMLInputElement>input).value, (<HTMLInputElement>input).value);
        urlArray.push(input.value);
        op.appendChild(document.createTextNode(input.value));
        select.appendChild(op);
        input.value = "";
        chrome.storage.sync.set({ "urlArray": urlArray }, function () {
            console.log("urlArray set ", urlArray);
        });
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
                chrome.storage.sync.set({ "urlArray": urlArray }, function () { });
                select[i].remove();
                chrome.storage.sync.get("urlArray", function (newUrlArray) {
                    console.log(newUrlArray);
                });
            }
        }
    }
}
window.addEventListener("load", load);
