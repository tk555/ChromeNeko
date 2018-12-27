let Oneko = (function () {
    function Oneko(color, size) {
        this.mouseX = 0; //マウスのいち
        this.mouseY = 0;
        this.catPositionX = -16; //画像の中心から画像左上までのズレ
        this.catPositionY = -16;
        this.targetX = 0; //マウス位置+マウスからのズレ
        this.targetY = 0;
        this.imgX = 0; //画像の場所
        this.imgY = 0;
        this.dx = 0;
        this.dy = 0;
        this.dr = 20;//猫がワンステップで進むデフォルト距離
        this.isMouseOutofDocument = false;
        this.isNextPointOutofDocument = false;
        this.minDistance = 50; //猫の位置を動かす最小距離
        this.minDistanceofTogi = 1;
        this.minDistanceRoot = 50; //Math.pow(this.minDistance,1/2);
        this.currentDistance = 0; //マウス位置＋猫のズレと今の画像との距離
        this.nameArray = ["akubi1", "akubi2", "akubiL", "akubiR", "awake", "down1", "down2", "dtogi1", "dtogi2",
            "dwleft1", "dwleft2", "dwright1", "dwright2", "inleft1", "inleft2", "inright1", "inright2",
            "kaki1", "kaki2", "left1", "left2", "ltogi1", "ltogi2", "maneki1", "maneki2",
            "mati1", "mati2", "right1", "right2", "rtogi1", "rtogi2", "sleep1", "sleep2", "up1", "up2",
            "upleft1", "upleft2", "upright1", "upright2", "utogi1", "utogi2"];
        this.imgStyleArray = [];
        this.currentImg = 1;
        this.counter = 0;
        this.canOccerMouseMove = true;
        //DOMに画像が読み込まれる
        let th = document.getElementsByTagName("body")[0];
        let d = document.createElement("div");
        let imgArray = [];
        d.setAttribute("id", "cursor");
        d.setAttribute("style", "position:absolute; top:0px; left:0px; !important");
        for (let i = 0; i < this.nameArray.length; i++) {
            let img = document.createElement("img");
            img.setAttribute("style", "position:absolute; top:0px; left:0px; !important");
            img.style.visibility = "hidden";
            img.setAttribute("src", chrome.extension.getURL("img/" + this.nameArray[i] + ".png"));
            img.setAttribute("id", this.nameArray[i]);
            img.style.zIndex = "99999999";
            this.imgStyleArray.push(img.style);
            imgArray.push(img);
            d.appendChild(img);
        }
        th.appendChild(d);
        this.color = color;
        this.size = size;
        this.divStyle = document.getElementById("cursor").style;
    }
    Oneko.prototype.mouseMove = function (ev) {
        //マウスが動いたときに発生する処理
        if (this.canOccerMouseMove) {
            this.mouseX = ev.pageX;
            this.mouseY = ev.pageY;
            this.targetX = this.mouseX + this.catPositionX;
            this.targetY = this.mouseY + this.catPositionY;
            //console.log(ev.pageX,ev.pageY,document.body.scrollLeft,document.body.scrollTop);
            //console.log(this.mouseX,this.mouseY,document.documentElement.clientWidth,document.documentElement.clientHeight);
            //console.log(this.mouseY-window.scrollY);
            //console.log(this.imgX - window.scrollX, this.imgY - window.scrollY);
        }
    };
    Oneko.prototype.mouseLeave = function (ev) {
        //マウスがウィンドウ外に出たときの処理
        this.isMouseOutofDocument = true;
    };
    Oneko.prototype.mouseEnter = function (ev) {
        //マウスがウィンドウ内に入った時の処理
        this.isMouseOutofDocument = false;
    };
    Oneko.prototype.mainLoop = function () {
        console.log("main loop");
        let _this = this;
        this.canOccerMouseMove = false;
        this.currentDistance = Math.sqrt(Math.pow(this.targetX - this.imgX, 2) + Math.pow(this.targetY - this.imgY, 2));
        let arrowX = this.targetX - this.imgX;
        let arrowY = this.targetY - this.imgY;
        this.dx = this.dr * (this.targetX - this.imgX) / this.currentDistance;
            this.dy = this.dr * (this.targetY - this.imgY) / this.currentDistance;
            this.isNextPointOutofDocument = (this.imgX + this.dx) < 0 || (this.imgX + this.dx) > window.innerWidth || (this.imgY + this.dy) < 0 || (this.imgX + this.dy) > window.innerHeight;
            
        console.log(this.mouseX,window.scrollX,this.mouseY,window.scrollY,this.mouseY-window.scrollY-window.innerHeight);
        if (this.currentDistance < this.minDistance) {
            //console.log("tikai");
            //近いなら動かない
            this.dx = 0;
            this.dy = 0;
            if (this.isMouseOutofDocument&&(Math.abs(this.mouseX-window.scrollX)<50||Math.abs(this.mouseY-window.scrollY)<50||
            Math.abs(this.mouseY-window.scrollY-window.innerHeight)<50||Math.abs(this.mouseX-window.scrollX-window.innerWidth)<50)) {
                //マウスがウィンドウの外にあり、かつカーソルが今指している位置（カーソルがウィンドウの外に出る直前に居た位置）と猫の位置が近い
                //四隅のどれに近いか
                let arr = [this.imgY - window.scrollY,
                    this.imgX - window.scrollX,
                    window.innerHeight - (32 + window.innerHeight - document.documentElement.clientHeight) - (this.imgY - window.scrollY),
                    document.body.clientWidth - (32 + document.documentElement.clientWidth - document.body.clientWidth) - (this.imgX - window.scrollX)];
                    //console.log(arr);
                    switch (arr.indexOf(Math.min.apply(null, arr))) {
                        case 0:
                            this.display("utogi");
                            if (Math.min.apply(null, arr) != 0) {
                                this.dx = 0;
                                this.dy = -arr[0];
                            }
                            break;
                        case 1:
                            this.display("ltogi");
                            if (Math.min.apply(null, arr) != 0) {
                                this.dx = -arr[1];
                                this.dy = 0;
                            }
                            break;
                        case 2:
                            this.display("dtogi");
                            if (Math.min.apply(null, arr) != 0) {
                                this.dx = 0;
                                this.dy = arr[2];
                            }
                            break;
                        case 3:
                            this.display("rtogi");
                            if (Math.min.apply(null, arr) != 0) {
                                this.dx = arr[3];
                                this.dy = 0;
                            }
                            break;
                        default:
                            console.log("togi error");
                    }
                    this.counter=0;
            } else {
                //カーソルとの距離が近くてカーソルがブラウザの外に出てるか
                //猫は動かずdx,dy=0
                this.counter++;
                if (this.counter < 10) {
                    this.display("akubi");
                }
                else {
                    this.display("sleep");
                }
            }
        } else {
            //console.log("tooi");
            let theta = Math.atan2(this.dx, this.dy);
            if ((-Math.PI <= theta && theta <= -Math.PI * 7 / 8) || (Math.PI * 7 / 8 < theta && theta <= Math.PI)) {
                this.display("up");
            } else if (-Math.PI * 7 / 8 <= theta && theta < -Math.PI * 5 / 8) {
                this.display("upleft");
            } else if (-Math.PI * 5 / 8 <= theta && theta < - Math.PI * 3 / 8) {
                this.display("left");
            } else if (-Math.PI * 3 / 8 <= theta && theta < -Math.PI / 8) {
                this.display("dwleft");
            } else if (-Math.PI / 8 <= theta && theta < Math.PI / 8) {
                this.display("down");
            } else if (Math.PI / 8 <= theta && theta < Math.PI * 3 / 8) {
                this.display("dwright");
            } else if (Math.PI * 3 / 8 <= theta && theta < Math.PI * 5 / 8) {
                this.display("right");
            } else {
                this.display("upright");
            }
            this.counter=0;
        }
        this.imgX = this.imgX + this.dx;
        this.imgY = this.imgY + this.dy;
        if (this.imgX < window.scrollX) {
            //console.log("too min");
            this.imgX = window.scrollX;
        } else if (window.scrollX + document.body.clientWidth - 32 < this.imgX) {
            //console.log("too many");
            this.imgX = window.scrollX + document.body.clientWidth - 32;
        }
        if (this.imgY < window.scrollY) {
            this.imgY = window.scrollY;
        } else if (window.scrollY + document.documentElement.clientHeight - 32 < this.imgY) {
            this.imgY = window.scrollY + document.documentElement.clientHeight - 32;
        }
        //console.log("imgX", this.imgX, this.imgY);
        this.divStyle.left = this.imgX + "px";
        this.divStyle.top = this.imgY + "px";
        this.canOccerMouseMove = true;
        setTimeout(function () { _this.mainLoop(); }, 200);
    };

    Oneko.prototype.display = function (name) {
        //console.log(name);
        if (this.currentImg == 2) {
            this.currentImg = 1;
        }
        else {
            this.currentImg = 2;
        }
        let index = this.nameArray.indexOf(name + this.currentImg);
        //console.log(name);
        for (let i = 0; i < this.nameArray.length; i++) {
            if (i == index) {
                this.imgStyleArray[i].visibility = "visible";
            }
            else {
                this.imgStyleArray[i].visibility = "hidden";
            }
        }
    };
    return Oneko;
}());

let mainloop_chromeNeko = function () {
    let oneko = new Oneko("white", 1);
    let mouseMoveHandler = oneko.mouseMove.bind(oneko);
    let mouseLeaveHandler = oneko.mouseLeave.bind(oneko);
    let mouseEnterHandler = oneko.mouseEnter.bind(oneko);
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseleave", mouseLeaveHandler);
    document.addEventListener("mouseenter", mouseEnterHandler);
    oneko.mainLoop();
};

chrome.storage.sync.get(["urlArray"], function (a) {
    let urlArray = a.urlArray;
    let currentUrl_chromeNeko = location.href;
    let canMainLoop = true;
    if(urlArray===undefined){
        mainloop_chromeNeko();
        return;
    }
    urlArray.forEach(function (element) {
        let re_chromeNeko = new RegExp("^https?://"+element.replace(/\*/g, ".*")+"$");
        //console.log(re_chromeNeko);
        //console.log(currentUrl_chromeNeko, element, currentUrl_chromeNeko.match(re_chromeNeko));
        canMainLoop = canMainLoop && !currentUrl_chromeNeko.match(re_chromeNeko);
        //console.log(canMainLoop);
    }, this);
    if(canMainLoop) mainloop_chromeNeko();
    return;
});

