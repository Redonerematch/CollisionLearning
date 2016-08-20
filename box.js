
function box(){
  this.name = "box";
  this.pon = new point();

      this.doHitCorrection = function(direction, amount, name){
          if(name=="map"){
               this.colMap[direction] = true;
          }else if(name=="box"){
               this.colObj[direction] = true;
          }
          switch(direction){
               case "bottom":
                    this.vy = 0;
                    this.pon.y= Math.trunc((this.pon.y)/32)*32;
               break;
               case "top":
                    this.vy = 0;
                    this.pon.y += amount;
               break;
               case "left":
                    if(name=="map"){
                         this.pon.x = Math.ceil((this.pon.x - this.vx0)/32)*32 - this.pon.ofx;
                    }else {
                         this.pon.x -= amount;
                    }
               break;
               case "right":
                    if(name=="map"){
                         this.pon.x = Math.trunc((this.pon.x + this.vx0)/32)*32 + this.pon.ofx;
                    }else {
                         this.pon.x -= amount;
                    }
               break;
               case "platform":
                    if(this.decFlg){
                         this.colMap[direction] = false;
                    }else {
                         this.vy = 0;
                         this.pon.y= Math.trunc((this.pon.y)/32)*32;
                    }
               break;
          }
     };
  this.setPosFlg = function(){
  };
  this.getAffectX = function(vx, direction){
    this.colObj[direction] = true;
    this.affectX = vx/2;
  }
  this.setBoxWeight = function(){
    this.boxelFlag = true;
  }
}

box.prototype.init = function(num){
  if(num==0){
    this.pon.x = 840;
    this.pon.y = 200;
  }else if(num==1){
    this.pon.x = 416;
    this.pon.y = 256;
  }else if(num==2){
    this.pon.x = 480;
    this.pon.y = 32;
  }else {
    this.pon.x = 960;
    this.pon.y = 32;
  }
  this.index = num;
  this.w = 31;
  this.h = 32;
  this.pon.ofx = 0;
  this.pon.ofy = 0;
  this.vx = this.vy = 0; this.vx0 = 0;
  this.img = new sprite(ctx, "block1.png");
  this.img.init(32,32,32,32);
  this.affectX = 0;
  this.boxelFlag = false;
  this.state = "wait";
  this.colObj = this.colMap = [];
}

box.prototype.update = function(){
  maxSpeed(this);
  if(!this.colMap.bottom){
    this.vy += 1;
  }
  //横から箱にぶつかる
  if(!this.boxelFlag&&(this.colObj.left||this.colObj.right)){
    this.vx = this.affectX/2;
  }else {
    this.vx = 0;
  }
  this.pon.x += this.vx;
  this.pon.y += this.vy;
  this.colObj = this.colMap = [];
  this.affectX = 0;
  this.boxelFlag = false;
  colVertical(this);

  Math.floor(this.pon.x);
}

box.prototype.draw = function(ofx, ofy){
  this.pon.ax = this.pon.x + ofx;
  this.pon.ay = this.pon.y + ofy;
  this.img.draw(this.pon.ax, this.pon.ay, 0, 0);
}