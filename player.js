var player = function(){
     var keyPush,atkPush;
     var rFlg;
     this.chgDir;
     this.name = "player";
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
                         this.pon.x = Math.ceil((this.pon.x - this.vx0)/32)*32 - this.pon.ofx + 6;
                         //this.pon.x = this.pon.lx;
                    }else {
                         this.pon.x -= amount;
                    }
               break;
               case "right":
                    if(name=="map"){
                         this.pon.x = Math.trunc((this.pon.x + this.vx0)/32)*32 + this.pon.ofx - 7;
                         //this.pon.x = this.pon.lx;
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

this.setPosFlg = function(FlgName){
     this.posFlg = FlgName;
};
this.setVX = function(dir){
     if(this.state=="push"||this.state=="ladder"||this.posFlg=="water"){
          this.vx = dir * this.vx0/2;
     }else {
          if(this.vx < this.vx0&this.vx > -this.vx0){
               this.vx += dir*0.5;
               this.chgDir = this.direct;
          }else {
               this.vx = dir * this.vx0;
               if(this.chgDir!=this.direct)this.vx = 0;
          }
     }
};
  this.setIndex = function(){
    switch(this.state){
      case "jump":
        if(this.vy >= 0){ //下降中
          if(rFlg){
            this.index++
            if(this.index > 6)this.index = 7;
          }else {
            this.index = 7;
          }
        }else {
          this.index = 0;
          if(this.vy < -9)rFlg = true;
        }
      break;
      case "flat":
        if(time%4==0)this.index++;
        rFlg = false;
      break;
      case "attack_a":
        if(time%2==0)this.index++;
      break;
      case "attack_b":
        if(time%2==0)this.index++;
      break;
      case "attack_b_f":
        if(time%2==0)this.index++;
      break
      default:
        if(time%3==0)this.index++;
        rFlg = false;
      break;
    }
    this.interval++;
    if(this.index > 7)this.index = 0
  };
  this.getInfo = function(){
    var InfoCluster = [];
    infoCluster = {"point": this.pon, "velocity":[this.vx, this.vy], "state":this.state, "pos":this.posFlg, "breath":this.breath};
    return infoCluster;
  };
  this.getEffectFlg = function(){
    return this.eft;
  };
  this.resetState = function(){
      this.wet = false;
      this.posFlg = "";
      this.colObj = [];
      this.colMap = [];
  };
  this.setAttackState = function(statement, after){
      var tmp = 1;
      atkPush = true;
      if(after=="flat"){
           this.vx = 0;
           tmp = 3;
      }
      this.interval = 0;
      if(this.index == tmp){
           if(!this.eft.flag)this.eft.init(statement)
           atkPush = false;
      }
      if(this.index > 5)this.state = after;
  }
  this.setNormalState = function(){
    if(isGround(this)){
         if(this.state!="attack_a"&&this.state!="attack_b")this.state = "flat";
         if(this.colObj.left|this.colObj.right){
              this.state = "push";
         }
    }else {
         if(this.state!="attack_b_f"&&this.state!="damaged")this.state = "jump";
    }
  };

    this.setDamage = function(dmg, dir){

        this.hp -= dmg;
        this.inv = true;
        if(dir=="left")this.vx = dmg;
        else this.vx = -dmg;
        if(this.invtime===0)this.vy = -5;
        //this.deft.init(this.pon.x + this.w, this.pon.y - this.h, dir);
    };

    this.setDamaging = function(){
      this.invtime++;
      if(this.invtime > 30){
        this.inv = false;
        this.invtime = 0;
        //this.state = "jump";
      }else if(this.invtime < 10){
        this.state = "damaged";
      }
    }
}

player.prototype.init = function(){
  this.pon.x =1*32;
  this.pon.y = 2*32;
  this.w = 18; this.h = 28;
  this.pon.ofx = 7;
  this.pon.ofy = 36;
  this.img = new sprite(ctx, "saro.png");
  this.img.init(32,64,32,64);
  this.weapon = new plWeapon();
  this.weapon.init();
  this.eft = new plEffect();
  this.ptcl = [];
  for(var i=0;i<PARTICLE_NUM;i++){
     this.ptcl[i] = new particle();
  }
  this.vx = this.vy = 0;
  this.vx0 = 10; this.vy0 =11; this.g = 1;
  this.breath = 300;
  this.index = 0;
  this.state = "wait";
  this.inv = false;
  this.invtime = 0;
  this.interval = 0;
  this.ground = this.decFlg = false;
  this.colObj = []; this.colMap = [];
  this.direct = "left";
  this.interval = 0;
  rFlg  =  keyPush = atkPush = false;
}

