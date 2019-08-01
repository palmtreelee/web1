function CQuizWnd() {
}

CQuizWnd.prototype = new CPage();
CQuizWnd.prototype.m_First = 2;
CQuizWnd.prototype.m_Second = 1;
CQuizWnd.prototype.m_Select = 0;
CQuizWnd.prototype.m_isTTS = false;
CQuizWnd.prototype.m_arstAniCheckSelect= [];
CQuizWnd.prototype.m_posFirst = new CPoint();
CQuizWnd.prototype.m_posResult = new CPoint();
CQuizWnd.prototype.m_iResult = 0;
CQuizWnd.prototype.m_isSetHit = false;
CQuizWnd.prototype.m_rgbResult = '#CC9933'
CQuizWnd.prototype.m_szFontNumber = '';

CQuizWnd.prototype.OnTimerEx = function(t_Cur)
{
  this.m_tCur = typeof t_Cur !== 'undefined' ? t_Cur : new Date().getTime();
  if (this.IsCanDraw()){
    this.Draw();
  }
}

CQuizWnd.prototype.SetSys = function(st_Sys)
{
  this.m_First = st_Sys.m_first;
  this.m_Second = st_Sys.m_Second;
  this.m_Select = st_Sys.m_Select;
  this.m_iResult = 0;
  this.m_isSetHit = false;
}

function CQuizAniCheckSelect(){

}
CQuizAniCheckSelect.prototype = new CMoveImg();
CQuizAniCheckSelect.prototype.rgbFont = '#000000'

CQuizAniCheckSelect.prototype.e_typeResult = 1;
CQuizAniCheckSelect.prototype.eMode = 0;

CQuizWnd.prototype.SetResult = function(i_Result){
  if (i_Result !== this.m_iResult){
    this.m_iResult = i_Result;
    this.m_isNeedDraw = true;
  }
}

CQuizWnd.prototype.m_isAniLock = false;
CQuizWnd.prototype.AniCheckSelect = function (is_Start){
  is_Start = typeof is_Start !== 'undefined' ? is_Start : false;
  if (is_Start)
  {
    this.m_tSet = new Date().getTime();
    let tCur = this.m_tSet;
    this.m_arstAniCheckSelect = [];

    let tWait = 0;
    let tFly = 200;

    this.m_arstAniCheckSelect.push(new CQuizAniCheckSelect());
    let stAni=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
    stAni.SetPos(this.m_posFirst.x,this.m_posFirst.y,this.m_posResult.x,this.m_posResult.y,tCur,tFly,tWait,1);
    stAni.rgbFont = this.m_rgbResult;
    stAni.eMode = stAni.e_typeResult;
    console.log(stAni);

    this.m_isAniLock = true;
    this.m_isNeedDraw = true;
  }else{
    if (this.m_arstAniCheckSelect.length <= 0)
      return;

    let iCntAni=0;
    let iIndexDel=-1;

    for (let key in this.m_arstAniCheckSelect){
      let stAni = this.m_arstAniCheckSelect[key];
      if (false === stAni.isDelete){
        iCntAni ++;
        if (stAni.DrawRetIsEndDraw(this,this.m_tCur)){
          if (stAni.e_typeResult ===  stAni.eMode){
            this.SetResult(this.m_First);
          }

          stAni.isDelete = true;
          iIndexDel = key;
          iCntAni --;

        }else{
            if (stAni.isDrawStart){
              if (stAni.e_typeResult ===  stAni.eMode){
                this.DrawText(stAni.CurX,stAni.CurY,this.m_iResult,this.m_szFontNumber,'center',stAni.rgbFont);
                this.m_isNeedDraw = true;
              }
            }
        }
      }else{
        iIndexDel = key;
      }
    }

    if (iIndexDel >= 0)
      this.m_arstAniCheckSelect.splice(iIndexDel,1);


    if (iCntAni <= 0){
        this.m_isAniLock = false;
        this.m_isNeedDraw = true;
        this.m_tSet = 0;
        this.m_arstAniCheckSelect = [];
    }
  }
}

CQuizWnd.prototype.OnEndTTSQuiz = function ()
{
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgQuizVoiceEnd));
  g_sndClockTick.Play(0.4,true);
}

CQuizWnd.prototype.Draw = function (){
  this.m_isNeedDraw = false;
  let cy = Math.floor(this.m_cy * 0.7);
  let y = this.m_cy / 2;
  if (g_Sys.IsModeTitle())
  {
    this.DrawFillBox(0,0,this.m_cx,this.m_cy,'RGB(255,255,255)');
    this.SetCenterV(true);
    this.DrawText(this.m_cx / 2,y,'동헌이의 뺄샘교실',Math.floor(this.m_cy * 0.4) + 'px arial','center','RGB(0,0,0)');
  }
  else if (g_Sys.IsModeDragGame())
  {
    this.DrawFillBox(0,0,this.m_cx,this.m_cy,'RGB(255,255,255)');
    this.SetCenterV(true);
    this.DrawText(this.m_cx / 2,y,'문제를 끌어다가 답과 연결해요!',Math.floor(this.m_cy * 0.25) + 'px arial','center','RGB(0,0,0)');
  }
  else
  {
    let cx=this.m_cx/5;
    let x = cx / 2;
    let szAlign = 'center';
    this.m_szFontNumber = cy+"px arial";
    this.SetCenterV(true);

    this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,5,"rgb(255,255,255)","rgb(0,0,0)");
    this.DrawText(x,y,this.m_First,this.m_szFontNumber,szAlign,'RGB(0,0,255)');
    this.m_posFirst.SetXY(x,y);
    x += cx;
    this.DrawText(x,y,'-',this.m_szFontNumber,szAlign,'RGB(0,0,0)');
    x += cx;
    this.DrawText(x,y,this.m_Second,this.m_szFontNumber,szAlign,'RGB(255,0,0)');
    x += cx;
    this.DrawText(x,y,'=',this.m_szFontNumber,szAlign,'RGB(0,0,0)');
    x += cx;
    this.m_posResult.SetXY(x,y);

    if (0 === this.m_iResult){
      let gap=Math.floor((this.m_cy - cy)/2);
      this.DrawLineBox(x+gap-(cx/2),gap,cx-gap-gap,g_pageQuiz.m_cy-gap-gap,5,'RGB(0,0,0)');
    }
    else {
      this.DrawText(x,y,this.m_iResult,this.m_szFontNumber,szAlign,this.m_rgbResult);
      x += cx;
    }

    if (false === this.m_isTTS){
      this.m_isTTS = true;
      responsiveVoice.speak(g_Sys.GetStrQuiz(),'Korean Female',{onend : this.OnEndTTSQuiz});
      g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgQuizVoiceStart));
    }

    this.AniCheckSelect(false);
  }
}
