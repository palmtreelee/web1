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

// CBtn.prototype.m_Rgb = CColorBtn.prototype;
// CBtn.prototype.m_RgbBackup = CColorBtn.prototype;

CBtn.prototype.m_Rgb;
CBtn.prototype.m_RgbBackup;

CBtn.prototype.m_szFont = null;

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

CBtn.prototype.InitCBtn = function(sz_Name,x,y,cx,cy,st_Page,is_show,is_enable,i_ID){
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

  this.m_szFont = Math.floor(this.m_cy*70/100) + 'px arial';

  this.m_Rgb = new CColorBtn();
  this.m_RgbBackup = new CColorBtn();
}

CBtn.prototype.OnL_Down = function(x,y){
  // let szLog = 'x :'+ x+',y :'+y+',Rect('+this.m_x+','+this.m_y+','+this.m_Right+','+this.m_Bottom;
  // console.log(szLog);
  let Ret= (this.m_Show && this.m_Enable &&
    x >= this.m_x && x <= this.m_Right &&
    y >= this.m_y && y <= this.m_Bottom);
  // console.log(Ret);
  if (null !== this.m_sndClick)
    this.m_sndClick.Play();
  return Ret;
 }

 CBtn.prototype.DrawCustomRGB = function(st_RGB){
   st_RGB = typeof st_RGB !== 'undefined' ? st_RGB : this.m_Rgb;
   if (this.m_cx <= this.m_cy)
   {
     this.m_stPage.DrawCircle(this.m_x,this.m_y,this.m_cx,this.m_cy,
       this.m_Enable ? st_RGB.m_szBack : st_RGB.m_szDisable);
   }
   else
   {
     this.m_stPage.DrawCircleBox(this.m_x,this.m_y,this.m_cx,this.m_cy,
       this.m_Enable ? st_RGB.m_szBack : st_RGB.m_szDisable);
   }
   this.m_stPage.SetCenterV(true);
   this.m_stPage.DrawText(Math.floor(this.m_cx/2+this.m_x),Math.floor(this.m_cy/2+this.m_y),this.m_szName,
                          this.m_szFont,"center",
                          this.m_Enable ? st_RGB.m_szFont : st_RGB.m_szFontDisable);
 }

CBtn.prototype.DrawDef = function(){
 if (this.m_Show)
 {
   this.DrawCustomRGB(this.m_Rgb);
 }
}
