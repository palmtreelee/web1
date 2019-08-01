function CPoint(x,y){
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
}

CPoint.prototype.x = 0;
CPoint.prototype.y = 0;
CPoint.prototype.SetXY = function(x,y){
  this.x = x;
  this.y = y;
}

function CSize(cx,cy){
  this.cx = typeof cx !== 'undefined' ? cx : 0;
  this.cy = typeof cy !== 'undefined' ? cy : 0;
}
CSize.prototype.cx = 1;
CSize.prototype.cy = 1;
CSize.prototype.Set = function(cx,cy){
  this.cx = cx;
  this.cy = cy;
}

CSize.prototype.GetCenterX = function(cx,offX){
  offX = typeof offX != 'undefined' ? offX : 0;
  if (typeof cx === 'undefined'){
    return this.cx / 2;
  }else{
    return (cx - this.cx) / 2 + offX;
  }
}

CSize.prototype.GetCenterY = function(cy,offY){
  offY = typeof offY !== 'undefined' ? offY : 0;
  if (typeof cy === 'undefined'){
    return this.cy / 2;
  }else{
    return (cy - this.cy) / 2 + offY;
  }
}

function CRect(x,y,cx,cy){
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
  this.cx = typeof cx !== 'undefined' ? cx : 1;
  this.cy = typeof cy !== 'undefined' ? cy : 1;
}
CRect.prototype.x = 0;
CRect.prototype.y = 0;
CRect.prototype.cx = 1;
CRect.prototype.cy = 1;
CRect.prototype.Set = function(x,y,cx,cy){
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
  this.cx = typeof cx !== 'undefined' ? cx : 1;
  this.cy = typeof cy !== 'undefined' ? cy : 1;
}

CRect.prototype.GetCRectFromZoom = function(f_Zoom){
  f_Zoom = typeof f_Zoom !== 'undefined' ? f_Zoom : 1;
  if ( 1 === f_Zoom)
  {
    return new CRect (this.x,this.y,this.cx,this.cy);
  }
  else
  {
    let rcRet= new CRect() ;
    rcRet.cx = this.cx*f_Zoom;
    rcRet.cy = this.cy*f_Zoom;
    rcRet.x = this.x + (this.cx - rcRet.cx)/2;
    rcRet.y = this.y + (this.cy - rcRet.cy)/2;
    return rcRet;
  }
}

CRect.prototype.GetCRectFromCSize = function(siz){
  siz = typeof siz !== 'undefined' ? siz : new CSize(1,1);
  let rcRet= new CRect();
  rcRet.x = this.x + (this.cx - siz.cx)/2;
  rcRet.y = this.y + (this.cy - siz.cy)/2;
  rcRet.cx = siz.cx;
  rcRet.cy = siz.cy;

  return rcRet;
}

CRect.prototype.ReadZoom = function(rc,f_Zoom){
  f_zoom = typeof f_Zoom !== 'undefined' ? f_Zoom : 1;
  if ( 1 === f_Zoom)
  {
    this.x = rc.x;
    this.y = rc.y;
    this.cx = rc.cx;
    this.cy = rc.cy;
  }
  else
  {
    this.cx = rc.cx*f_Zoom;
    this.cy = rc.cy*f_Zoom;
    this.x = rc.x + (rc.cx - this.cx)/2;
    this.y = rc.y + (rc.cy - this.cy)/2;
  }
}

CRect.prototype.GetPosCenter = function(){
  let posRet = new CPoint();
  posRet.x = this.x + (this.cx / 2);
  posRet.y = this.y + (this.cy / 2);
  return posRet;
}

