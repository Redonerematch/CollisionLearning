function enemyObjects(){
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
        this.pon.y = Math.ceil(this.pon.y/32)*32
        break;
      case "top":
        this.vy = 0;
        this.pon.y -= amount;
        break;
      case "left":
        this.pon.x -= amount;
        break;
      case "right":
        this.pon.x -= amount;
        break;
    }
  };

  this.setDamage = function(amount){
    this.health -= amount;
    this.state = "damaged";
  };
}

enemyObjects.prototype.init = function(){
  this.pon.x = 14*32;
  this.pon.y = 3*32;
  this.w = 16;
  this.h = 16;
  this.pon.ofx = 16;
  this.pon.ofy = 16;
  this.img = new sprite(ctx, "mush.png");
  this.img.init(32,32,32,32);
  this.vx = 0;
  this.vx0 = 0;
  this.vy = 0;
  this.vy0 =0;
  this.health = 30;
  this.index = 0;
  this.state = "wait";
  this.colObj = [];
  this.colMap = [];
  this.direct = "left";
  this.ct = 0;
  this.index = 0;
  this.alive = true;
};

enemyObjects.prototype.update = function(){
  if(!this.alive)return;

  maxSpeed(this);
  if(this.colMap.bottom){
  }else {
    this.vy += 1;
  }

  if(this.health < 0&&this.state=="damaged"){
    if(this.index > 3){
      this.alive = false;
      this.health = 20;
    }else {
      if(this.ct%2==0)this.index++;
    }

  }
  console.log(this.index);
  this.pon.x += this.vx;
  this.pon.y += this.vy;
  this.colObj = [];
  this.colMap = [];
  colVertical(this);

  Math.floor(this.pon.x);
  //console.log(this.index, this.state);
  this.ct++;
};

enemyObjects.prototype.draw = function(ofx, ofy){
  if(!this.alive)return;

  this.pon.ax = this.pon.x + ofx;
  this.pon.ay = this.pon.y + ofy;
  if(this.state=="damaged"){
    this.img.draw(this.pon.ax, this.pon.ay, 1, this.index);
  }else {
    this.img.draw(this.pon.ax, this.pon.ay, 0, 0);
  }
};