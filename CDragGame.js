function CItemQuizDragGame(){
  this.m_rcLink = new CRect();
  this.m_posOffClickBtn = new CPoint();
}
CItemQuizDragGame.prototype = new CItemQuiz();
CItemQuizDragGame.prototype.m_iResult = 0;
CItemQuizDragGame.prototype.m_rc = new CRect();
CItemQuizDragGame.prototype.m_rcLink = new CRect();
CItemQuizDragGame.prototype.m_posOffClickBtn = new CPoint();
CItemQuizDragGame.prototype.m_iIndexLink = -1;
CItemQuizDragGame.prototype.m_isHaveFail = false;
CItemQuizDragGame.prototype.ReadItem = function(st_Item){
  this.Read(st_Item);
}
CItemQuizDragGame.prototype.GetResult = function(){
  this.m_iResult = this.m_iFirst - this.m_iSecond;
  return this.m_iResult;
}

CItemQuizDragGame.prototype.Swap = function(st_Item){
  let stTemp = new CItemQuizDragGame();
  stTemp.ReadItem(st_Item);
  st_Item.ReadItem(this);
  this.ReadItem(stTemp);
}

function CDrageGameWnd(){
  this.m_posMouse = new CPoint();
}

CDrageGameWnd.prototype = new CPage();
CDrageGameWnd.prototype.m_isStartDrag = false;
CDrageGameWnd.prototype.m_arstQuiz = [];
CDrageGameWnd.prototype.m_arstResult = [];
CDrageGameWnd.prototype.m_arstFail = [];
CDrageGameWnd.prototype.m_arbtnQuiz = [];
CDrageGameWnd.prototype.m_arbtnResult = [];
CDrageGameWnd.prototype.m_btnClick = null;
CDrageGameWnd.prototype.m_posMouse = null;
CDrageGameWnd.prototype.m_iIndexLink = null;
CDrageGameWnd.prototype.m_iCntOk = 0;

function CAniDrageGameJudgment(){

}
CAniDrageGameJudgment.prototype = new CMoveImg();
CAniDrageGameJudgment.prototype.m_isSndFly = false;
CAniDrageGameJudgment.prototype.m_isSndBomb = false;
CAniDrageGameJudgment.prototype.m_isOk = false;

CAniDrageGameJudgment.prototype.e_Fly = 1;
CAniDrageGameJudgment.prototype.e_Hide = 2;
CAniDrageGameJudgment.prototype.e_CompleteAni = 3;
CAniDrageGameJudgment.prototype.e_Ani = 4;
CAniDrageGameJudgment.prototype.e_Show = 5;
CAniDrageGameJudgment.prototype.e_Complet = 6;
CAniDrageGameJudgment.prototype.e_Reset = 7;

CAniDrageGameJudgment.prototype.m_eMode = 0;

