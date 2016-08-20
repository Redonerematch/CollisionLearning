//---------------------
function point(){
  this.x = 0;
  this.y = 0;
  this.ofx = 0;
  this.ofy = 0;
  this.ax = 0;
  this.ay = 0;
  this.lx = 0;
  this.ly = 0;
}

//---------------------
//----------------------マップから配列を返す----------------------
var MAX_LENGTH = 11;
var wall = [30,31,32,33,34,35,36,37];
var ladder = [60,61,62,63];
var water = [70,71,72,73];
var platform = [65,66,67];
function colVertical(obj){
  var index = -1;

  var left = obj.pon.x + obj.pon.ofx;
  var right = obj.pon.x + obj.pon.ofx + obj.w;
  var top = obj.pon.y + obj.pon.ofy;
  var bottom = obj.pon.y + obj.pon.ofy + obj.h;

    //その他　変形チップ
    if(obj.vy>=0){
        for(var i=0;i<platform.length;i++){
            if(col_map(left + 5, bottom)==platform[i]||col_map(right - 5, bottom)==platform[i]){
                var btm_comp = obj.pon.y - Math.floor((obj.pon.y)/32)*32
                if(btm_comp < 12)obj.doHitCorrection("platform", btm_comp, "map");
            }
        }
    }
    if(obj.name=="player"){
        for(var i=0;i<ladder.length;i++){
            if(col_map(left + 15, top)==ladder[i]&&col_map(right - 15, top)==ladder[i]){
            obj.setPosFlg("ladder");
        }
    }
    for(var i=0;i<water.length;i++){
            if(col_map(left , bottom - 10)==water[i]||col_map(right, bottom - 10)==water[i]){
              obj.setPosFlg("water");
            }
        }
    }
    for(var i=0;i<wall.length;i++){
        //縦補正
        if(obj.vy >= 0){
            if((col_map(left, bottom)==wall[i]||col_map(right , bottom)==wall[i])){   //床に触れている
                var lft_comp = -(obj.pon.x - Math.ceil((obj.pon.x + obj.vx)/32)*32);
                var btm_comp = obj.pon.y - Math.trunc((obj.pon.y + obj.vy)/32)*32
                obj.doHitCorrection("bottom", btm_comp, "map");
                //めり込みは速度0でないなら縦の補正を無視する
                if(btm_comp != 0){
                    if(col_map(left - (obj.vx0+1), top + 1)==wall[i]||col_map(left - (obj.vx0+1), bottom - 5)==wall[i] ||
                        col_map(right + (obj.vx0), top + 1)==wall[i]||col_map(right + (obj.vx0), bottom - 5)==wall[i]){
                        //obj.doHitCorrection("bottom", btm_comp, "map");
                        continue;
                    }
                }
            }
        }else {
            if(col_map(left, top + obj.vy)==wall[i]||col_map(right , top + obj.vy)==wall[i]){   //上側の判定
                var comp = obj.vx;
                obj.doHitCorrection("top",comp, "map");
            }
        }
        //横補正
        if(obj.vx <= 0){
            if(col_map(left - (obj.vx0), top + 1)==wall[i]||col_map(left - (obj.vx0), bottom - 2)==wall[i]){
                //var lft_comp = -(obj.pon.x - Math.ceil((obj.pon.x + obj.vx)/32)*32);
                obj.doHitCorrection("left", obj.vx, "map");
            }
        }else {
            if(col_map(right + (obj.vx0), top + 1)==wall[i]||col_map(right + (obj.vx0), bottom - 5)==wall[i]){
                //var rgt_comp = (obj.pon.x - Math.floor((obj.pon.x + obj.vx)/32)*32);
                obj.doHitCorrection("right",obj.vx, "map");
            }
        }
    }

    return index;
}


function col_map(x, y){
    //表示領域外を例外として処理
    var mArray = mapArray["layer1"]
    try{
        return mArray[Math.trunc(y/32)][Math.trunc(x/32)];
    }catch(e){
        return 'undefined';
    }
}
//---------------------画像取得用関数----------------------

var getImages = function(){
  var aryImage = [];
  var aryUrl = [
  "imgs/tile01.png",
  "imgs/tile02.png",
  "imgs/block1.png",
  "imgs/saro.png",
  "imgs/mush.png",
  "imgs/deathEffect.png",
  "imgs/plEffect02.png",
  "imgs/plWeapon01.png",
  "imgs/slime.png",
  "imgs/bat.png",
  "imgs/plant.png",
  "imgs/animal.png",
  "imgs/tile01_a.png"
  ];

  return {
    load : function(index){
      var img_name = aryUrl[index].split("/").pop();
      aryImage[img_name] = new Image();
      aryImage[img_name].src = aryUrl[index];
      aryImage[img_name].onload = function(){
      if(aryUrl.length != index){
        getImages.load(index);
      }else {
        readJson();
      }
      }
      index++;
    },
    display : function(name){
      return aryImage[name];
    }
  };
}();

