// 今後の予定
// ・ladderの追加 　　　　　　やった
// ・マップの限定描画　　　　　 やった
// ・オフセットの適用　　　　　　 やった
// ・ステージ②のドット　　　　　　そこそこ
// ・ステージ選択画面の追加　仮のものなら
// ・マップの拡大　　　　　　　　　やった
// ・デバッグ用項目の追加　　　やった
// ・洞窟用ドットの追加　　　　　やった
// ・きのこのマップ配置　　　　　　やった
// ・水アニメーションの追加　　　　やった
// ・背景のループ　　　　　　　　　やった
// ・敵キャラの作成　　　　　　　　やった
// ・サイトのレスポンシブ化　　　　やった
// ・プラフォの追加　　　　　　　　　やった
// ・槍アニメーソンの追加　　　　　やった
// ・オブジェクトとのあたり判定追加　やった
// ・パーティクルの追加             やった
// ・敵キャラの追加                 未
// ・―敵キャラ行動パターンの追加
//      1.スライム
//      2.こうもり
//      3.植物
//      4.獣
// ・被弾、死亡アニメの追加
// ・箱は破壊可？
//バグ修正　補正の暴発　　　　　やった

// ・天候：陽光の追加　　　　　
// ・動体の追加(草、水)　　　　やった
// ・森を抜けて　　　　　　　　　　

// ・webglの適用　鬼門

var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 640;
var DRAW_WIDTH = 480;
var DRAW_HEIGHT = 320;
var TILE_LENGTH = 32;
var PARTICLE_NUM = 10;

window.addEventListener("load",loadItems,false);

function loadItems(){
  getImages.load(0);
}

var frame = 0;
var time = 0;
var mapArray;
var backArray;
var ctx;
var cMap;

