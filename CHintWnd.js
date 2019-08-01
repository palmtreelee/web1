function CHintWnd() {

}

CHintWnd.prototype = new CPage();
CHintWnd.prototype.m_First = 2;
CHintWnd.prototype.m_Second = 1;
CHintWnd.prototype.m_CntFirst = 2;
CHintWnd.prototype.m_CntSecond = 1;
CHintWnd.prototype.m_Select = 0;
CHintWnd.prototype.m_arstAniCheckSelect = [];
CHintWnd.prototype.m_isSetHit = false;
CHintWnd.prototype.m_posHit = new CPoint();
CHintWnd.prototype.m_iBtnID = 0;
CHintWnd.prototype.m_fAlphaFirstHide = 0;

CHintWnd.prototype.OnTimerEx = function(t_Cur)
{
  this.m_tCur = typeof t_Cur !== 'undefined' ? t_Cur : new Date().getTime();
  if (this.IsCanDraw()){
    this.Draw();
  }
}

CHintWnd.prototype.SetSys = function(st_Sys)
{
  this.m_First = st_Sys.m_first;
  this.m_CntFirst = st_Sys.m_first;
  this.m_Second = st_Sys.m_Second;
  this.m_CntSecond = st_Sys.m_Second;
  this.m_Select = st_Sys.m_Select;
  this.m_isNeedGetPos = true;
  this.m_isSetHit = false;
  // console.log(this.m_tSet);
}
CHintWnd.prototype.e_kindHideSecond = 1;
CHintWnd.prototype.e_kindHideFirst = 2;
CHintWnd.prototype.e_kindWait = 3;
CHintWnd.prototype.e_kindFlyBomb = 4;
CHintWnd.prototype.e_kindFirstHide = 5;

function CAniCheckSelect(){

}
CAniCheckSelect.prototype = new CMoveImg();
CAniCheckSelect.prototype.m_isSndMove = false;
CAniCheckSelect.prototype.m_eMode = 0;
CAniCheckSelect.prototype.m_iIndexDel = -1;
CAniCheckSelect.prototype.m_isSndFire = false;
CAniCheckSelect.prototype.m_isSndDie = false;
CAniCheckSelect.prototype.m_isSndSuccess = false;