CRect.prototype.IsBounding = function(rc){
  return ((this.x+this.cx) > rc.x &&
            this.x < (rc.x + rc.cx) &&
            this.y < (rc.y + rc.cy) &&
            (this.y + this.cy) > rc.y);
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
CPage.prototype.m_szDiv = '';
CPage.prototype.m_isShow = true;
CPage.prototype.IsShow = function(){return (this.m_isShow !== false);}
CPage.prototype.SetShow = function(is_Show){
  let stDiv = document.getElementById(this.m_szDiv);
  if (typeof stDiv !== 'undefined'){
      stDiv.style.visibility = (false === is_Show) ? 'hidden' : 'visible';
      this.m_isShow = is_Show;
  }
}

CPage.prototype.m_isTouch = false;
CPage.prototype.IsTouch = function(){
  return this.m_isTouch;
}

CPage.prototype.GetPosFromEvent = function(st_Event){
  let posRet = new CPoint();
  if (this.IsTouch()){
    st_Event.preventDefault();
    let e = st_Event.touches[0];
    // posRet.SetXY(e.clientX,e.clientY);
    posRet.SetXY(e.pageX-this.m_rcCanvas.left,e.pageY-this.m_rcCanvas.top);
  }else{
    posRet.SetXY(st_Event.offsetX,st_Event.offsetY);
  }
  return posRet;
}

CPage.prototype.m_isEnable = true;
CPage.prototype.IsEnable = function(){return (this.is_Enable !== false);}
CPage.prototype.SetEnable = function(is_Enable){
  this.m_isEnable = is_Enable;
}
CPage.prototype.IsCanCtrl = function(){
  return (this.IsEnable() && this.IsShow());
}
CPage.prototype.m_rcCanvas = null;
CPage.prototype.m_tCur = 0;
CPage.prototype.m_tSet = 0;
CPage.prototype.m_isNeedDraw = true;
CPage.prototype.IsCanDraw = function(){
    return (this.m_isNeedDraw && this.IsShow());
}


CPage.prototype.InitCPage = function(sz_Canvas,sz_Div){
  this.m_szDiv = typeof sz_Div !== 'undefined' ? sz_Div : '';
  this.m_hwnd = document.getElementById(sz_Canvas);
  this.m_rcCanvas = this.m_hwnd.getBoundingClientRect();
  console.log(this.m_rcCanvas);
  this.m_dc = this.m_hwnd.getContext("2d");
  this.m_cx = this.m_hwnd.width;
  this.m_cy = this.m_hwnd.height;
  let filter = "win16|win32|win64|mac|macintel";
  if ( navigator.platform )
  {
    this.m_isTouch = filter.indexOf( navigator.platform.toLowerCase() ) < 0;
  }
  // this.m_isTouch = ('createTouch' in document) || ('onstarttouch' in window);
  // this.m_isTouch = true;

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

CPage.prototype.Line = function(x,y,x2,y2,width,sz_RGB){
  if (typeof width !== 'undefined')
    this.m_dc.lineWidth = width;
  if (typeof sz_RGB !== 'undefined')
      this.m_dc.strokeStyle = sz_RGB;

  this.m_dc.beginPath();
  this.m_dc.moveTo(x, y);
  this.m_dc.lineTo(x2, y2);
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
  // console.log(x + ',' + y + ',' + cx + ',' + cy );
 this.m_dc.fillStyle = sz_Rgb;
 if (cx === cy){
   let r = cx / 2;
   this.m_dc.beginPath();
   this.m_dc.arc(r + x, r + y, r, 0, Math.PI * 2);
   this.m_dc.closePath();
   this.m_dc.fill();
 }
}

CPage.prototype.DrawCircleFromCRect = function(rc,sz_Rgb){
  this.DrawCircle(rc.x,rc.y,rc.cx,rc.cy,sz_Rgb);
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
 this.m_dc.strokeStyle = sz_Rgb;
 if (cx >= cy){
   this.m_dc.lineCap = 'round';
   this.m_dc.lineWidth = cy;
   this.m_dc.beginPath();
   this.m_dc.moveTo(x+cy/2,y + cy / 2);
   this.m_dc.lineTo(x+cx-cy/2,y + cy / 2);
   this.m_dc.stroke();

   // let r = cy / 2;
   //
   // this.m_dc.beginPath();
   // this.m_dc.rect(x+r,y,cx-r*2,cy);
   // this.m_dc.closePath();
   // this.m_dc.fill();
   //
   // this.m_dc.beginPath();
   // this.m_dc.arc(r + x, r + y, r, 0, Math.PI * 2);
   // this.m_dc.closePath();
   // this.m_dc.fill();
   //
   // this.m_dc.beginPath();
   // this.m_dc.arc(x+cx-r, r + y, r, 0, Math.PI * 2);
   // this.m_dc.closePath();
   // this.m_dc.fill();
 }
}

CPage.prototype.DrawSprite = function(x,y,st_Sprite,i_Frame,f_Alpha,f_Zoom){
 if (typeof st_Sprite !== 'undefined' &&
     i_Frame < st_Sprite.m_arstFrame.length &&
     st_Sprite.m_isLoad){
       let fAlphaBackup = this.m_dc.globalAlpha;
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

       this.m_dc.globalAlpha = fAlphaBackup;
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

CPage.prototype.GetGradientLine = function(x,y,x2,y2){
  return this.m_dc.createLinearGradient(x,y,x2,y2);
}

CPage.prototype.GetGradientCircle = function(x,y,r,x2,y2,r2){
  return this.m_dc.createRadialGradient(x,y,r,x2,y2,r2);
}

CPage.prototype.RandomSwapArray = function(st_Array,i_Cnt)
{
  i_Cnt = typeof i_Cnt !== 'undefined' ? i_Cnt : 0;
  let i = 0;
  for (i = 0;i < i_Cnt;i ++)
  {
    let j = Math.floor(Math.random()*st_Array.length);
    if ( j >= st_Array.length)
      j = st_Array.length - 1;

    let stSrc = st_Array[j];

    if (typeof stSrc === 'object' || typeof stSrc === 'function')
    {
        let stTemp = $.extend(true,{},st_Array[j]);
        st_Array[j] = $.extend(true,{},st_Array[0]);
        st_Array[0] = $.extend(true,{},stTemp);
    }
    else
    {
      let iTemp1 = st_Array[j];
      let iTemp2 = st_Array[0];
      st_Array[j] = iTemp2;
      st_Array[0] = iTemp1;
    }
  }
}