CDrageGameWnd.prototype.m_cxUnit = 0;
CDrageGameWnd.prototype.m_arstJudgment = [];
CDrageGameWnd.prototype.m_isAniLock = false;
CDrageGameWnd.prototype.AniJudgment = function (is_Start,is_Ok)
{
  is_Start = typeof is_Start !== 'undefined' ? is_Start : false;
  is_Ok = typeof is_Ok !== 'undefined' ? is_Ok : false;

  if (is_Start)
  {
    this.m_tSet = new Date().getTime();
    let tCur = this.m_tSet;
    this.m_arstJudgment = [];

    let tWait = 0;
    let tFly = 200;
    let tShow = 200;
    let tHide = 500;

    let sizFrmae = g_sprRedX.GetSizFromFrame(1);
    let rcStart = this.m_btnClick.GetCRect().GetCRectFromCSize(sizFrmae);
    let rcEnd = this.m_arbtnResult[this.m_iIndexLink].GetCRect();
    let posS = rcStart.GetPosCenter();

    this.m_arstJudgment.push(new CAniDrageGameJudgment());
    let stAni=this.m_arstJudgment[this.m_arstJudgment.length - 1];
    stAni.SetPos(rcStart.x,rcStart.y,rcEnd.x,rcEnd.y,tCur,tFly,tWait,1);
    stAni.SetSprite(is_Ok ? g_sprJudgment : g_sprRedX,1,false);
    stAni.SetAlpha(0.5,1);
    stAni.SetZoom(3,1);
    stAni.m_isSndFly = true;
    stAni.m_eMode = stAni.e_Fly;
    stAni.m_isOk = is_Ok;
    tWait += tFly;
    console.log(stAni);

    this.m_arstJudgment.push(new CAniDrageGameJudgment());
    stAni=this.m_arstJudgment[this.m_arstJudgment.length - 1];
    stAni.SetPos(rcEnd.x,rcEnd.y,rcEnd.x,rcEnd.y,tCur,tShow,tWait,1);
    stAni.SetSprite(is_Ok ? g_sprJudgment : g_sprRedX,1,false);
    stAni.isOneDraw = true;
    stAni.m_isOk = is_Ok;
    stAni.m_isSndBomb = true;
    tWait += tShow;

    this.m_arstJudgment.push(new CAniDrageGameJudgment());
    stAni=this.m_arstJudgment[this.m_arstJudgment.length - 1];
    stAni.SetPos(rcEnd.x,rcEnd.y,rcEnd.x,rcEnd.y,tCur,tHide,tWait,1);
    stAni.SetSprite(is_Ok ? g_sprJudgment : g_sprRedX,1,false);
    stAni.SetAlpha(1,0);
    stAni.m_eMode = stAni.e_Hide;
    stAni.m_isOk = is_Ok;
    tWait += tFly;
    console.log(stAni);

    this.m_isAniLock = true;
    this.m_isNeedDraw = true;
  }
  else
  {
    if (this.m_arstJudgment.length <= 0)
      return;

    let iCntAni=0;
    let iIndexDel=-1;

    for (let key in this.m_arstJudgment)
    {
      let stAni = this.m_arstJudgment[key];
      if (false === stAni.isDelete)
      {
        iCntAni ++;
        if (stAni.DrawRetIsEndDraw(this,this.m_tCur))
        {
          if (stAni.e_Hide ===  stAni.m_eMode)
          {
            this.SetEnable(true);
            if (stAni.m_isOk)
            {
              this.m_iCntOk ++;
              console.log('cnt: ' +  this.m_iCntOk + ',Length: ' +  this.m_arstQuiz.length);
              if (this.m_iCntOk >= this.m_arstQuiz.length)
              {
                g_sndClockTick.Stop();
                if (this.m_arstFail.length <= 0){
                    g_sndDragGameComplete.Play();
                }else{
                    responsiveVoice.speak('틀린적 있잖아! 다시해!','Korean Female');
                }

                let sprEnd = (this.m_arstFail.length <= 0) ? g_sprJudgment : g_sprReset;

                let tAni = 500;
                this.m_arstJudgment.push(new CAniDrageGameJudgment());
                let stNewAni=this.m_arstJudgment[this.m_arstJudgment.length - 1];
                let siz = g_sprJudgment.GetSizFromFrame(1);
                let rcPage = new CRect(0,0,this.m_cx,this.m_cy);
                let rcPut = rcPage.GetCRectFromCSize(siz);
                stNewAni.SetPos(rcPut.x,rcPut.y,rcPut.x,rcPut.y,this.m_tCur,tAni,0,1);
                stNewAni.SetSprite(sprEnd,1,false);
                stNewAni.SetAlpha(0,1);
                stNewAni.SetZoom(1,5);
                stNewAni.m_eMode = stNewAni.e_CompleteAni;
                iCntAni ++;

                console.log(stNewAni);

                this.m_arstJudgment.push(new CAniDrageGameJudgment());
                stNewAni=this.m_arstJudgment[this.m_arstJudgment.length - 1];
                stNewAni.SetPos(rcPut.x,rcPut.y,rcPut.x,rcPut.y,this.m_tCur,500,tAni,1);
                stNewAni.SetSprite(sprEnd,1,false);
                stNewAni.SetZoom(5,5);
                stNewAni.m_eMode = (this.m_arstFail.length <= 0) ? stNewAni.e_Complete : stNewAni.e_Reset;
                stNewAni.isOneDraw = true;
                iCntAni ++;

                console.log(stNewAni);

                this.SetEnable(false);
              }//if (this.m_iCntOk >= this.m_arstQuiz.length)
            }//if (stAni.m_isOk)
          }//if (stAni.e_Hide ===  stAni.m_eMode)
          else if (stAni.e_Complete === stAni.m_eMode)
          {
            this.SetEnable(false);
            g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgEndDragGame));
          }
          else if (stAni.e_Reset === stAni.m_eMode)
          {
            this.SetEnable(true);
            this.SetQuiz(this.m_arstFail);
            g_Sys.m_arstMsgQ.push(new CMsg(g_Sys.e_msgResetTimerForDragGame));
          }

          this.m_isNeedDraw = true;
          stAni.isDelete = true;
          iIndexDel = key;
          iCntAni --;

        }else{
            if (stAni.isDrawStart)
            {
              if (stAni.e_Fly ===  stAni.m_eMode){
                this.SetEnable(false);
                this.m_isNeedDraw = true;
              }
              else if (stAni.e_Hide ===  stAni.m_eMode){
                this.m_isNeedDraw = true;
              }
              else if (stAni.e_CompleteAni ===  stAni.m_eMode){
                this.m_isNeedDraw = true;
              }

              if (stAni.m_isSndFly){
                stAni.m_isSndFly=false;
                g_sndDie.Play();
              }

              if (stAni.m_isSndBomb){
                stAni.m_isSndBomb=false;
                let sndBomb = (true === stAni.m_isOk) ? g_sndDDDD : g_sndTimeStop;
                sndBomb.Play(0.4);
              }
            }
        }
      }else{
        iIndexDel = key;
      }
    }

    if (iIndexDel >= 0)
      this.m_arstJudgment.splice(iIndexDel,1);


    if (iCntAni <= 0){
        this.m_isAniLock = false;
        this.m_isNeedDraw = true;
        this.m_tSet = 0;
        this.m_arstJudgment = [];
    }
  }
}