CHintWnd.prototype.m_fAlphaPosHide = 0.6;
CHintWnd.prototype.m_isNeedGetPos = true;
CHintWnd.prototype.m_isAniStart = false;
CHintWnd.prototype.m_isAniLock = false;
CHintWnd.prototype.m_eAni = 0;
CHintWnd.prototype.AniCheckSelect = function (is_Start){
  is_Start = typeof is_Start !== 'undefined' ? is_Start : false;
  if (is_Start)
  {
    let tWait = 500;
    let tFly = 200;
    let arFlyWait= [100,550,500,450,400,350,300,250,200]
    let tFlyWait = (g_Sys.m_Second <= 8) ? arFlyWait[g_Sys.m_Second]: 170;
    let tHide = 400;
    let tBomb = 110;
    this.m_tSet = new Date().getTime();
    let tCur = this.m_tSet;
    this.m_arstAniCheckSelect = [];

    this.m_arstAniCheckSelect.push(new CAniCheckSelect());
    let stAni=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
    stAni.SetPos(0,0,0,0,tCur,tWait,0,1);
    if (this.m_arstPosBomb.length > 0){
      stAni.SetAlpha(this.m_arstPosBomb[0].fAlpha,0);
    }
    stAni.m_eMode = this.e_kindWait;

    let iIndexS = this.m_arstPosFirst.length - 1;
    let iIndexE = this.m_arstPosBomb.length - 1;
    let tWaitHideFirst = tWait + tFly;
    while (iIndexE >= 0){
      let stPosS=this.m_arstPosFirst[iIndexS];
      this.m_arstAniCheckSelect.push(new CAniCheckSelect());
      let stFirst=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
      stFirst.SetPos(stPosS.x,stPosS.y,this.m_posCntFirst.x,this.m_posCntFirst.y,tCur,tHide,tWaitHideFirst,1.6);
      stFirst.SetSprite(stPosS.stSpr,stPosS.iFrame,false);
      stFirst.SetZoom(1,0.01);
      stFirst.m_eMode = this.e_kindHideFirst;
      stFirst.m_iIndexDel = iIndexS;
      stFirst.m_isSndDie = true;
      tWaitHideFirst += tFly+tFlyWait;

      iIndexS --;
      iIndexE --;
    }

    iIndexS = this.m_arstPosBomb.length - 1;
    iIndexE = this.m_arstPosFirst.length - 1;
    let tWaitBombFly = tWait;
    while (iIndexS >= 0){
      let stPosS=this.m_arstPosBomb[iIndexS];
      let stPosE=this.m_arstPosFirst[iIndexE];
      this.m_arstAniCheckSelect.push(new CAniCheckSelect());
      let stBomb=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
      stBomb.SetPos(stPosS.x,stPosS.y,stPosE.x,stPosE.y,tCur,tFly,tWaitBombFly,1.6);
      stBomb.SetSprite(stPosS.stSpr,stPosS.iFrame,false);
      stBomb.m_eMode = this.e_kindHideSecond;
      stBomb.m_iIndexDel = iIndexS;
      stBomb.m_isSndFire = true;
      tWaitBombFly += tFly+tFlyWait;

      iIndexS --;
      iIndexE --;
    }

    iIndexS = this.m_arstPosBomb.length - 1;
    iIndexE = this.m_arstPosFirst.length - 1;
    tWaitBombFly = tWait+tFly;
    while (iIndexS >= 0){
      let stPosS=this.m_arstPosBomb[iIndexS];
      let stPosE=this.m_arstPosFirst[iIndexE];
      this.m_arstAniCheckSelect.push(new CAniCheckSelect());
      let stBomb=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
      stBomb.SetPos(stPosE.x,stPosE.y,stPosE.x,stPosE.y,tCur,tBomb,tWaitBombFly,1.6);
      stBomb.SetSprite(stPosS.stSpr,stPosS.iFrame,false);
      stBomb.SetAlpha(0.5,0);
      stBomb.SetZoom(1,3);
      if (0 === iIndexS){
        this.m_arstAniCheckSelect.push(new CAniCheckSelect());
        stBomb=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
        let tAppend = 120;
        let tWaitAppend = tWaitBombFly + (tHide > tAppend ? tHide - tAppend : 0);
        stBomb.SetPos(this.m_posHit.x,this.m_cy-1,this.m_posHit.x,this.m_posHit.y,tCur,250,tWaitAppend,-1.6);
        if (g_Sys.IsTimeOver()){
            stBomb.SetSprite(g_sprTimeOver,1,false);
        }else{
            stBomb.SetSprite(g_Sys.IsHitSucces() ? g_sprQuizOk : g_sprQuizNo,1,false);
        }
        stBomb.SetAlpha(0.5,1);
        stBomb.m_isSndSuccess = true;

        this.m_arstAniCheckSelect.push(new CAniCheckSelect());
        stBomb=this.m_arstAniCheckSelect[this.m_arstAniCheckSelect.length - 1];
        stBomb.SetPos(0,0,0,0,tCur,250,tWaitAppend,-1.6);
        stBomb.SetAlpha(0,1);
        stBomb.m_eMode = this.e_kindFirstHide;

        // stBomb.SetZoom(1,3);
      }
      tWaitBombFly += tFly+tFlyWait;

      iIndexS --;
      iIndexE --;
    }

    // this.m_arstAniCheckSelect.forEach(function(element) {
    //     console.log(element);
    // })


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
          if (this.e_kindWait ==  stAni.m_eMode){
            this.m_eAni = this.e_kindFlyBomb;
            this.m_arstPosHide = [];
            this.m_fAlphaPosHide = 0;
            g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSetResult_wParamIsNewResult,this.m_CntFirst));
          }else if (this.e_kindHideSecond ==  stAni.m_eMode){

          }
          stAni.isDelete = true;
          iIndexDel = key;
          iCntAni --;
        }else{
            if (stAni.isDrawStart){
              if (this.e_kindWait==stAni.m_eMode){
                this.m_eAni = this.e_kindWait;
                this.m_fAlphaPosHide = stAni.fAlphaCur;
              }else if(this.e_kindHideSecond==stAni.m_eMode){
                if (stAni.m_iIndexDel >= 0){
                  this.m_arstPosBomb.splice(stAni.m_iIndexDel,1);
                  stAni.m_iIndexDel = -1;
                  this.m_CntSecond --;
                }
              }else if(this.e_kindHideFirst==stAni.m_eMode){
                if (stAni.m_iIndexDel >= 0){
                  this.m_arstPosFirst.splice(stAni.m_iIndexDel,1);
                  stAni.m_iIndexDel = -1;
                  this.m_CntFirst --;
                  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSetResult_wParamIsNewResult,this.m_CntFirst));
                  // console.log(g_Sys.m_arstMsgQ[g_Sys.m_arstMsgQ.length - 1]);
                }
              }else if(this.e_kindFirstHide==stAni.m_eMode){
                this.m_fAlphaFirstHide = stAni.fAlphaCur;
              }

              if (stAni.m_isSndDie){
                stAni.m_isSndDie=false;
                g_sndDie.Play();
              }

              if (stAni.m_isSndFire){
                stAni.m_isSndFire=false;
                g_sndFire.Play();
              }

              if (stAni.m_isSndSuccess){
                stAni.m_isSndSuccess=false;
                let snd;
                if (g_Sys.IsTimeOver()){
                  snd = g_sndTimeOverFail;
                }else{
                  snd = g_Sys.IsHitSucces() ? g_sndSucces : g_sndFail;
                }
                snd.Play(0.4);
                // console.log(snd);
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
        this.m_isNeedGetPos = true;
        this.m_isSetHit = true;
        this.m_isNeedTTS = true;
        g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSetHitStart));
        // console.log('Ani End');
    }

    // console.log(this.m_arstAniCheckSelect.length);
  }
}

