function CBtnWnd() {

}

CBtnWnd.prototype = new CPage();
CBtnWnd.prototype.m_arstBtn = [];
CBtnWnd.prototype.m_First = 2;
CBtnWnd.prototype.m_Second = 1;
CBtnWnd.prototype.m_Select = 0;
CBtnWnd.prototype.m_tSet = 0;
CBtnWnd.prototype.m_tCur = 0;
CBtnWnd.prototype.m_isWantInput = false;
CBtnWnd.prototype.m_isNeedDraw = false;
CBtnWnd.prototype.m_iResult = 0;
CBtnWnd.prototype.m_isSetHit = false;

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
  if (this.m_isNeedDraw){
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



CBtnWnd.prototype.Init = function(sz_CanvasID){
  this.InitCPage(sz_CanvasID);
  let e_CntLine = 5;
  let e_Gap = 4;

  let cx=Math.floor(this.m_cx / e_CntLine);

  let x = e_Gap;
  let y = e_Gap;
  let j = 1;
  for (i = 1;i < 20;i ++ , j ++){
    this.m_arstBtn.push(new CBtn());
    this.m_arstBtn[i-1].InitCBtn(String(i),x,y,cx-e_Gap * 2,cx - e_Gap * 2,this,true,true,i);
    this.m_arstBtn[i-1].m_sndClick = g_sndBtnClick;

    if (j >= e_CntLine){
      j = 0;
      x = e_Gap;
      y += cx;
    }
    else{
      x += cx;
    }
  }
}

CBtnWnd.prototype.OnEndTTSCheckSelect = function(){
  // console.log('OnEndTTSCheckSelect');
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSelectVoiceEnd));
}

CBtnWnd.prototype.OnEndTTSSelect = function(){
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSelectVoiceStart));
}

CBtnWnd.prototype.Draw = function(){
  if (g_Sys.IsModeTitle()){
    this.DrawFillBox(0,0,this.m_cx,this.m_cy,'RGB(255,255,255)');

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
  for (var key in this.m_arstBtn){
    this.m_arstBtn[key].RestoreRGB();
    this.m_arstBtn[key].SetEnable(is_Enable);
  }

  if (is_Redraw)
    this.m_isNeedDraw = true;
}

CBtnWnd.prototype.SpeakCheck = function (i_Select){
  if (typeof i_Select !== 'undefined' && i_Select >= 0 && i_Select <= this.m_arstBtn.length){
    for (let i=1;i <= this.m_arstBtn.length;i ++){
      let iIndex= i - 1;
      this.m_arstBtn[iIndex].BackupRGB()
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
  this.m_isWantInput=false;
  g_sndClockTick.Stop();
  this.SpeakCheck(i_Index);
}

CBtnWnd.prototype.OnMouseDown = function(st_Event)
{
  if (g_Sys.IsModeTitle()){

  }else if (g_Sys.IsModeQuiz()){
    if (this.m_isWantInput){
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
