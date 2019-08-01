function CBtnWnd() {

}

CBtnWnd.prototype = new CPage();
CBtnWnd.prototype.m_arstBtn = [];
CBtnWnd.prototype.m_btnReTry = null;
CBtnWnd.prototype.m_First = 2;
CBtnWnd.prototype.m_Second = 1;
CBtnWnd.prototype.m_Select = 0;
CBtnWnd.prototype.m_iResult = 0;
CBtnWnd.prototype.m_isSetHit = false;
CBtnWnd.prototype.m_isDrawScore = false;

CBtnWnd.prototype.m_eBtnReTry = 100;

CBtnWnd.prototype.SetHit = function(){
  if (false === this.m_isSetHit){
    this.m_isSetHit = true;
    this.m_isNeedDraw = true;
  }
}

CBtnWnd.prototype.SetResult = function(i_Result){
  if (i_Result !== this.m_iresult){
    this.m_iResult = i_Result;
    this.m_isNeedDraw = true;
  }
}

CBtnWnd.prototype.OnTimerEx = function(t_Cur)
{
  this.m_tCur = typeof t_Cur !== 'undefined' ? t_Cur : new Date().getTime();
  if (this.IsCanDraw()){
    this.Draw();
  }
}

CBtnWnd.prototype.SetSys = function(st_Sys)
{
  this.m_First = st_Sys.m_first;
  this.m_Second = st_Sys.m_Second;
  this.m_Select = st_Sys.m_Select;
  this.m_tSet = this.m_tCur;
  this.m_iResult = 0;
  this.m_isSetHit = false;
}

CBtnWnd.prototype.m_isAniLock = false;
CBtnWnd.prototype.AniCheckSelect = function (is_Start){
  is_Start = typeof is_Start !== 'undefined' ? is_Start : false;
  if (is_Start)
  {
    this.m_isAniLock = true;
    this.m_isNeedDraw = true;
    this.m_tSet = this.m_tCur;
  }else{
    if (this.m_isAniLock && (this.m_tSet + 3000) < this.m_tCur ){
        this.m_isAniLock = false;
        this.m_isNeedDraw = true;
        this.m_tSet = 0;
    }
  }
}


CBtnWnd.prototype.m_arposScore = [];
CBtnWnd.prototype.m_sizScore = new CSize();
CBtnWnd.prototype.Init = function(sz_CanvasID,sz_Div){
  this.InitCPage(sz_CanvasID,sz_Div);
  let e_CntLine = 5;
  let e_Gap = 4;

  let cx=Math.floor(this.m_cx / e_CntLine);
  this.m_sizScore.Set(cx * e_CntLine,cx);

  let x = e_Gap;
  let y = e_Gap;
  this.m_arposScore.push(new CPoint(x,y));
  let j = 1;
  for (i = 1;i < 20;i ++ , j ++){
    this.m_arstBtn.push(new CBtn());
    let stBtn = this.m_arstBtn[i-1];
    stBtn.InitCBtn(String(i),x,y,cx-e_Gap * 2,cx - e_Gap * 2,this,true,true,i);
    stBtn.m_Rgb.m_szBack = stBtn.GetGradient(200,200,200);
    stBtn.BackupRGB();
    stBtn.m_sndClick = g_sndBtnClick;

    if (j >= e_CntLine){
      j = 0;
      x = e_Gap;
      y += cx;
      this.m_arposScore.push(new CPoint(x,y));
    }
    else{
      x += cx;
    }
  }

  let siz = new CSize();
  siz.Set(Math.floor((cx * e_CntLine) * 0.8),Math.floor(cx * 0.75));
  let pos = new CPoint();
  pos.SetXY(siz.GetCenterX(this.m_cx),siz.GetCenterY(cx) + y -e_Gap);


  this.m_btnReTry = new CBtn();
  this.m_btnReTry.InitCBtn('틀린 문제만 재도전!',pos.x,pos.y,siz.cx,siz.cy,this,false,false,this.
                            m_eBtnReTry,0.55);
  this.m_btnReTry.m_sndClick = g_sndBtnClick;
  let stRgb=new CColorBtn();
  stRgb.Read(this.m_btnReTry.m_Rgb);
  stRgb.m_szBack = '#940583';
  stRgb.m_szFont = '#FFFFFF';
  this.m_btnReTry.SetRGB(stRgb);
}