CHintWnd.prototype.m_posCntFirst = new CPoint();
CHintWnd.prototype.m_arstBtn;
CHintWnd.prototype.Init = function(sz_CanvasID,sz_Div){
  this.InitCPage(sz_CanvasID,sz_Div);

  this.m_arstBtn = new Array();

  let arszBtnName = ['초급 뺄셈 시작','중급 뺄셈 시작','고급 뺄셈 시작'];
  let arszBtnTTS = ['초급','중급','고급'];
  let arBtnID = [g_Sys.e_Level1,g_Sys.e_Level2,g_Sys.e_Level3];
  let arRgbR =[0,8,223];
  let arRgbG =[64,138,1];
  let arRgbB =[255,41,1];
  let arszRGB = ['#0040FF','#088A29','#DF0101'];
  let gap = 4;
  let cx = Math.floor(this.m_cx * 0.7);
  let cy = Math.floor(this.m_cy / arszBtnName.length);
  let x = Math.floor((this.m_cx-cx) / 2);
  let y = gap;

  let stRGB=new CColorBtn();
  stRGB.m_szFont = '#FFFFFF';
  for (let i = 0;i < arszBtnName.length;i ++){
    this.m_arstBtn.push(new CBtn());
    let stBtn = this.m_arstBtn[i];
    stBtn.InitCBtn(arszBtnName[i],x,y,cx,cy - gap*2  ,this,true,true,arBtnID[i]);

    stBtn.m_szFont = Math.floor(stBtn.m_cy * 0.5) + 'px arial';
    // stBtn.InitCBtn(arszBtnName[i],x,y,cx,cx,this,true,true,arBtnID[i]);

    // stRGB.m_szBack = arszRGB[i];
    stRGB.m_szBack = stBtn.GetGradient(arRgbR[i],arRgbG[i],arRgbB[i]);
    stBtn.SetRGB(stRGB);
    stBtn.BackupRGB();
    stBtn.m_szTemp = arszBtnTTS[i];
    stBtn.m_sndClick = g_sndBtnClick;
    y += cy;
  }

  gap=1;
  let cxMin = Math.floor(this.m_cx / 10);
  let cxSrc = g_sprRobot.m_cxSrc;
  let cySrc = g_sprRobot.m_cySrc;

  let size=cxMin*5 - (gap * 2);
  for (let i = 1;i <= 5;i ++){
    size=Math.floor(cxMin*5/i) - (gap * 2);
    // console.log(size);
    g_sprRobot.m_arstFrame.push(new CFrame(0,0,cxSrc,cySrc,size,size));
    g_sprBomb.m_arstFrame.push(new CFrame(0,0,g_sprBomb.m_cxSrc,g_sprBomb.m_cySrc,size,size));
  }

  size=cxMin*5 - (5 * 2);
  g_sprQuizOk.m_arstFrame.push(new CFrame(0,0,g_sprQuizOk.m_cxSrc,g_sprQuizOk.m_cySrc,size,size));
  g_sprQuizNo.m_arstFrame.push(new CFrame(0,0,g_sprQuizNo.m_cxSrc,g_sprQuizNo.m_cySrc,size,size));
  g_sprTimeOver.m_arstFrame.push(new CFrame(0,0,g_sprTimeOver.m_cxSrc,g_sprTimeOver.m_cySrc,size,size));
  this.m_posHit.SetXY(size+15,5);
}