player.prototype.update = function(){
//---------------------------------基本動作------------------------------------------------------------------
     if(isGround(this)){
          if(this.colObj.left|this.colObj.right){
               this.state = "push";
          }
     }else {
          this.posFlg=="water"?this.vy += this.g/2: this.vy += this.g;
     }

     //-------------じゃんぷ------------------
     if(keyFunc.detect(88)&&keyPush==false&&this.state!="attack_b_f"&&this.state!="damaged"){ //damagedはあとで除く
          this.vy = -this.vy0;
          keyPush = true;
          this.index = 0;
     }else if(!keyFunc.detect(88)){
          keyPush = false;
     }
     //---------------降りる-------------------
     if(keyFunc.detect(40)){
          this.decFlg = true;
          this.interval = 5;
     }else {
          if(this.interval > 10)this.decFlg = false;
     }
     //---------------------------地形ステート管理----------------------------------------------------------------
     switch(this.posFlg){
     case "ladder":
          if(keyFunc.detect(38)){
               this.state = "ladder";
               this.vy = -this.vy0/5;
          }else if(keyFunc.detect(40)){
               this.state = "ladder";
               this.vy = this.vy0/5;
          }else {
               if(this.state=="ladder"){
                    this.vy = 0;
                    if(keyFunc.detect(88)){
                         this.state = "jump";
                         this.vy = -this.vy0/2
                    }
               }else {
                    this.setNormalState();
               }
          }
     break;
     case "water":
          maxSpeed(this,2, 6);
          this.setNormalState();
          if(time%100==0){
            for(var i=0;i<1;i++){
                 if(!this.ptcl[i].flag)this.ptcl[i].init(this.pon.x, this.pon.y, "air");
            }
          }
         if(this.breath==100){
              for(var i=0;i<PARTICLE_NUM;i++){
                   if(!this.ptcl[i].flag)this.ptcl[i].init(this.pon.x, this.pon.y, "water");
              }
         }
          this.breath -= 1;
     break;
     default:
          this.setNormalState();
          maxSpeed(this,6, 12);
          this.breath = 100;
     break;
     }

    if(!atkPush){
      switch(this.state){
        case "jump":
          switch(keyFunc.getCode()){
          case 90:
            if(this.interval > 10){
              this.state = "attack_b_f";
              this.index = 0;
            }
          break;
          }
        break;
        case "flat":
          switch(keyFunc.getCode()){
          case 90:
            if(this.interval > 6){
              this.state = "attack_a";
              this.index = 1;
            }
            break;
          }
        break;
        case "attack_a":
          if(this.index > 4&&keyFunc.getCode()==90){
            this.index = 1;
            this.state = "attack_b";
          }
        break;
      }
    }
     //---------------------------------------横速度の設定-------------------------------------------

    if(this.inv){
      this.setDamaging();
    }
    if(this.state!="damaged"){
      if(keyFunc.detect(39)){
        this.direct = "right";
        this.setVX(1);
      }else if(keyFunc.detect(37)){
        this.direct = "left";
        this.setVX(-1);
      }else {
        this.vx = 0;
      }
      switch(this.state){
        case "attack_a":
          this.setAttackState(this.state, "flat");
        break;
        case "attack_b":
          this.setAttackState(this.state, "flat");
        break;
        case "attack_b_f":
          this.setAttackState(this.state, "jump");
        break;
      }
    }
    this.pon.lx = this.pon.x;
    this.pon.ly = this.pon.y;
    this.pon.x += this.vx;
    this.pon.x = Math.floor(this.pon.x);
    this.pon.y += this.vy;

    this.setIndex();

    this.resetState();

    if(this.eft.flag)this.eft.update(this.pon.x, this.pon.y, this.direct);
    colVertical(this);

    for(var i=0;i<PARTICLE_NUM;i++){
      if(this.ptcl[i].flag)this.ptcl[i].update();
    }
}

