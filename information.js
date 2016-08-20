//プレイヤーのマップ座標、速度、ステート

function information(){
  var prx,pry,
        prState,prVx, prVy, prPosFlg, breath;
  var drawAreaX, drawAreaY, textAreaX, textAreaY;

  var textSize, color, bgColor, textSpace, boxWidth, boxHeight;
  this.flag = false;
}

information.prototype.init = function(){
  drawAreaX = setMapCord(1);
  drawAreaY = setMapCord(2);
  textAreaX = drawAreaX + 8;
  textAreaY = drawAreaY + 8;
  textSize = 13;
  color = "black";
  bgColor = "#efefef";
  textSpace = 16;
  boxWidth = 80;
  boxHeight = 100;
  this.flag = true;
};

information.prototype.update = function(status){
  prx = "x座標：" + status["point"].x;
  pry = "y座標：" + status["point"].y;
  prState = "状態：" + status.state;

  prVx = "x速度" + status["velocity"][0];
  prVy = "y速度" + status["velocity"][1];
  prPosFlg = "地形" + status.pos;
  prbreath = status.breath;
};

information.prototype.draw = function(){

  drawer.fillrect(ctx, drawAreaX, drawAreaY, boxWidth, boxHeight, bgColor);
  drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace, textSize, color, prx);
  drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace*2, textSize, color, pry);
  // drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace*3, textSize, color, prPosFlg);
  drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace*3, textSize, color, prState);
  drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace*4, textSize, color, prVx);
  drawer.fillalpha(ctx, textAreaX, textAreaY + textSpace*5, textSize, color, prVy);
  drawer.fillrect(ctx, textAreaX, textAreaY + textSpace*6, prbreath, 10, "#ddd");

};

function setMapCord(cord){
  return cord*32;
}

function getMapCord(cord){
  return Math.floor(cord/32);
}