CHintWnd.prototype.AutoShowBtn = function(){
  if (g_Sys.IsModeTitle()){
    this.m_arstBtn.forEach(function(stBtn){
      stBtn.SetShow(true);
      stBtn.SetEnable(true);
      stBtn.RestoreRGB();
    });
    this.m_isNeedDraw = true;
  }else{
    for (let key in this.m_arstBtn){
      this.m_arstBtn[key].SetShow(false);
    }
    this.m_isNeedDraw = true;
  }
}

CHintWnd.prototype.OnEndTTSLevel = function(){
  // g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgTitleEnd_wParam1IsBtnID,g_Sys.m_BtnIdLevel));
  g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgTitleEnd_wParam1IsBtnID,g_Sys.m_BtnIdLevel));
}

CHintWnd.prototype.OnMouseDown = function(st_Event)
{
  let iRetID = 0;
  for (let key in this.m_arstBtn)
  {
    let stBtn=this.m_arstBtn[key];
    if(true === stBtn.OnL_Down(st_Event.offsetX,st_Event.offsetY))
    {
      iRetID = stBtn.m_ID;
      this.m_iBtnID = iRetID;
      g_Sys.m_BtnIdLevel = iRetID;
      // console.log(g_Sys.m_BtnIdLevel,iRetID);
      break;
    }
  }

  if (iRetID > 0)
  {
    this.m_arstBtn.forEach(function(stBtn,index,array){
      stBtn.SetEnable(false);
      if (iRetID === stBtn.m_ID){
        stBtn.m_Rgb.SetDisableFromNormal();
        responsiveVoice.speak(stBtn.m_szTemp,'Korean Female',{onend : this.OnEndTTSLevel});
      }
    },this);
    this.m_isNeedDraw=true;
  }
  return iRetID;
}

function CPosHintWnd(){

}
CPosHintWnd.prototype.x = 0;
CPosHintWnd.prototype.y = 0;
CPosHintWnd.prototype.iFrame = 0;
CPosHintWnd.prototype.stSpr = null;
CPosHintWnd.prototype.fAlpha = 1;
CPosHintWnd.prototype.Init = function(x,y,iFrame,stSpr,fAlpha){
  this.x = x;
  this.y = y;
  this.iFrame = iFrame;
  this.stSpr = stSpr;
  this.fAlpha = fAlpha;
}


CHintWnd.prototype.OnEndTTSHit = function(){
    g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgSetHitEnd));
}

