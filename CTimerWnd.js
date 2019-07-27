function CTimerWnd(){

}

CTimerWnd.prototype = new CPage();
CTimerWnd.prototype.m_tSet = 0;
CTimerWnd.prototype.m_tCur = 0;
CTimerWnd.prototype.m_tLimit = 10000;
CTimerWnd.prototype.m_isNeedDraw = true;
CTimerWnd.prototype.m_sizBar = new CSize();
CTimerWnd.prototype.m_sizClock = new CSize();
CTimerWnd.prototype.m_posBar = new CPoint();
CTimerWnd.prototype.m_isSendTimeOver = false;


CTimerWnd.prototype.Init = function(sz_CanvasID){
  this.InitCPage(sz_CanvasID);

  let cy = Math.floor(this.m_cy / 2);
  let width = this.m_cx - cy * 2;

  this.m_sizBar.Set(width,cy);
  this.m_posBar.SetXY(cy/2,cy/2);
  this.m_sizClock.Set(this.m_cy-2,this.m_cy-2);
  g_sprClock.m_arstFrame.push(new CFrame(0,0,g_sprClock.m_cxSrc,g_sprClock.m_cySrc,this.m_sizClock.cx,this.m_sizClock.cy));
}

CTimerWnd.prototype.OnTimerEx = function(t_Cur)
{
  this.m_tCur = typeof t_Cur !== 'undefined' ? t_Cur : new Date().getTime();
  if (this.m_isNeedDraw){
    this.Draw();
  }
}

CTimerWnd.prototype.SetTimer = function(t_Limit,is_NeedDraw){
  console.log(t_Limit);
  this.m_tLimit = typeof t_Limit !== 'undefined' ? t_Limit : 10000;
  this.m_isNeedDraw = typeof is_NeedDraw !== 'undefined' ? is_NeedDraw : true;
  this.m_tSet = new Date().getTime();
  this.m_tCur = new Date().getTime();

  if (this.m_isNeedDraw){
    this.m_isSendTimeOver = false;
  }
}

CTimerWnd.prototype.Draw = function(){
  this.m_isNeedDraw = false;
  this.DrawFillBox(0,0,this.m_cx,this.m_cy,'#FFFFFF');
  if (this.m_tSet > 0){
    let iGap = (this.m_tCur > this.m_tSet) ? this.m_tCur - this.m_tSet : 0;
    if (this.m_tLimit > iGap){
      iGap = this.m_tLimit - iGap;
    }else{
      iGap = 0;
    }

    let sizBar = this.m_sizBar;
    let posBar = this.m_posBar;

    this.DrawCircleBox(posBar.x,posBar.y,sizBar.cx,sizBar.cy,'#000000');
    let cxBar = iGap * sizBar.cx / this.m_tLimit;
    if (cxBar < sizBar.cy)
      cxBar = sizBar.cy;
    this.DrawCircleBox(posBar.x,posBar.y,cxBar,sizBar.cy,'#BE2E1B');
    this.DrawSprite(posBar.x+cxBar-this.m_sizClock.cx/2,(this.m_cy - this.m_sizClock.cy) / 2,g_sprClock,1,1,1);

    if (false === this.m_isSendTimeOver && iGap <= 0){
        g_sndTimeStop.Play();
        g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgTimeOver));
        this.m_isSendTimeOver = true;
    }
    else{
        this.m_isNeedDraw = true;
    }
  }
}