function startUp(map){
  var screen = document.getElementById("canvas");
  ctx = screen.getContext('2d');
  screen.style.width = CANVAS_WIDTH + "px"; screen.style.height = CANVAS_HEIGHT + "px";
  screen.width = DRAW_WIDTH; screen.height = DRAW_HEIGHT;
  screen.style.backgroundImage = "url('imgs/map.jpg')"; screen.style.backgroundRepeat = "x-repeat";
  screen.style.bacgroundPosition = "0px 0px";
  keyFunc.bind();
  var gp = new GamePanel();
  var phase = new phaseManager();
  var slp = new SelectPanel();
  slp.init();

  var game_state = 'SELECT';
  (function run(){
    (function main(){
      if(frame%2==0){
        switch(game_state){
          case 'SELECT':
            slp.update();
            slp.draw();
          break;
          case 'MAIN':
            gp.update();
            gp.draw();
          break;
        }
        time++;
      }
      frame++;
    })();
  requestAnimationFrame(run);
  })();

  function GamePanel(){
    var frame,time,d_time,ClearFLG;
    var x,y,a,t,v0;
    var ofx,ofy;
    var rectSize; var stgNum;
    var crtPhase, pstPhase;
    var qu;
    var brk;
    var boxer;
    var enemy;
    var menu;
    var mkMap = new makeMap();
    var objs;
    var boxNum = 4;
    this.init = function(stageNum){
      stgNum = stageNum;
      mapArray = map["stage"+stgNum];
      ofx = 0;
      ofy = 0;
      qu = new player();
      menu = new information();
      qu.init();
      enemy = locateEnemy();
      boxer = [];
      for(var i=0;i<boxNum;i++){
        boxer[i] = new box();
        boxer[i].init(i);
      }

      menu.init();
    };

    this.update = function(){
      if(keyFunc.detect(8)){
        game_state = "SELECT";
      }
      ofx = limitX(qu.pon.x, phase);
      ofy = limitY(qu.pon.y);
      if(phase.isChanged(qu.pon.x)){
        console.log("changed");
        for(var i=0;i<1;i++){
          if(enemy[i].spPhaseX==phase.getCrtPhase())enemy[i].init();
        }
        //マップオブジェクトの取得
        mkMap.draw(phase.getCrtPhase());
        cMap = mkMap.getMap();
        objs = mkMap.getObj();
      }

      qu.update();
      for(var i=0;i<enemy.length;i++)enemy[i].update();
      for(var i=0;i<boxer.length;i++)boxer[i].update();

      menu.update(qu.getInfo());
      updateMap(objs);

      //プレイヤーと核的の判定
      for(var i=0;i<enemy.length;i++){
        if(enemy[i].alive){
          if(isSquareIn(qu, enemy[i])){
            if(!qu.inv)qu.setDamage(5, qu.direct);
          }
        }
      }
      //箱の判定諸々
      for(var i=0;i<boxer.length;i++){
        //プレイヤーと箱の判定
        if(isSquareIn(qu, boxer[i])){
          var hit = getHitDirection(qu,boxer[i]);
          if(qu.state=="push"){
            boxer[i].getAffectX(qu.vx, hit);
          }
        }

        //敵と箱あたり判定
        for(var j=0;j<enemy.length;j++){
          if(enemy[j].alive){
            if(isSquareIn(enemy[j],boxer[i])){
              getHitDirection(enemy[j],boxer[i]);
            }
          }
        }
        //箱と箱の判定
        for(var j=0;j<boxer.length;j++){
          if(i!=j){
            if(isSquareIn(boxer[i], boxer[j])){
              var hit = getHitDirection(boxer[i], boxer[j]);
              if(hit=="bottom"){
                boxer[j].setBoxWeight();
              }
            }
          }
        }
      }
      //エフェクトの判定
      if(qu.eft.flag){
        for(var i=0;i<objs.brk.length;i++){
          if(isSquareIn(qu.eft,objs.brk[i])){
            objs.brk[i].setDamage(10);
          }
        }
        for(var i=0;i<enemy.length;i++){
          if(enemy[i].alive){
            if(isSquareIn(qu.eft, enemy[i])){
              if(!enemy[i].inv)enemy[i].setDamage(qu.eft.pow, qu.eft.direct);
            }
          }
        }
      }

    };

    this.draw = function(){

      ctx.clearRect( 0, 0, screen.width, screen.height);

      ctx.drawImage(cMap[1], -ofx, -ofy, screen.width, screen.height, 0, 0, screen.width, screen.height);
      ctx.drawImage(cMap[0], -ofx, -ofy, screen.width, screen.height, 0, 0, screen.width, screen.height);
      drawMap(ofx,ofy,objs);
      for(var i=0;i<boxNum;i++){
        boxer[i].draw(ofx, ofy);
      }

      for(var i=0;i<enemy.length;i++){
        enemy[i].draw(ofx, ofy);
      }
      qu.draw(ofx, ofy);
      menu.draw();
      ctx.drawImage(cMap[2], -ofx, -ofy, screen.width, screen.height, 0, 0, screen.width, screen.height);
    }
  }

  function SelectPanel(){
    var counter,frame,af_push,time;
    var STAGE_MAX;
    var selector, pushing;
    var stx,sty,w,h;

    this.init = function(){
      STAGE_MAX = 5;
      selector = 0;
      pushing = false;
      spx = 100;
      spy = 50;
      w = 50;
      h = 50;
    };

    this.update = function(){
      selector = Math.min(selector, STAGE_MAX-1);
      selector = Math.max(selector, 1);
      if(pushing==false){
          if(keyFunc.detect(37)){
              pushing = true;
              selector -= 1;
          }else if(keyFunc.detect(39)){
              pushing = true;
              selector += 1;
          }
      }
      if(keyFunc.keyUp()){
          pushing = false;
      }
      if(keyFunc.detect(13)){
        switch(selector){
          case 1:
            game_state = 'MAIN';
            gp.init(selector);
            break;
          case 2:
            game_state = 'MAIN';
            gp.init(selector);
            break;
        }
      }
    };

    this.draw = function(){
      ctx.clearRect( 0, 0, canvas.width, canvas.height);
      drawer.alpha(ctx, 160, 100, 30, '#ddd', 'Stage Select');
      for(var i=0;i<STAGE_MAX;i++){
          drawer.fillrect(ctx, i*70-1 + spx, -1 + spy, w+2, h+2, '#fff');
          drawer.fillrect(ctx, i*70 + spx, 0 + spy, w, h, '#ddd');
          drawer.alpha(ctx, i*70+20 + spx, 30 + spy, 20, '#333', i+1);
      }
      if(selector>=1&&selector<=4){
          drawer.rect(ctx, selector*70-1 + spx, -1 + spy, w+2, h+2, '#000');
          drawer.rect(ctx, selector*70-2 + spx, -2 + spy, w+1, h+1, '#000');
      }
    }
  }
}