CHintWnd.prototype.m_arstPosFirst = [];
CHintWnd.prototype.m_arstPosHide = [];
CHintWnd.prototype.m_arstPosBomb = [];
CHintWnd.prototype.m_arstPosFirstHide = [];
CHintWnd.prototype.Draw = function(){
  if (g_Sys.IsModeTitle()){
    this.DrawFillBox(0,0,this.m_cx,this.m_cy,'RGB(255,255,255)');
    for (let key in this.m_arstBtn){
        this.m_arstBtn[key].DrawDef();
    }
    this.m_isNeedDraw = false;
  }else{
    this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,5,"rgb(255,255,255)","rgb(0,0,0)");
    let cyTotal = (this.m_cy / 6) * 5;
    this.LineH(this.m_cx / 2,0,cyTotal,'RGB(0,0,0)',1);
    this.LineV(0,cyTotal,this.m_cx,'RGB(0,0,0)',1);
    let arIndexFrame=[0,1,2,2,2,3,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5];

    this.SetCenterV(true);
    let cyBlock=this.m_cx / 10;
    let OffX = Math.floor(this.m_cx / 10) * 5;
    let OffY = cyTotal + (cyBlock / 2) + 2;
    this.DrawText(OffX / 2, OffY, 'X', Math.floor(cyBlock * 0.8),'center', '#5F4C0B' );
    this.DrawText(OffX / 2 + OffX, OffY, 'X', Math.floor(cyBlock * 0.8),'center', '#5F4C0B' );

    this.m_posCntFirst.SetXY(OffX * 0.75, OffY);
    this.DrawText(this.m_posCntFirst.x, this.m_posCntFirst.y, this.m_CntFirst, Math.floor(cyBlock * 0.8),'center', '#08088A' );
    this.DrawText(this.m_posCntFirst.x + OffX, this.m_posCntFirst.y, this.m_CntSecond, Math.floor(cyBlock * 0.8),'center', '#8A0808' );

    let stFrameIcon=g_sprRobot.m_arstFrame[5];
    let IconX = (OffX / 2 - stFrameIcon.cxDest) / 2;
    let IconY = (cyBlock - stFrameIcon.cyDest) / 2 + cyTotal - 1;

    // console.log('x: ' + IconX + ',y: ' + IconY);
    this.DrawSprite(IconX,IconY,g_sprRobot,5);
    this.DrawSprite(IconX+OffX,IconY,g_sprBomb,5);

    if (this.m_isAniLock || this.m_isSetHit){
        this.m_arstPosFirst.forEach(function(stPos){
          this.DrawSprite(stPos.x,stPos.y,stPos.stSpr,stPos.iFrame,stPos.fAlpha);
        },this);

        if (this.m_fAlphaFirstHide > 0){
          this.m_arstPosFirstHide.forEach(function(stPos){
            this.DrawSprite(stPos.x,stPos.y,stPos.stSpr,stPos.iFrame,this.m_fAlphaFirstHide);
            let stSpr = stPos.stSpr;
            let siz = new CSize(stSpr.GetCxFrame(stPos.iFrame), stSpr.GetCyFrame(stPos.iFrame));
            let szRgb = 'RGBA(255,0,0,' + this.m_fAlphaFirstHide + ')';
            this.DrawX(stPos.x,stPos.y,siz.cx,siz.cy,'#ff0000',6);
          },this);
        }

        this.m_arstPosHide.forEach(function(stPos){
          this.DrawSprite(stPos.x,stPos.y,stPos.stSpr,stPos.iFrame,this.m_fAlphaPosHide);
        },this);

        this.m_arstPosBomb.forEach(function(stPos){
          if (this.m_eAni == this.e_kindWait)
            this.DrawSprite(stPos.x,stPos.y,g_sprRobot,stPos.iFrame,this.m_fAlphaPosHide / 2);
          this.DrawSprite(stPos.x,stPos.y,stPos.stSpr,stPos.iFrame,1);
        },this);

        if (this.m_isSetHit)
        {

          this.m_isNeedDraw=false;
          if (g_Sys.IsTimeOver()){
            this.DrawSprite(this.m_posHit.x,this.m_posHit.y,g_sprTimeOver,1,1);
          }else{
              this.DrawSprite(this.m_posHit.x,this.m_posHit.y,g_Sys.IsHitSucces() ? g_sprQuizOk : g_sprQuizNo,1,1);
          }


          if (this.m_isNeedTTS){
            this.m_isNeedTTS=false;
            let szTTS;
            if (g_Sys.IsHitSucces()){
              szTTS = '정답! 대단해! 그래' + g_Sys.GetStrNumber(g_Sys.m_first) + '빼기 ' + g_Sys.GetStrNumber(g_Sys.m_Second,'은');
              szTTS = szTTS +  ' ' + g_Sys.GetStrNumber(g_Sys.m_Select,'이') + ' 맞아!';
            }else if (g_Sys.IsTimeOver()){
              szTTS = g_Sys.GetStrNumber(g_Sys.m_first) + '빼기 ' + g_Sys.GetStrNumber(g_Sys.m_Second,'은');
              szTTS = szTTS + ' ' +  g_Sys.GetStrNumber(g_Sys.GetRightResult(),'야') + ' ' + '담엔 빨리 푸는거야? 알았지!!';
            }else{
              szTTS = '틀렸잖아! 속상해! ' + g_Sys.GetStrNumber(g_Sys.m_first) + '빼기 ' + g_Sys.GetStrNumber(g_Sys.m_Second,'은');
              szTTS = szTTS + ' ' +  g_Sys.GetStrNumber(g_Sys.GetRightResult(),'란') + ' 말야! ' + '담엔 좀 잘하는거야!! 알았지!!';
            }

            responsiveVoice.speak(szTTS,'Korean Female',{onend:this.OnEndTTSHit});
          }
        }
    }
    else {
      console.log(3);
      if (this.m_First >= 1 && this.m_First <= 25){
        let CntGrid = arIndexFrame[this.m_First];
        let stFrame = g_sprRobot.m_arstFrame[CntGrid];
        if (this.m_isNeedGetPos){
          this.m_arstPosBomb = [];
          this.m_arstPosFirst = [];
          this.m_arstPosFirstHide = [];
          this.m_arstPosHide = [];
          this.m_fAlphaPosHide = g_Sys.IsLevel1() ? 0.6 : 0.15;
          this.m_fAlphaFirstHide = 0;
        }

        let cx = stFrame.cxDest + 2;
        let x = 1;
        let y = (this.m_First <= 2) ? Math.floor ((cyTotal - cx) / 2) : 1;
        let j  = 1;
        for (let i = 1;i <= this.m_First;i ++){
          this.DrawSprite(x,y,g_sprRobot,CntGrid);
          let isDrawBomb =(i + this.m_Second) > this.m_First;

          if (this.m_isNeedGetPos){
            this.m_arstPosFirst.push(new CPosHintWnd());
            this.m_arstPosFirst[this.m_arstPosFirst.length - 1].Init(x,y,CntGrid,g_sprRobot,1);
            if (isDrawBomb){
              this.m_arstPosFirstHide.push(new CPosHintWnd());
              this.m_arstPosFirstHide[this.m_arstPosFirstHide.length - 1].Init(x,y,CntGrid,g_sprRobot,1);
            }
          }

          if (g_Sys.IsLevel3()){
            isDrawBomb = (i <= this.m_Second);
          }


          if (isDrawBomb){
            this.DrawSprite(x+OffX,y,g_sprRobot,CntGrid,this.m_fAlphaPosHide / 2);
            this.DrawSprite(x+OffX,y,g_sprBomb,CntGrid);
            if (this.m_isNeedGetPos){
              this.m_arstPosBomb.push(new CPosHintWnd());
              this.m_arstPosBomb[this.m_arstPosBomb.length - 1].Init(x+OffX,y,CntGrid,g_sprBomb,this.m_fAlphaPosHide / 2);
            }
          }else if (false===g_Sys.IsLevel3()){
            this.DrawSprite(x+OffX,y,g_sprRobot,CntGrid,this.m_fAlphaPosHide);
            if (this.m_isNeedGetPos){
              this.m_arstPosHide.push(new CPosHintWnd());
              this.m_arstPosHide[this.m_arstPosHide.length - 1].Init(x+OffX,y,CntGrid,g_sprRobot,this.m_fAlphaPosHide);
            }
          }

          if (j >= CntGrid){
              x = 1;
              y += cx;
              j = 0;
          }else{
              x += cx;
          }
          j ++;
        }

        this.m_isNeedGetPos=false;
      }
      this.m_isNeedDraw = false;
    }
    this.AniCheckSelect(false);
  }
}