CDrageGameWnd.prototype.Draw = function(){
  this.m_isNeedDraw = false;

  // this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,1,this.IsTouch() ? '#00FFFF' : "#FBF8DF","rgb(0,0,0)");
  this.DrawOutLineBox(0,0,this.m_cx,this.m_cy,1,"#FBF8DF","rgb(0,0,0)");
  this.m_arbtnQuiz.forEach(function(stBtn){
    stBtn.DrawDef();
  },this);
  this.m_arbtnResult.forEach(function(stBtn){
    stBtn.DrawDef();
  },this);

  this.m_arstResult.forEach(function(st_Result){
    this.DrawCircleFromCRect(st_Result.m_rcLink,'#000000');
  },this);

  this.m_arstQuiz.forEach(function(st_Quiz){
    if (st_Quiz.m_iIndexLink >= 0){
        let szRgb = 'RGB(200,200,200)';
        this.DrawCircleFromCRect(st_Quiz.m_rcLink.GetCRectFromZoom(1.5),szRgb);
        let posQuiz = st_Quiz.m_rcLink.GetPosCenter();
        let stResult = this.m_arstResult[st_Quiz.m_iIndexLink];
        this.DrawCircleFromCRect(stResult.m_rcLink.GetCRectFromZoom(1.5),szRgb);
        let posResult = stResult.m_rcLink.GetPosCenter();
        this.Line(posQuiz.x,posQuiz.y,posResult.x,posResult.y,st_Quiz.m_rcLink.cx,szRgb);
    }else{
        this.DrawCircleFromCRect(st_Quiz.m_rcLink,'#000000');
    }
  },this);



  if (this.m_isStartDrag && this.m_btnClick)
  {
    let stQuiz=this.m_btnClick.m_stTemp;
    // console.log(stQuiz.m_rcLink);
    let rcTemp = new CRect();
    rcTemp.ReadZoom(stQuiz.m_rcLink,1.5);
    // console.log(rcTemp);
    let szRgbDrag='RGB(3,157,192)';
    this.DrawCircleFromCRect(rcTemp,szRgbDrag);

    let rcDraw=this.m_btnClick.GetCRect();
    // console.log(this.m_btnClick);
    rcDraw.x = this.m_posMouse.x - this.m_btnClick.m_posClickOff.x;
    rcDraw.y = this.m_posMouse.y - this.m_btnClick.m_posClickOff.y;

    let rgbNew=this.m_btnClick.m_Rgb.Clone();
    rgbNew.m_szBack = 'RGBA(3,157,192,0.3)';
    rgbNew.m_szFont = '#FFFFFF';

    let posE = new CPoint(this.m_posMouse.x,this.m_posMouse.y);
    this.m_iIndexLink = -1;
    let i=0;
    for (i = 0;i < this.m_arbtnResult.length;i ++){
      let rcBtn = this.m_arbtnResult[i].GetCRect();
      if (this.m_arbtnResult[i].IsEnable() && rcDraw.IsBounding(rcBtn)){
        this.m_iIndexLink = i;
        this.m_arbtnResult[i].DrawCustomRGB(rgbNew);
        posE.SetXY(this.m_arstResult[i].m_rcLink.x,this.m_arstResult[i].m_rcLink.y);
        break;
      }
    }

    let posS = rcTemp.GetPosCenter();
    this.Line(posS.x,posS.y,posE.x,posE.y,rcTemp.cx - 2,szRgbDrag);

    this.m_btnClick.DrawCustomRGB(rgbNew,rcDraw);
  }
  this.AniJudgment();
}


