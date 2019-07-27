function CFrame(x,y,cx,cy,cxDest,cyDest){
  this.x = typeof x !== 'undefined'  ? x : 0;
  this.y = typeof y !== 'undefined'  ? y : 0;
  this.cx = typeof cx !== 'undefined'  ? cx : 1;
  this.cy = typeof cy !==  'undefined' ? cy : 1;
  this.cxDest = typeof cxDest !== 'undefined'  ? cxDest : this.cx;
  this.cyDest = typeof cyDest !== 'undefined'  ? cyDest : this.cy;
}
CFrame.prototype.x = 0;
CFrame.prototype.y = 0;
CFrame.prototype.cx = 1;
CFrame.prototype.cy = 1;
CFrame.prototype.cxDest = 1;
CFrame.prototype.cyDest = 1;

function CSprite(){

}

CSprite.prototype.m_Img;
CSprite.prototype.m_isLoad=false;
CSprite.prototype.m_cxSrc = 0;
CSprite.prototype.m_cySrc = 0;
CSprite.prototype.m_cx = 0;
CSprite.prototype.m_cy = 0;
CSprite.prototype.m_CntFail = 0;
CSprite.prototype.m_arstFrame;

CSprite.prototype.ReLoadSize = function(){
  if (this.m_isLoad && this.m_arstFrame.length > 0 && this.m_cxSrc <= 0){
    console.log('cx :' + this.m_Img.naturalWidth + ',cy :' + this.m_Img.naturalHeight);
    this.m_cxSrc = this.m_Img.naturalWidth;
    this.m_cySrc = this.m_Img.naturalHeight;
    if (0 === this.m_cx)
      this.m_cx = this.m_cxSrc;

    if (0 === this.m_cy)
        this.m_cy = this.m_cySrc;

    this.m_arstFrame[0].cx = this.m_cxSrc-1;
    this.m_arstFrame[0].cy = this.m_cySrc-1;
    console.log(this);
  }
}

CSprite.prototype.OnLoad = function(){
  if (this.m_CntFail < 3 && (this.m_Img.naturalWidth <= 0 || this.m_Img.naturalHeight <= 0)){
    // console.log(this.m_Img.src + ' Load Fail');
    // console.log('cx :'+this.m_Img.naturalWidth+',cy :'+this.m_Img.naturalHeight);
    // console.log(this);
    this.m_CntFail ++;
    this.Load(this.m_Img.src);
    return;
  }
  this.m_isLoad=true;
  this.m_cxSrc = this.m_Img.width;
  this.m_cySrc = this.m_Img.height;
  if (0 === this.m_cx)
    this.m_cx = this.m_cxSrc;

  if (0 === this.m_cy)
      this.m_cy = this.m_cySrc;


  this.m_arstFrame = new Array();
  this.m_arstFrame.push(new CFrame(0,0,this.m_cxSrc-1,this.m_cySrc-1));

  let szLog = this.m_Img.src + ',cx :' + this.m_cxSrc + ',cy :' + this.m_cySrc;
  // console.log(this);
}

CSprite.prototype.Load = function(sz_File,cx,cy){
  this.m_cx = typeof cx !== 'undefined' ? cx : 0;
  this.m_cy = typeof cy !== 'undefined' ? cy : 0;
  this.m_Img = new Image();
  this.m_Img.addEventListener('load',this.OnLoad(),false);
  this.m_Img.src = sz_File;
  //this.m_Img.onload = this.OnLoad();

}

CSprite.prototype.LoadFromID = function(sz_ID){
  this.m_Img = document.getElementById(sz_ID);
  console.log(this.m_Img);
}