CBtnWnd.prototype.OnEndTTSCheckSelect = function(){
  // console.log('OnEndTTSCheckSelect');
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSelectVoiceEnd));
}

CBtnWnd.prototype.OnEndTTSSelect = function(){
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSelectVoiceStart));
}

CBtnWnd.prototype.OnEndTTSGameOver = function(){
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgGameOver));
}

CBtnWnd.prototype.OnEndTTSReTry = function(){
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgVoiceRetryEnd));
}

CBtnWnd.prototype.SetScore =function(is_AskReTry){
  is_AskReTry = typeof is_AskReTry != 'undefined' ? is_AskReTry : false;
  let isCanReTry = (g_Sys.GetCntQuizFail() > 0);
  this.m_btnReTry.SetShow(is_AskReTry && isCanReTry);
  this.m_btnReTry.SetEnable(is_AskReTry);
  this.m_isDrawScore = true;
  this.m_isNeedDraw = true;

  if (false==is_AskReTry){
    if (isCanReTry){
      responsiveVoice.speak('틀린 문제가 있네! 틀린 문제만 다시 풀어보자!','Korean Female',
      {onend: this.OnEndTTSReTry});
    }else{
      responsiveVoice.speak('문제를 다 풀었구나! 축하해!','Korean Female',
      {onend: this.OnEndTTSGameOver});
    }
  }
}

CBtnWnd.prototype.Draw = function(){
  if (g_Sys.IsModeTitle()){
    this.DrawFillBox(0,0,this.m_cx,this.m_cy,'RGB(255,255,255)');

    this.m_isNeedDraw=false;
  }
  else if (this.m_isDrawScore){
    this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,5,"rgb(255,255,255)","rgb(0,0,0)");
    let szFont = Math.floor(this.m_sizScore.cy * 0.6) + 'px arial';
    this.SetCenterV(true);
    if (this.m_arposScore.length >= 3){
      let pos = new CPoint();
      pos.SetXY(this.m_arposScore[0].x,this.m_arposScore[0].y);
      pos.SetXY(this.m_sizScore.GetCenterX(this.m_sizScore.cx * 2,pos.x),this.m_sizScore.GetCenterY(this.m_sizScore.cy * 2,pos.y))
      this.DrawText(pos.x, pos.y, '전체문제 : ' + g_Sys.GetCntTotalQuiz() + '개', szFont, 'center', '#000000');
      pos.y += this.m_sizScore.cy;
      this.DrawText(pos.x, pos.y, '정 답 : ' + g_Sys.GetCntQuizSuccess() + '개', szFont, 'center', '#052F7D');
      pos.y += this.m_sizScore.cy;
      if (g_Sys.IsCanReTry()){
          this.DrawText(pos.x, pos.y, '틀린문제 : ' + g_Sys.GetCntQuizFail() + '개', szFont, 'center', '#7E0D04');
      }else{
          this.DrawText(pos.x, pos.y, '축하합니다.!', szFont, 'center', '#7E0D04');
      }
      pos.y += this.m_sizScore.cy;
    }

    this.m_btnReTry.DrawDef();
    this.m_isNeedDraw=false;
  }
  else{
    this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,5,"rgb(255,255,255)","rgb(0,0,0)");
    let posHit = new CPoint();
    for (var key in this.m_arstBtn){
      let stBtn = this.m_arstBtn[key]
      if (this.m_iResult === stBtn.m_ID){
        let stRgb = new CColorBtn();
        stRgb.m_szBack= (g_Sys.m_Select === stBtn.m_ID) ? '#FF9900' :'#FF0099';
        stRgb.m_szDisable=stRgb.m_szBack;
        stRgb.m_szFont='#FFFFFF';
        stRgb.m_szFontDisable=stRgb.m_szFont;
        stBtn.DrawCustomRGB(stRgb);
      }else{
          stBtn.DrawDef();
      }

      if (g_Sys.m_Select == stBtn.m_ID && this.m_isSetHit && false==g_Sys.IsHitSucces()){
        this.DrawX(stBtn.m_x,stBtn.m_y,stBtn.m_cx,stBtn.m_cy,'#FF0000',5);
      }

    }

    if (this.m_isNeedTTS){
      if (0 === g_Sys.m_Select){
        responsiveVoice.speak('타임오버야!','Korean Female',{onend: this.OnEndTTSSelect});
      }
      else{
          responsiveVoice.speak(g_Sys.GetStrNumber(g_Sys.m_Select,'에')+'요!','Korean Male',{onend: this.OnEndTTSSelect});
      }
      this.m_isNeedTTS = false;
    }

    this.m_isNeedDraw=false;
  }
}