CDrageGameWnd.prototype.OnTimerEx = function(t_Cur){
  this.m_tCur = typeof t_Cur !== 'undefined' ? t_Cur : new Date().getTime();
  if (this.IsCanDraw()){
    this.Draw();
  }else if (this.IsShow()){
    this.AniJudgment();
  }
}

CDrageGameWnd.prototype.SetQuiz = function(arst_Quiz)
{
  if (arst_Quiz.length <= 0)
  {

  }
  else
  {
      g_sndClockTick.Play(0.2,true);
      this.SetEnable(true);
      this.m_iCntOk = 0;
      this.m_arstQuiz = [];
      this.m_arstResult = [];
      arst_Quiz.forEach(function(st_Quiz)
      {
        this.m_arstQuiz.push(new CItemQuizDragGame());
        let stQuiz = this.m_arstQuiz[this.m_arstQuiz.length -1];
        stQuiz.Read(st_Quiz);
        // stQuiz.m_rcLink = new CRect();
        // stQuiz.m_posOffClickBtn = new CPoint();

        this.m_arstResult.push(new CItemQuizDragGame());
        stQuiz = this.m_arstResult[this.m_arstResult.length -1];
        stQuiz.Read(st_Quiz);
        // stQuiz.m_rcLink = new CRect();
        // stQuiz.m_posOffClickBtn = new CPoint();
        stQuiz.GetResult();
      },this);

      this.RandomSwapArray(this.m_arstQuiz,200);
      this.RandomSwapArray(this.m_arstResult,200);


      this.m_arbtnQuiz = [];
      this.m_arbtnResult = [];
      let cxUnit = this.m_cxUnit;
      let cxMain = Math.floor(cxUnit * 6);
      let cyGrid = Math.floor(this.m_cy / this.m_arstQuiz.length);
      let sizBtn = new CSize(cxUnit*2-20,Math.floor(cxUnit * 0.65));
      let sizResult = new CSize(cxUnit-4,cxUnit-4);
      let sizGapBtn = new CSize((cxUnit * 2 - sizBtn.cx) / 2 ,
                            Math.floor( (cyGrid - sizBtn.cy) / 2));
      let posResult = new CPoint(cxUnit * 5 +2,(cyGrid - cxUnit)/2);
      let sizLink = new CSize(6,6);
      let posLink = new CPoint(cxUnit*2-sizLink.cx,sizLink.GetCenterY(cyGrid));


      let x= sizGapBtn.cx;
      let y= sizGapBtn.cy;
      let i;
      for (i = 0;i < this.m_arstQuiz.length;i ++)
      {
        // console.log(posLink);

        this.m_arbtnQuiz.push(new CBtn());
        let stBtn= this.m_arbtnQuiz[this.m_arbtnQuiz.length - 1];
        let stQuiz = this.m_arstQuiz[i];
        stQuiz.m_rcLink.Set(posLink.x,posLink.y,sizLink.cx,sizLink.cy);
        // console.log(stQuiz.m_rcLink);
        stBtn.InitCBtn(stQuiz.m_iFirst + ' - ' + stQuiz.m_iSecond,x,y,sizBtn.cx,sizBtn.cy,this,true,true,i+1);
        stBtn.m_sndClick = g_sndBtnClick;
        stBtn.m_stTemp = stQuiz;

        this.m_arbtnResult.push(new CBtn());
        stBtn= this.m_arbtnResult[this.m_arbtnResult.length - 1];
        stQuiz = this.m_arstResult[i];
        stQuiz.m_rcLink.Set((cxMain - cxUnit - sizLink.cx),posLink.y,sizLink.cx,sizLink.cy);
        stBtn.InitCBtn(stQuiz.m_iResult,posResult.x,posResult.y,sizResult.cx,sizResult.cy,this,true,true,i+1);
        stBtn.m_stTemp = stQuiz;

        y += cyGrid;
        posResult.y += cyGrid;
        posLink.y += cyGrid;
      }
      this.m_arstFail = [];
      // console.log(this.m_arstQuiz);
      // console.log(this.m_arstResult);
  }
  this.m_isNeedDraw = true;
}

