function CColorBtn(){

}

CColorBtn.prototype.m_szBack='RGB(200,200,200)';
CColorBtn.prototype.m_szDisable='RGBA(200,200,200,0.5)';
CColorBtn.prototype.m_szFont='RGB(0,0,0)';
CColorBtn.prototype.m_szFontDisable='RGB(128,128,128)';

CColorBtn.prototype.Read = function(st_Rgb){
  this.m_szBack = st_Rgb.m_szBack;
  this.m_szDisable = st_Rgb.m_szDisable;
  this.m_szFont = st_Rgb.m_szFont;
  this.m_szFontDisable = st_Rgb.m_szFontDisable;
}

CColorBtn.prototype.SetDisableFromNormal = function(){
  this.m_szDisable = this.m_szBack;
  this.m_szFontDisable = this.m_szFont;
}

CColorBtn.prototype.Clone = function(){
  let rgbRet=new CColorBtn();
  rgbRet.Read(this);
  return rgbRet;
}

function CBtn() {

}

CBtn.prototype.m_x  = 0;
CBtn.prototype.m_y  = 0;
CBtn.prototype.m_cx = 1;
CBtn.prototype.m_cy = 1;
CBtn.prototype.m_szName = '';
CBtn.prototype.m_Right= 0;
CBtn.prototype.m_Bottom= 0;
CBtn.prototype.m_stPage = null;
CBtn.prototype.m_szTemp = '';
CBtn.prototype.m_sndClick = null;

CBtn.prototype.m_Show = true;
CBtn.prototype.m_Enable = true;
CBtn.prototype.m_ID = 0;
CBtn.prototype.GetID = function(){
  return this.m_ID;
}

// CBtn.prototype.m_Rgb = CColorBtn.prototype;
// CBtn.prototype.m_RgbBackup = CColorBtn.prototype;

CBtn.prototype.m_Rgb;
CBtn.prototype.m_RgbBackup;

CBtn.prototype.m_posClickOff = null;
CBtn.prototype.m_szFont = null;
CBtn.prototype.m_stTemp = null;

CBtn.prototype.IsShow = function(){return this.m_Show;}
CBtn.prototype.IsEnable = function(){return this.m_Enable;}

CBtn.prototype.BackupRGB = function(){
    this.m_RgbBackup.Read(this.m_Rgb);
}

CBtn.prototype.RestoreRGB = function(){
    this.m_Rgb.Read(this.m_RgbBackup);
}

CBtn.prototype.SetRGB = function(st_Rgb){
    this.m_Rgb.Read(st_Rgb);
}

CBtn.prototype.GetRGB = function(){
    return this.m_Rgb;
}

CBtn.prototype.GetGradient = function(r,g,b){
  var gRet=null;
  if (this.m_cx===this.m_cy){
    let siz=new CSize(this.m_cx,this.m_cy);
    let pos=new CPoint(siz.GetCenterX(siz.cx * 2,this.m_x),siz.GetCenterY(siz.cy * 2,this.m_y));
    gRet = this.m_stPage.GetGradientCircle(pos.x,pos.y,1,pos.x,pos.y,this.m_cx / 2);

    gRet.addColorStop(0, 'RGB(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')');
    gRet.addColorStop(0.7, 'RGB(' + Math.floor(r * 0.85) + ',' + Math.floor(g * 0.85) + ',' + Math.floor(b * 0.85) + ')');
    gRet.addColorStop(1, 'RGB(' + Math.floor(r * 0.50) + ',' + Math.floor(g * 0.50) + ',' + Math.floor(b * 0.50) + ')');

  }else{
      gRet = this.m_stPage.GetGradientLine(this.m_x,this.m_y,this.m_x,this.m_y+this.m_cy-1);
      gRet.addColorStop(0, 'RGB(' + Math.floor(r * 0.75) + ',' + Math.floor(g * 0.75) + ',' + Math.floor(b * 0.75) + ')');
      gRet.addColorStop(0.5, 'RGB(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')');
      gRet.addColorStop(1, 'RGB(' + Math.floor(r * 0.4) + ',' + Math.floor(g * 0.4) + ',' + Math.floor(b * 0.4) + ')');
  }

  // console.log(gRet);

  return gRet;
}

