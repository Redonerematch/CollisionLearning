function enemyObject(){
  this.name = "enemy";
  this.pon = new point();
  this.chgDir = false;
  this.deft = new deathEffect();

  this.ptcl = [];
  for(var i=0;i<PARTICLE_NUM;i++){
     this.ptcl[i] = new particle();
  }

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
             this.pon.x = Math.ceil((this.pon.x - Math.abs(this.vx))/32)*32 - this.pon.ofx + 6;
        }else {
             this.pon.x -= amount;
        }
      break;
      case "right":
        if(name=="map"){
             this.pon.x = Math.trunc((this.pon.x + Math.abs(this.vx))/32)*32 + this.pon.ofx - 6 ;
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

  this.setVX = function(dir){
    if(this.vx < this.vx0&this.vx > -this.vx0){
      this.vx += dir*0.5;
      this.chgDirect = this.direct;
    }else {
    this.vx = dir * this.vx0;
      if(this.chgDirect!=this.direct)this.vx = 0;
    }
  };
  this.setDamage = function(dmg, dir){
    this.hp -= dmg;
    this.inv = true;
    if(dir=="left")this.vx = -dmg;
    else this.vx = dmg;
    if(this.interval===0)this.vy = -3;
    this.deft.init(this.pon.x + this.w, this.pon.y - this.h, dir);
  };
  this.setDead = function(){
    this.alive = false;
    for(var i=0;i<PARTICLE_NUM/2;i++){
        if(!this.ptcl[i].flag)this.ptcl[i].init(this.pon.x, this.pon.y);
    }
  }
  this.setInfo = function(x,y,type,phaseX,phaseY,dir){
    this.pon.x = x;
    this.pon.y = y;
    this.type = type;
    this.spPhaseX = phaseX; this.spPhaseY = phaseY; this.dir = dir;
  }
}

enemyObject.prototype.init = function(){
    this.w = 31;
    this.h = 32;
    this.pon.ofx = 1;
    this.pon.ofy = 0;
    this.vx = this.vy = 0;
    switch(this.type){
      case 1:
        this.img = new sprite(ctx, "slime.png");
        this.img.init(32,32,32,32);
        this.hp = 3000;
        this.vx0 = 1;
      break;
      case 2:
        this.img = new sprite(ctx, "bat.png");
        this.img.init(32,32,32,32);
        this.hp = 10;
        this.vx0 = 0;
      break;
      case 3:
        this.img = new sprite(ctx, "plant.png");
        this.img.init(32,32,32,32);
        this.hp = 30;
        this.vx0 = 0;
      break;
      case 4:
        this.img = new sprite(ctx, "animal.png");
        this.img.init(32,32,32,32);
        this.hp = 30;
        this.vx0 = 3;
      break;
    }
    this.index = 0;
    this.dir = 1;
    this.state = "wait";
    this.inv = false;
    this.interval = 0;
    this.colObj = this.colMap = [];
    this.alive = true;


};


enemyObject.prototype.update = function(){
    if(this.alive){
        maxSpeed(this, 6, 12);
        if(!this.colMap.bottom){
            this.vy += 1;
        }else {
            if(!this.inv)this.vx = this.vx0;
        }
        //被弾処理
        if(this.inv){

            if((this.colMap.left||this.colMap.right)){
                this.vx = 0;
            }
            this.interval++;
            if(this.interval > 6){
              this.inv = false;
              this.interval = 0;
            }
        }else {
          //壁で反転
          if((this.colMap.left||this.colMap.right)){
              this.vx = 0
              if(this.colMap.bottom)this.dir *= -1;
          }
          this.dir==1?this.setVX(1):this.setVX(-1)
        }


        if(this.hp <= 0)this.setDead();
        this.pon.x += this.vx;
        this.pon.y += this.vy;

        this.colObj = this.colMap = [];

        this.index = incIndex(3,7,this.index);
        colVertical(this);
    }
    //エフェクト更新
    for(var i=0;i<PARTICLE_NUM;i++){
        if(this.ptcl[i].flag)this.ptcl[i].update();
    }
    if(this.deft.flag)this.deft.update();
};


enemyObject.prototype.draw = function(ofx, ofy){
    if(this.alive){
        this.pon.ax = this.pon.x + ofx;
        this.pon.ay = this.pon.y + ofy;
        (this.dir==1)?this.img.draw(this.pon.ax, this.pon.ay, 2, this.index):this.img.draw(this.pon.ax, this.pon.ay, 3, this.index)
    }
    for(var i=0;i<PARTICLE_NUM;i++){
        if(this.ptcl[i].flag)this.ptcl[i].draw(ofx, ofy);
    }
    if(this.deft.flag)this.deft.draw(ofx, ofy);
};