CDrageGameWnd.prototype.OnMouseDown = function(st_Event)
{
  if (this.IsCanCtrl() && false===this.m_isStartDrag)
  {
    // console.log('CDrageGameWnd.prototype.OnMouseDown');
    // this.DrawFillBox(0,0,100,100,'#FF0000');
    let posM = this.GetPosFromEvent(st_Event);

    let i;
    for (i = 0;i < this.m_arbtnQuiz.length;i ++)
    {
      if (true===this.m_arbtnQuiz[i].OnL_Down(posM.x,posM.y))
      {
        this.m_btnClick=this.m_arbtnQuiz[i];
        this.m_posMouse.SetXY(posM.x,posM.y);
        this.m_isNeedDraw=true;
        this.m_isStartDrag = true;
        break;
      }
    }
  }

  return 0;
}

CDrageGameWnd.prototype.OnMouseOut = function(st_Event){
  if (true === this.m_isStartDrag){
      this.m_isNeedDraw = true;
      this.m_isStartDrag = false;
  }
}

CDrageGameWnd.prototype.OnMouseUp = function(st_Event){
  if (true === this.m_isStartDrag){
      this.m_isNeedDraw = true;
      this.m_isStartDrag = false;

      if (this.m_iIndexLink >= 0)
      {
        let stResult = this.m_arstResult[this.m_iIndexLink];
        let stQuiz = this.m_btnClick.m_stTemp;
        let isOk = stQuiz.GetResult() == stResult.m_iResult;
        if (isOk)
        {
          stQuiz.m_iIndexLink = this.m_iIndexLink;
          this.m_btnClick.SetEnable(false);
          this.m_arbtnResult[this.m_iIndexLink].SetEnable(false);
        }
        else
        {
          if (false == stQuiz.m_isHaveFail){
            stQuiz.m_isHaveFail=true;
            this.m_arstFail.push(new CItemQuiz(stQuiz.m_iFirst,stQuiz.m_iSecond));
          }
        }
        this.AniJudgment(true,isOk);
      }
  }
}

CDrageGameWnd.prototype.OnMouseMove = function(st_Event){
  if (true === this.m_isStartDrag){
      // if (this.IsTouch())
      //   st_Event.preventDefault();
      let posM = this.GetPosFromEvent(st_Event);
      this.m_posMouse.SetXY(posM.x,posM.y);
      this.m_isNeedDraw = true;
  }
}

CDrageGameWnd.prototype.Init = function(sz_CanvasID,sz_Div){
  this.InitCPage(sz_CanvasID,sz_Div);
  // if (this.IsTouch()) {
  //    this.m_hwnd.addEventListener('touchstart', this.OnMouseDown.bind(this), false);
  //    this.m_hwnd.addEventListener('touchmove', this.OnMouseMove.bind(this), false);
  //    this.m_hwnd.addEventListener('touchend', this.OnMouseUp.bind(this), false);
  // } else {
  //   this.m_hwnd.addEventListener('mousemove',this.OnMouseMove.bind(this),false);
  //   this.m_hwnd.addEventListener('mouseup',this.OnMouseUp.bind(this),false);
  //   this.m_hwnd.addEventListener('mouseout',this.OnMouseOut.bind(this),false);
  //   this.m_hwnd.addEventListener('mousedown',this.OnMouseDown.bind(this),false);
  // }

  if (this.IsTouch()) {
    $(this.m_hwnd).on('touchstart','',this.OnMouseDown.bind(this));
    $(this.m_hwnd).on('touchmove','',this.OnMouseMove.bind(this));
    $(this.m_hwnd).on('touchend','',this.OnMouseUp.bind(this));
  } else {
    $(this.m_hwnd).on('mousedown','',this.OnMouseDown.bind(this));
    $(this.m_hwnd).on('mousemove','',this.OnMouseMove.bind(this));
    $(this.m_hwnd).on('mouseup','',this.OnMouseUp.bind(this));
    $(this.m_hwnd).on('mouseout','',this.OnMouseOut.bind(this));
  }

  this.m_cxUnit = Math.floor(this.m_cx / 6);
  g_sprRedX.AddFrame(this.m_cxUnit,this.m_cxUnit);
  g_sprJudgment.AddFrame(this.m_cxUnit,this.m_cxUnit);
  g_sprReset.AddFrame(this.m_cxUnit,this.m_cxUnit);
}