CBtnWnd.prototype.RestoreBtn = function(is_Enable,is_Redraw){
  is_Enable = typeof is_Enable !== 'undefined' ? is_Enable : true;
  is_Redraw = typeof is_Redraw !== 'undefined' ? is_Redraw : false;
  let i = 1;
  for (var key in this.m_arstBtn){
    this.m_arstBtn[key].RestoreRGB();
    this.m_arstBtn[key].SetEnable(is_Enable);
    if (g_Sys.IsLevel1()){
      this.m_arstBtn[key].SetShow(i <= g_Sys.m_first);
    }
    i ++;
  }

  if (is_Redraw)
    this.m_isNeedDraw = true;
}

CBtnWnd.prototype.SpeakCheck = function (i_Select){
  if (typeof i_Select !== 'undefined' && i_Select >= 0 && i_Select <= this.m_arstBtn.length){
    for (let i=1;i <= this.m_arstBtn.length;i ++){
      let iIndex= i - 1;
      this.m_arstBtn[iIndex].BackupRGB();
      var rgb=this.m_arstBtn[iIndex].GetRGB();
      if (i == i_Select){
          rgb.m_szBack = '#2E64FE';
          rgb.m_szFont = '#FFFFFF';
          this.m_arstBtn[iIndex].SetShow(true);

          let szLog = i + ',' + i_Select + ',' + iIndex;
      }else{
          this.m_arstBtn[iIndex].SetEnable(false);
          let szLog = 'Other' + i + ',' + i_Select;
          // console.log(this.m_arstBtn[i_Select -1].m_Rgb);
          // this.m_arstBtn[iIndex].SetRGB(rgb);
      }

      this.m_arstBtn[iIndex].SetRGB(rgb);

    }
    this.m_isNeedDraw = true;
    this.m_isNeedTTS = true;
     //responsiveVoice.speak(g_Sys.GetStrNumber(i_Select,'를')+' 선택','Korean Male');
     // responsiveVoice.speak(g_Sys.GetStrNumber(i_Select,'라')+'고?','Korean Female');

  }
}

CBtnWnd.prototype.StopInput = function(i_Index){
  this.SetEnable(false);
  g_sndClockTick.Stop();
  this.SpeakCheck(i_Index);
}

CBtnWnd.prototype.OnMouseDown = function(st_Event)
{
  if (g_Sys.IsModeTitle()){

  }else if (this.m_isDrawScore){
    if (true === this.m_btnReTry.OnL_Down(st_Event.offsetX,st_Event.offsetY)){
      g_Sys.ReTryQuiz();
      g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgNextQuiz))
      this.m_btnReTry.SetShow(false);
      this.m_isDrawScore = false;
      this.m_isNeedDraw = true;
      return 0;
    }
  }else if (g_Sys.IsModeQuiz()){
    if (this.IsEnable()){
      let index=1;
      for (var key in this.m_arstBtn){
        if (true === this.m_arstBtn[key].OnL_Down(st_Event.offsetX,st_Event.offsetY)){
          this.StopInput(index);
          return index;
        }
        index ++;
      }
    }
  }

  return 0;
}
