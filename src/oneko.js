/// <reference path="../typings/index.d.ts" />
var Oneko = (function () {
    function Oneko(color, size) {
        this.mouseX = 0; //マウスのいち
        this.mouseY = 0;
        this.catPositionX = -16; //マウスからのズレ
        this.catPositionY = -16;
        this.targetX = 0; //マウス位置+マウスからのズレ
        this.targetY = 0;
        this.imgX = 0; //画像の場所
        this.imgY = 0;
        this.dx = 20;
        this.dy = 20;
        this.minDistance = 50; //猫の位置を動かす最小距離
        this.minDistanceRoot = 50; //Math.pow(this.minDistance,1/2);
        this.theta = 10 * (Math.PI / 180);
        this.currentDistance = 0; //マウス位置＋猫のズレと今の画像との距離
        this.nameArray = ["akubi1", "akubi2", "akubiL", "akubiR", "awake", "down1", "down2", "dtogi1", "dtogi2",
            "dwleft1", "dwleft2", "dwright1", "dwright2", "inleft1", "inleft2", "inright1", "inright2",
            "kaki1", "kaki2", "left1", "left2", "ltogi1", "ltogi2", "maneki1", "maneki2",
            "mati1", "mati2", "right1", "right2", "rtogi1", "rtogi2", "sleep1", "sleep2", "up1", "up2",
            "upleft1", "upleft2", "upright1", "upright2", "utogi1", "utogi2"];
        this.imgStyleArray = [];
        this.currentImg = 1;
        this.counter = 0;
        //DOMに画像が読み込まれる
        var th = document.getElementsByTagName("body")[0];
        var d = document.createElement("div");
        var imgArray = [];
        d.setAttribute("id", "cursor");
        d.setAttribute("style", "position:absolute; top:0px; left:0px; !important");
        for (var i = 0; i < this.nameArray.length; i++) {
            var img = document.createElement("img");
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
        this.mouseX = ev.clientX + document.body.scrollLeft;
        this.mouseY = ev.clientY + document.body.scrollTop;
        this.targetX = this.mouseX + this.catPositionX;
        this.targetY = this.mouseY + this.catPositionY;
    };
    Oneko.prototype.mainLoop = function () {
        var _this = this;
        //console.log(this.counter);
        this.currentDistance = Math.sqrt(Math.pow(this.targetX - this.imgX, 2) + Math.pow(this.targetY - this.imgY, 2));
        if (this.currentDistance > this.minDistance) {
            this.counter = 0;
            var arrowX = this.targetX - this.imgX;
            var arrowY = this.targetY - this.imgY;
            //console.log(arrowX, arrowY);
            if (arrowX < -this.minDistanceRoot && arrowY < -this.minDistanceRoot) {
                this.display("upleft");
            }
            else if (Math.abs(arrowX) < this.minDistanceRoot && arrowY < -this.minDistanceRoot) {
                this.display("up");
            }
            else if (arrowX > this.minDistanceRoot && arrowY < -this.minDistanceRoot) {
                this.display("upright");
            }
            else if (arrowX < -this.minDistanceRoot && Math.abs(arrowY) < this.minDistanceRoot) {
                this.display("left");
            }
            else if (Math.abs(arrowX) < this.minDistanceRoot && Math.abs(arrowY) < this.minDistanceRoot) {
            }
            else if (arrowX > this.minDistanceRoot && Math.abs(arrowY) < this.minDistanceRoot) {
                this.display("right");
            }
            else if (arrowX < -this.minDistanceRoot && arrowY > this.minDistanceRoot) {
                this.display("dwleft");
            }
            else if (Math.abs(arrowX) < this.minDistanceRoot && arrowY > this.minDistanceRoot) {
                this.display("down");
            }
            else if (arrowX > this.minDistanceRoot && arrowY > this.minDistanceRoot) {
                this.display("dwright");
            }
            this.imgX += this.dx * (this.targetX - this.imgX) / this.currentDistance;
            this.imgY += this.dy * (this.targetY - this.imgY) / this.currentDistance;
            this.divStyle.left = (this.imgX) + "px";
            this.divStyle.top = (this.imgY) + "px";
        }
        else {
            //あくびとか眠るとかの処理
            this.counter++;
            if (this.counter < 10) {
                this.display("akubi");
            }
            else {
                /*
                if (this.mouseX > window.innerWidth - 20) {
                    this.display("rtogi");
                    this.targetX=window.innerHeight-20;
                } else if(this.mouseX<3){
                    this.display("ltogi");
                    this.targetX=3;
                }else if(this.mouseY>window.innerHeight-20){
                    this.display("dtogi");
                    this.targetY=window.innerHeight-20;
                }else if(this.mouseY<3){
                    this.display("utogi");
                    this.targetY=3;
                }else{*/
                this.display("sleep");
            }
        }
        setTimeout(function () { _this.mainLoop(); }, 200);
    };
    Oneko.prototype.display = function (name) {
        if (this.currentImg == 2) {
            this.currentImg = 1;
        }
        else {
            this.currentImg = 2;
        }
        var index = this.nameArray.indexOf(name + this.currentImg);
        //console.log(name);
        for (var i = 0; i < this.nameArray.length; i++) {
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
for (var i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
}
var oneko = new Oneko("white", 1);
var mouseMoveHandler = oneko.mouseMove.bind(oneko);
document.addEventListener("mousemove", mouseMoveHandler);
oneko.mainLoop();