//---------------------キー入力感知関数--------------------------
var keyFunc = function(){
  'use strict';
  var keyArray = [];
  var code = 0;
   var up = false;
  function keyBind(evt){
    evt.preventDefault();
    code = evt.keyCode;
    keyArray[evt.keyCode] = true;
    up = false;
  }
  function keyRelease(evt){
    code = 0;
    up = true;
    keyArray[evt.keyCode] = false;
  }
  return {
    bind: function(){
      window.addEventListener('keydown',keyBind,false);
      window.addEventListener('keyup', keyRelease,false);
    },
    release: function(){
      removeEventListener('keydown',keyBind,false);
      removeEventListener('keyup', keyRelease,false);
    },
    detect: function(keycode){
      if(keyArray[keycode])return true;
      return false;
    },
    getCode: function(){
      return code;
    },
    anyCode: function(){
      return code !== 0;
    },
    keyUp: function(){
      return up;
    },
    getLRKey: function(){
      return keyArray[37]&&keyArray[39];
    }
  };
}();

//---------------------画像描画用関数-------------------------
var sprite = function(context, indexName){
  this.ctx = context;
  this.img = getImages.display(indexName);
  //var imgX, imgY, imgW, imgH;
};
sprite.prototype.init = function(sx,sy,sw,sh){   //img内での位置
  this.imgX = sx;//縦列の抽出開始位置
  this.imgY = sy;
  this.imgW = sw;
  this.imgH = sh;
};
sprite.prototype.draw = function(x, y, line, frame){
  //(img,sx,sy,sw,sh,dx,dy,dw,dh) syの位置を代えれば画像の横位置も変わる
  this.ctx.drawImage(this.img, this.imgX*line, this.imgY*frame, this.imgW, this.imgH, x, y, this.imgW, this.imgH);
};

var rand = function(max, min){     //min~max
     return Math.floor(Math.random() * (max-min) ) + min;
};

var phaseManager = function(){
  this.crtPhase = 1;
  this.pstPhase = 0;
  this.drawFlag = false;

  this.getCrtPhase = function(){
    return this.crtPhase - 1;
  }
  this.isChanged = function(prx){
    var x = prx;
    this.crtPhase = Math.ceil(x/(CANVAS_WIDTH));
    if(this.pstPhase!=this.crtPhase){
      this.drawFlag = false;
      if(!this.drawFlag){
        this.pstPhase = this.crtPhase;
        this.drawFlag = true;
        return true;
      }
    }
    return false;
  };
}

var limitX = function(x,phase){
  //-----------------画面端の挙動調整---------------------------------------
  var ofx = DRAW_WIDTH/2 - x;
  ofx = Math.min( ofx, -1);
  //ofx = Math.max( ofx, (-1000*phase.getCrtPhase)+360);
  return ofx;
}
var limitY = function(y){
  var ofy = DRAW_HEIGHT/2 - y;
  ofy = Math.min( ofy, -1);
  ofy = Math.max( ofy, DRAW_HEIGHT - mapArray["layer1"].length*32);
  return ofy;
}

//---------------------外部jsonによるマップ読み込み--------------------
function readJson(){
   'use strict';
   var stage_info;
   var data = new XMLHttpRequest();
   var url = 'stage_info.json';  //URL.クロスドメインはエラー
   data.open('GET',url);
   data.onreadystatechange = function(){
      if(data.readyState === 4){
         stage_info = data.responseText;
         stage_info = JSON.parse(stage_info);
         startUp(stage_info);
      }
   };
   data.send(null);
}


//---------------------あたり判定用関数-----------------------
//
//ポイント:移動している方向によってあたり判定を取らない！！
//------------------------------------------------------------
var isSquareIn = function(obj1, obj2){
  //
  //オブジェクト1の上下左右
  var posx1_left = obj1.pon.x + obj1.pon.ofx;
  var posx1_right =  obj1.pon.x + obj1.pon.ofx + obj1.w;
  var posy1_top = obj1.pon.y + obj1.pon.ofy;
  var posy1_bottom = obj1.pon.y + obj1.pon.ofy + obj1.h;

  //オブジェクト2の上下左右
  var posx2_left = obj2.pon.x + obj2.pon.ofx;
  var posx2_right =  obj2.pon.x + obj2.pon.ofx + obj2.w;
  var posy2_top = obj2.pon.y + obj2.pon.ofy;
  var posy2_bottom = obj2.pon.y + obj2.pon.ofy + obj2.h;

  if(posy1_bottom < posy2_top){
  }else if(posy1_top > posy2_bottom){
  }else if(posx1_right <= posx2_left){
  }else if(posx1_left >= posx2_right){
  }else {
    return true;
  }
  return false;
};

