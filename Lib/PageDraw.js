function CPoint(){

}

CPoint.prototype.x = 0;
CPoint.prototype.y = 0;
CPoint.prototype.SetXY = function(x,y){
  this.x = x;
  this.y = y;
}

function CSize(){

}
CSize.prototype.cx = 1;
CSize.prototype.cy = 1;
CSize.prototype.Set = function(cx,cy){
  this.cx = cx;
  this.cy = cy;
}

function CMsg(eMsg,wParam,lParam,szParam,stParam){
  this.eMsg = typeof eMsg !== 'undefined' ? eMsg : 0;
  this.wParam = typeof wParam !== 'undefined' ? wParam : 0;
  this.lParam = typeof lParam !== 'undefined' ?  lParam : 0;
  this.szParam = typeof szParam !== 'undefined' ? szParam : '';
  this.stParam = typeof stParam !== 'undefined' ? stParam : null;
}

CMsg.prototype.eMsg = 0;
CMsg.prototype.wParam = 0;
CMsg.prototype.lParam = 0;
CMsg.prototype.szParam = '';
CMsg.prototype.stParam = null;

function CPage() {
}

CPage.prototype.m_hwnd=null;
CPage.prototype.m_dc=null;
CPage.prototype.m_cx = 1;
CPage.prototype.m_cy = 1;
CPage.prototype.m_szIdCanvas = null;

CPage.prototype.InitCPage = function(sz_Canvas){
  this.m_hwnd = document.getElementById(sz_Canvas);
  this.m_dc = this.m_hwnd.getContext("2d");
  this.m_cx = this.m_hwnd.width;
  this.m_cy = this.m_hwnd.height;
}

 CPage.prototype.DrawFillBox = function( x,y,cx,cy,sz_RGB){
  this.m_dc.fillStyle = sz_RGB;
  this.m_dc.beginPath();
  this.m_dc.rect(x,y,cx,cy);
  this.m_dc.fill();
}

 CPage.prototype.DrawLineBox = function( x,y,cx,cy,width,sz_RGB){
  this.m_dc.strokeStyle = sz_RGB;
  this.m_dc.lineWidth = width;
  this.m_dc.beginPath();
  this.m_dc.rect(x,y,cx,cy);
  this.m_dc.stroke();
}

CPage.prototype.LineH = function (x, y, cy,sz_RGB,width){
  if (typeof width !== 'undefined')
    this.m_dc.lineWidth = width;
  if (typeof sz_RGB !== 'undefined')
      this.m_dc.strokeStyle = sz_RGB;

  this.m_dc.beginPath();
  this.m_dc.moveTo(x, y);
  this.m_dc.lineTo(x, y + cy - 1);
  this.m_dc.stroke();
}

CPage.prototype.LineV = function (x, y, cx,sz_RGB,width){
  if (typeof width !== 'undefined')
    this.m_dc.lineWidth = width;
  if (typeof sz_RGB !== 'undefined')
      this.m_dc.strokeStyle = sz_RGB;

  this.m_dc.beginPath();
  this.m_dc.moveTo(x, y);
  this.m_dc.lineTo(x + cx - 1, y);
  this.m_dc.stroke();
}

 CPage.prototype.DrawOutLineBox = function(x, y, cx, cy, width , sz_RgbFill, sz_RgbOutLine){
  this.m_dc.fillStyle = sz_RgbFill;
  this.m_dc.beginPath();
  this.m_dc.rect(x,y,cx,cy);
  this.m_dc.strokeStyle = sz_RgbOutLine;
  this.m_dc.fill();
  this.m_dc.lineWidth = width;
  this.m_dc.stroke();
}

CPage.prototype.DrawText = function(x, y, sz_Text, sz_Font, sz_Align, sz_Rgb){
 this.m_dc.fillStyle = sz_Rgb;
 this.m_dc.font = sz_Font;
 this.m_dc.textAlign = sz_Align;
 this.m_dc.fillText(sz_Text, x, y);
}

CPage.prototype.DrawCircle = function(x, y, cx, cy, sz_Rgb){
 this.m_dc.fillStyle = sz_Rgb;
 if (cx === cy){
   let r = cx / 2;
   this.m_dc.beginPath();
   this.m_dc.arc(r + x, r + y, r, 0, Math.PI * 2);
   this.m_dc.closePath();
   this.m_dc.fill();
 }
}

CPage.prototype.DrawX = function(x, y, cx, cy, sz_Rgb, width){
 this.m_dc.strokeStyle = sz_Rgb;
 this.m_dc.lineWidth = (typeof width !== 'undefined') ? width : 1;
 this.m_dc.beginPath();
 this.m_dc.moveTo(x, y);
 this.m_dc.lineTo(x + cx - 1, y + cy -1);
 this.m_dc.moveTo(x + cx - 1, y);
 this.m_dc.lineTo(x, y + cy -1);
 this.m_dc.stroke();
}

CPage.prototype.DrawCircleBox = function(x, y, cx, cy, sz_Rgb){
 this.m_dc.fillStyle = sz_Rgb;
 if (cx >= cy){
   let r = cy / 2;

   this.m_dc.beginPath();
   this.m_dc.rect(x+r,y,cx-r*2,cy);
   this.m_dc.closePath();
   this.m_dc.fill();

   this.m_dc.beginPath();
   this.m_dc.arc(r + x, r + y, r, 0, Math.PI * 2);
   this.m_dc.closePath();
   this.m_dc.fill();

   this.m_dc.beginPath();
   this.m_dc.arc(x+cx-r, r + y, r, 0, Math.PI * 2);
   this.m_dc.closePath();
   this.m_dc.fill();
 }
}

CPage.prototype.DrawSprite = function(x,y,st_Sprite,i_Frame,f_Alpha,f_Zoom){
 if (typeof st_Sprite !== 'undefined' &&
     i_Frame < st_Sprite.m_arstFrame.length &&
     st_Sprite.m_isLoad){
       this.m_dc.globalAlpha = typeof f_Alpha !== 'undefined' ? f_Alpha : 1;

       if ((typeof f_Zoom !== 'undefined') && f_Zoom != 1){
         let f = st_Sprite.m_arstFrame[i_Frame];

         let cxDest = f.cxDest;
         let cyDest = f.cyDest;

         let f_GapX = cxDest;
         cxDest *=  f_Zoom;
         f_GapX -= cxDest;
         x += (f_GapX / 2);

         let f_GapY = cyDest;
         cyDest *=  f_Zoom;
         f_GapY -= cyDest;
         y += (f_GapY / 2);

         this.m_dc.drawImage(st_Sprite.m_Img, f.x, f.y, f.cx, f.cy, x,y, cxDest, cyDest);
       }else{
         let f = st_Sprite.m_arstFrame[i_Frame];

         if (f.cx <= 0){

         }else{
           this.m_dc.drawImage(st_Sprite.m_Img, f.x, f.y, f.cx, f.cy, x,y, f.cxDest, f.cyDest);
         }
       }
     }
}

CPage.prototype.SetCenterV = function(is_CenterV){
 if (is_CenterV){
   this.m_dc.textBaseline = 'middle';
 }
 else{
   this.m_dc.textBaseline = 'top';
 }
}

CPage.prototype.SetBottom = function(is_Bottom){
 if (is_Bottom){
   this.m_dc.textBaseline = 'bottom';
 }
 else{
   this.m_dc.textBaseline = 'top';
 }
}