CBtn.prototype.SetShow = function(is_Show){
  if (this.m_Show != is_Show){
    this.m_Show = is_Show;
    return true;
  }
  return false;
}


CBtn.prototype.SetEnable = function(is_Enable){
    if (this.m_Enable != is_Enable){
      this.m_Enable = is_Enable;
      return true;
    }
    return false;
}

CBtn.prototype.InitCBtn = function(sz_Name,x,y,cx,cy,st_Page,is_Show,is_Enable,i_ID,f_RatioFont){
  f_RatioFont = typeof f_RatioFont !== 'undefined' ? f_RatioFont : 0.7;
  this.m_x  = x;
  this.m_y  = y;
  this.m_cx = cx;
  this.m_cy = cy;
  this.m_szName = sz_Name;
  this.m_Right= x + cx -1;
  this.m_Bottom= y + cy - 1;
  this.m_stPage = st_Page;

  this.m_ID = typeof i_ID !== 'undefined' ? i_ID : true;
  this.m_Show = typeof is_Show !== 'undefined' ? is_Show : true;
  this.m_Enable = typeof is_Enable !== 'undefined' ? is_Enable : true;

  this.m_szFont = Math.floor(this.m_cy * f_RatioFont) + 'px arial';

  this.m_Rgb = new CColorBtn();
  this.m_RgbBackup = new CColorBtn();
  this.m_posClickOff = new CPoint();
}

CBtn.prototype.OnL_Down = function(x,y){
  // let szLog = 'x :'+ x+',y :'+y+',Rect('+this.m_x+','+this.m_y+','+this.m_Right+','+this.m_Bottom;
  // console.log(szLog);
  let Ret= (this.m_Show && this.m_Enable &&
    x >= this.m_x && x <= this.m_Right &&
    y >= this.m_y && y <= this.m_Bottom);
  // console.log(Ret);
  if (Ret)
  {
    this.m_posClickOff.x = x - this.m_x;
    this.m_posClickOff.y = y - this.m_y;
    if (null !== this.m_sndClick)
      this.m_sndClick.Play();
  }

  return Ret;
 }

 CBtn.prototype.GetCRect =function(){
   let rcRet = new CRect(this.m_x,this.m_y,this.m_cx,this.m_cy);
   return rcRet;
 }

 CBtn.prototype.DrawCustomRGB = function(st_RGB,rc,f_Alpha)
 {
   st_RGB = typeof st_RGB !== 'undefined' ? st_RGB : this.m_Rgb;
   rc = typeof rc !== 'undefined' ? rc : new CRect(this.m_x,this.m_y,this.m_cx,this.m_cy);
   f_Alpha = typeof f_Alpha !== 'undefined' ? f_Alpha : 1;
   // console.log(f_Alpha);

   this.m_stPage.globalAlpha = f_Alpha;

   if (rc.cx <= rc.cy)
   {
     this.m_stPage.DrawCircle(rc.x,rc.y,rc.cx,rc.cy,
       this.m_Enable ? st_RGB.m_szBack : st_RGB.m_szDisable);
   }
   else
   {
     this.m_stPage.DrawCircleBox(rc.x,rc.y,rc.cx,rc.cy,
       this.m_Enable ? st_RGB.m_szBack : st_RGB.m_szDisable);
   }
   this.m_stPage.SetCenterV(true);
   this.m_stPage.DrawText(Math.floor(rc.cx/2+rc.x),Math.floor(rc.cy/2+rc.y),this.m_szName,
                          this.m_szFont,"center",
                          this.m_Enable ? st_RGB.m_szFont : st_RGB.m_szFontDisable);
 }

CBtn.prototype.DrawDef = function(){
 if (this.m_Show)
 {
   this.DrawCustomRGB(this.m_Rgb);
 }
}