//------------------------衝突方向を検知、応答する---------------------------
var getHitDirection = function(obj1, obj2){
  var hit = "";
  //オブジェクト1の上下左右
  var posx1_left = obj1.pon.x + obj1.pon.ofx;
  var posx1_right =  obj1.pon.x + obj1.pon.ofx + obj1.w;
  var posy1_top = obj1.pon.y + obj1.pon.ofy;
  var posy1_bottom = obj1.pon.y + obj1.pon.ofy + obj1.h;

  //オブジェクト2の上下左右
  var posx2_left = obj2.pon.x + obj2.pon.ofx;
  var posx2_right =  obj2.pon.x + obj2.pon.ofx + obj2.w;
  var posy2_top = obj2.pon.y + obj2.pon.ofy;
  var posy2_bottom = obj2.pon.y + obj2.pon.ofy + obj2.h;

  if(obj1.vy >= 0){  //下
    if(posy1_bottom - posy2_top < MAX_LENGTH){
      obj1.doHitCorrection("bottom",posy1_bottom - posy2_top, "box")
      hit = "bottom";
      return hit;
    }
  }else { //----------上
    if(posy2_bottom - posy1_top < MAX_LENGTH){
      obj1.doHitCorrection("top",posy2_bottom - posy1_top, "box");
      hit = "top";
      return hit;
    }
  }

  if(obj1.vx > 0){  //右
    if(posx1_right - posx2_left < MAX_LENGTH/2){
      obj1.doHitCorrection("left",posx1_right - posx2_left, "box");
      hit = "left";
    }
  }else if(obj1.vx < 0){ //----------左
    if(posx2_right - posx1_left < MAX_LENGTH/2){
      obj1.doHitCorrection("right",posx1_left - posx2_right, "box");
      hit = "right";
    }
  }
  return hit;
}

//--------------------   html5キャンバス汎用関数-------------------
var drawer = function(){
  var x,y,size,style,text;
  return {
    fillalpha:function(ctx, x, y, size, style, text){
      ctx.textAlign = 'left';
      ctx.font = size+"px 'MS Pゴシック'";//Comic Sans MS
      ctx.fillStyle = style;
      ctx.fillText(text, x, y);
    },
    alpha:function(ctx, x, y, size, style, text){
      ctx.textAlign = 'left';
      ctx.font = size+"px 'Arial'";//Comic Sans MS
      ctx.strokeStyle = style;
      ctx.strokeText(text, x, y);
    },
    line: function(ctx, x1, y1, x2, y2, style){
      ctx.beginPath();
      ctx.strokeStyle = style;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    rect: function(ctx, x, y, w, h, style){
      ctx.beginPath();
      ctx.strokeStyle = style;
      ctx.strokeRect(x, y, w, h);
      ctx.stroke();
    },
    fillrect: function(ctx, x, y, w, h, style){
      ctx.fillStyle = style;
      ctx.fillRect(x, y, w, h);
    },
    shadowRect: function(ctx, x, y, w, h, style){
      ctx.fillStyle = style;
	ctx.shadowBlur = 10;
	ctx.shadowColor = style;
      ctx.fillRect(x, y, w, h);
    },
    arc: function(ctx, x, y, r, style){
      var startAngle = 0;
      var endAngle = 360 * Math.PI / 180;
      ctx.beginPath();
      ctx.strokeStyle = style;
      ctx.arc(x, y, r, startAngle, endAngle, false);
      ctx.stroke();
    },
    gradientRect: function(ctx, x, y, w, h, color1, color2){
      ctx.beginPath();
      var grad = ctx.createLinearGradient(x, y, x + w, y);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.rect(x, y, w, h);
      ctx.fill();
    }
  };
}();

function rewriteMap(array, obj){
  var placeX = Math.floor(obj.pon.x/32);
  var placeY = Math.floor(obj.pon.y/32);
  array[placeY][placeX]  = obj.tile;
}

function incIndex(interval,lim,num){
  if(frame%interval==0)num++;
  if(num>lim)num = 0;
  return num;
}

//-------------------------速度制限※めり込みの調整---------------------------
var maxSpeed = function(obj, xmax, ymax){
  var m_vx = obj.vx;
  var m_vy = obj.vy;
  if(obj.vx > xmax)m_vx = xmax;
  if(obj.vx < -xmax)m_vx = -xmax;
  if(obj.vy > ymax)m_vy = ymax;
  if(obj.vy < -ymax)m_vy = -ymax;
  obj.vx = m_vx;
  obj.vy = m_vy;
}
function isGround(obj){
     if(obj.colMap["bottom"]||obj.colMap["platform"]||obj.colObj["bottom"])return true;
     return false;
};

// function sleep(){
//   var timer = 0
//   var hoge = setInterval(function(){
//     timer++;
//     console.log(timer);
//     if(timer>10){
//       clearInterval(hoge)
//     }
//   }, 20000)
// }