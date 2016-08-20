function particle(){
    this.pon = new point();
}

particle.prototype.init = function(x, y, type){
    this.pon.x = x + 16;
    this.type = type;
    switch(this.type){
        case "water":
            this.vecx = rand(-5, 5);
            this.vecy = rand(-7, -3);
            this.size = 3;
            this.max = 12;
            this.color = "#def"
            this.pon.y = y + 48;
        break;
        case "air":
            this.vecx = 0;
            this.vecy = -2;
            this.size = 3;
            this.max = 12;
            this.color = "#aef"
            this.pon.y = y + 48;
        break;
        default:
            this.vecx = rand(-5, 10);
            this.vecy = rand(-10, 2);
            this.size = 15;
            this.max = 10;
            this.color = "#933"
            this.pon.y = y + 16;
        break;
    }
    this.duration = 0;
    this.flag = true;
}

particle.prototype.update = function(){
    switch(this.type){
        case "water":
            this.pon.x += this.vecx;
            this.pon.y += this.vecy * 2;
            this.vecy += 1;
            this.duration++;
            this.max < this.duration?this.flag = false:true;
        break;
        case "air":
            this.pon.x += this.vecx;
            this.pon.y += this.vecy;
            this.duration++;
            this.max < this.duration?this.flag = false:true;
        break;
        default:
            this.pon.x += this.vecx;
            this.pon.y += this.vecy * 2;
            this.vecy += 2;
            this.size -= 2;
            this.duration++;
            this.max < this.duration?this.flag = false:true;
        break;
    }
}

particle.prototype.draw = function(ofx, ofy){
    this.pon.ax = this.pon.x + ofx;
    this.pon.ay = this.pon.y + ofy;
            drawer.fillrect(ctx, this.pon.ax, this.pon.ay,this.size, this.size, this.color);
}

function deathEffect(){
    this.pon = new point();
}

deathEffect.prototype.init = function(x, y, dir){
    this.dir=="left"?this.pon.x = x - 32:this.pon.x = x;
    this.pon.y = y;
    this.img = new sprite(ctx, "deathEffect.png");
    this.img.init(48,48,48,48);
    this.dir = dir;
    this.index = 0;
    this.flag = true;
}

deathEffect.prototype.update = function(){

    this.index > 5?this.flag = false:true;
    this.index++;
}

deathEffect.prototype.draw = function(ofx, ofy){

    this.pon.ax = this.pon.x + ofx;
    this.pon.ay = this.pon.y + ofy;
    if(this.dir=="left")this.img.draw(this.pon.ax, this.pon.ay, 0, this.index);
    else this.img.draw(this.pon.ax, this.pon.ay, 1, this.index);
}