player.prototype.draw = function(ofx, ofy){
  this.pon.ax = this.pon.x + ofx;
  this.pon.ay = this.pon.y + ofy;
  this.weapon.ax = this.pon.x - 16 + ofx;
  this.weapon.ay = this.pon.y  + 12 + ofy;


  switch(this.state){
    case "flat":
      if(this.direct=="left"){
        if(this.vx < 0){
          this.img.draw(this.pon.ax, this.pon.ay, 3, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 3, this.index);
        }else {
          this.img.draw(this.pon.ax, this.pon.ay, 1, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 1, this.index);
        }
      }else {
        if(this.vx > 0){
          this.img.draw(this.pon.ax, this.pon.ay, 2, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 2, this.index);
        }else {
          this.img.draw(this.pon.ax, this.pon.ay, 0, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 0, this.index);
        }

      }
    break;
    case "jump":
      if(this.direct=="left"){
        this.img.draw(this.pon.ax, this.pon.ay, 5, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 5, this.index);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 4, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 4, this.index);
      }
    break;
    case "push":
      if(this.direct=="left"){
        this.img.draw(this.pon.ax, this.pon.ay, 7, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 7, this.index);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 6, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 6, this.index);
      }
    break;
    case "ladder":
      if(this.vy==0&&this.vx==0){
        this.img.draw(this.pon.ax, this.pon.ay, 8, 0);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 8, 0);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 8, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 8, this.index);
      }
    break;
    case "attack_a":
      if(this.direct=="left"){
        this.img.draw(this.pon.ax, this.pon.ay, 11, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 11, this.index);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 10, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 10, this.index);
      }
    break;
    case "attack_b":
      if(this.direct=="left"){
        this.img.draw(this.pon.ax, this.pon.ay, 13, this.index);
        if(this.index > 2){
          this.weapon.ax = this.pon.x - 32 + ofx;
        }
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 13, this.index);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 12, this.index);
        if(this.index > 2){
          this.weapon.ax = this.pon.x - 0 + ofx;
        }
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 12, this.index);
      }
    break;
    case "attack_b_f":
      if(this.direct=="left"){
        this.img.draw(this.pon.ax, this.pon.ay, 15, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 15, this.index);
      }else {
        this.img.draw(this.pon.ax, this.pon.ay, 14, this.index);
        this.weapon.draw(this.weapon.ax, this.weapon.ay, 14, this.index);
      }
    break;

    case "damaged":
      if(time%2==0){
        if(this.direct=="left"){
          this.img.draw(this.pon.ax, this.pon.ay, 17, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 1, this.index);
        }else {
          this.img.draw(this.pon.ax, this.pon.ay, 16, this.index);
          this.weapon.draw(this.weapon.ax, this.weapon.ay, 0, this.index);
        }
      }
    break;
  }
     if(this.eft.flag)this.eft.draw(ofx, ofy);
     for(var i=0;i<PARTICLE_NUM;i++){
          if(this.ptcl[i].flag)this.ptcl[i].draw(ofx, ofy);
     }
}

function plWeapon(){
  this.pon = new point();
  this.flag = false;
}

plWeapon.prototype = {
  init: function(){
    this.img = new sprite(ctx, "plWeapon01.png");
    this.img.init(64,64,64,64);
    this.index = 0;
    this.flag = true;
    this.ax = this.ay = 0;
  },
  draw: function(ax, ay, line, index){
    this.img.draw(ax, ay, line, index);
  }
}


function plEffect(){
  this.pon = new point();
  this.flag = false;
}

plEffect.prototype.init = function(state){
  this.pon.x = -100;
  this.pon.y = -100;
  this.type = state
  switch(this.type){
    case "attack_a":
      this.w = 64;
      this.h = 32;
      this.pon.ofx = 0;
      this.pon.ofy = 32;
      this.vx = 20;
      this.vy = 0;
      this.img = new sprite(ctx, "plEffect02.png");
      this.img.init(64,64,64,64);
      this.pow = 4;
    break;
    case "attack_b":
      this.w = 64;
      this.h = 32;
      this.pon.ofx = 0;
      this.pon.ofy = 32;
      this.vx = 20;
      this.vy = 0;
      this.img = new sprite(ctx, "plEffect02.png");
      this.img.init(64,64,64,64);
     this.pow = 4;
    break;
    case "attack_b_f":
      this.w = 64;
      this.h = 64;
      this.pon.ofx = 0;
      this.pon.ofy = 0;
      this.vx = 0;
      this.vy = 0;
      this.img = new sprite(ctx, "plEffect02.png");
      this.img.init(64,64,64,64);
      this.pow = 4;
    break;
  }
  this.index = 0;
  this.duration = 0;
  this.flag = true;
};

plEffect.prototype.update = function(prx, pry, dir){
  this.direct = dir;
  switch(this.type){
    case "attack_a":
      this.pon.y = pry;
      if(this.direct=="left"){
        this.pon.x = prx - 13;
      }else {
        this.pon.x = prx - 13;
      }
      if(this.index > 4)this.flag = false;
    break;
    case "attack_b":
      this.pon.y = pry;
      if(this.direct=="left"){
        this.pon.x = prx - 64;
      }else {
        this.pon.x = prx + 32;
      }
      if(this.index > 4)this.flag = false;
    break;
    case "attack_b_f":
      this.pon.y = pry;
      if(this.direct=="left"){
        this.pon.x = prx - 16;
      }else {
        this.pon.x = prx - 16;
      }
      if(this.index > 3)this.flag = false;
    break;
  }

  this.duration++;
};

plEffect.prototype.draw = function(ofx, ofy){
  this.pon.ax = this.pon.x + ofx;
  this.pon.ay = this.pon.y + ofy;
  switch(this.type){
     case "attack_a":
      if(this.direct=="left")this.img.draw(this.pon.ax, this.pon.ay, 1, this.index);
      else this.img.draw(this.pon.ax, this.pon.ay, 0, this.index);
     break
     case "attack_b":
      if(this.direct=="left")this.img.draw(this.pon.ax, this.pon.ay, 3, this.index);
      else this.img.draw(this.pon.ax, this.pon.ay, 2, this.index);
     break
    case "attack_b_f":
      if(this.direct=="left")this.img.draw(this.pon.ax, this.pon.ay, 5, this.index);
      else this.img.draw(this.pon.ax, this.pon.ay, 4, this.index);
    break;
    default:
  }
  this.index++;
};