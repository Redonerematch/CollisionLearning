function brkObjects(x, y){
  this.pon = new point();
  this.pon.x = x;
  this.pon.y = y;
  this.w = 16; this.h = 16;
  this.pon.ofx = 16; this.pon.ofy = 16;
  this.img = new sprite(ctx, "mush.png");
  this.img.init(32,32,32,32);
  this.index = 0;
  this.state = "wait";
  this.ct = 0;
  this.index = 0;
  this.alive = true;
  this.tile = 1;
  this.getTile = function(){
    return this.tile;
  };
  this.setDamage = function(amount){
    this.state = "damaged";
  };
}

brkObjects.prototype.update = function(){
  if(!this.alive)return;

  if(this.state=="damaged"){
    if(this.index > 3){
      this.alive = false;
      console.log("dead");
    }else {
      if(frame%4==0)this.index++;
    }
  }
};

brkObjects.prototype.draw = function(ofx, ofy){
  if(!this.alive)return;

  this.pon.ax = this.pon.x + ofx;
  this.pon.ay = this.pon.y + ofy;
  if(this.state=="damaged"){
    this.img.draw(this.pon.ax, this.pon.ay, 1, this.index);
  }else {
    this.img.draw(this.pon.ax, this.pon.ay, 0, 0);
  }
};

//--------------------動体画像描画用関数-------------------------
var animFrame = 0;
var anmObjects = function(px, py, tile){
  switch(tile){
    case 50:
      this.tile = 0;
    break;
    case 51:
      this.tile = 1;
    break;
    case 52:
      this.tile = 2;
    break;
  }
  this.img = new sprite(ctx, "tile01_a.png");
  this.img.init(32,64,32,64);
  this.x = px;
  this.y = py;
  this.ofx = 0;
  this.ofy = -32;
  this.index = 0
}
anmObjects.prototype.draw = function(ofx,ofy){
    this.img.draw(this.x + ofx, this.y + ofy + this.ofy, this.tile, this.index);
    this.index = incIndex(20,4,this.index);
};

function updateMap(mapObj){
      for(var i=0;i<mapObj.brk.length;i++){
        mapObj.brk[i].update();
        //マップの書き換え
        if(mapObj.brk[i].alive==false)rewriteMap(mapArray["layer1"], mapObj.brk[i]);
      }
}
function drawMap(ofx, ofy,mapObj){
      //ctx.drawImage(cMap[1], -ofx, -ofy, screen.width, screen.height, 0, 0, screen.width, screen.height);
      //ctx.drawImage(cMap[0], -ofx, -ofy, screen.width, screen.height, 0, 0, screen.width, screen.height);
      for(var i=0;i<mapObj.brk.length;i++){
        mapObj.brk[i].draw(ofx, ofy);
      }
      for(var i=0;i<mapObj.anm.length; i++){
        mapObj.anm[i].draw(ofx, ofy);
      }
}


//---------------------マップ描画用関数-----------------------

var makeMap = function(){
  //insertWall(mapArray);   //マップ配列の四方に壁を追加
  //マップのセル数
  this.map_canvas = [];
  this.objects = {anm:[],brk:[]};
};

makeMap.prototype = {
    draw : function(phase){
      var tile_row = 9;
      var tile_col = 10;
      var spw = TILE_LENGTH;
      var w_length = mapArray["layer1"][0].length;
      var h_length = mapArray["layer1"].length;
      var bgnX = phase*30 - 40; //描画基準―描画範囲
      var endX = phase*30 + 40;
      //別キャンバスにマップだけ描画する

      this.map_canvas = [];
      this.objects = {anm:[],brk:[]};
      var ctx = [];
      var canvasTag = ["cmap", "bmap","omap"];
      for(var i=0;i<canvasTag.length;i++){
        this.map_canvas[i] = document.getElementById(canvasTag[i]);
        this.map_canvas[i].width = w_length*spw;
        this.map_canvas[i].height = h_length*spw;
        ctx = this.map_canvas[i].getContext('2d');
        //かぶせマップ用透過処理
        if(i==2)ctx.globalAlpha = 0.4;
        var index = i + 1;
        var layer = mapArray["layer"+index];
        var img = new sprite(ctx,mapArray["tName"][0]);
        img.init(spw,spw,spw,spw);
        var map = mapArray;
        for(var row=0;row<tile_row;row++){
          for(var col=0;col<tile_col;col++){
            for(var x=bgnX;x<endX;x++){
              for(var y=0;y<h_length;y++){
                if(layer[y][x]==col+row*10){
                  switch(col+row*10){
                    case 50:
                      img.draw(x*spw,y*spw, col, row);
                      var tmp = new anmObjects(x*spw, y*spw,50);
                      this.objects.anm.push(tmp);
                    break;
                    case 51:
                      img.draw(x*spw,y*spw, col, row);
                      var tmp = new anmObjects(x*spw, y*spw,51);
                      this.objects.anm.push(tmp);
                    break;
                    case 55:
                      img.draw(x*spw,y*spw, col, row);
                      var tmp = new brkObjects(x*spw, y*spw);
                      this.objects.brk.push(tmp);
                    break;
                   case 52:
                      img.draw(x*spw,y*spw, col, row);
                      var tmp = new anmObjects(x*spw, y*spw,52);
                      this.objects.anm.push(tmp);
                    break;
                    default:
                      img.draw(x*spw,y*spw, col, row);
                  }
                }
              }
            }
          }
        }
      }
    },
    getMap : function(){
      return this.map_canvas;
    },
    getObj : function(){
      return this.objects;
    }
};

var locateEnemy = function(){
  var enemys = [];
  var objMap = mapArray["objects"];
  var w_length = objMap[0].length - 1;
  var h_length = objMap.length - 1;
  for(var i=0;i<w_length;i++){
    for(var j=0;j<h_length;j++){
      if(objMap[j][i]!=0&&objMap[j][i] < 10){
          var type = objMap[j][i];
          var dir = rand(1,0)==1?"left":"right"
          var px = Math.ceil((i*32)/(CANVAS_WIDTH));
          var py = 0;
          enemys.push(new enemyObject());
          enemys[enemys.length - 1].setInfo(i*32, j*32, type, px - 1, py, dir);
      }
    }
  }
  return enemys;
}