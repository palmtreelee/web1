function CItemQuiz(i_First,i_Second){
  this.m_iFirst = typeof i_First != 'undefined' ? i_First : 2;
  this.m_iSecond = typeof i_Second != 'undefined' ? i_Second : 1;
}
CItemQuiz.prototype.m_iFirst = 2;
CItemQuiz.prototype.m_iSecond = 1;
CItemQuiz.prototype.Read = function(st_Item){
  this.m_iFirst = st_Item.m_iFirst;
  this.m_iSecond = st_Item.m_iSecond;
}

function CSys(){

}


CSys.prototype.e_msgTitleEnd_wParam1IsBtnID = 1;
CSys.prototype.e_msgQuizVoiceStart = 2;
CSys.prototype.e_msgQuizVoiceEnd = 3;
CSys.prototype.e_msgSelectVoiceStart = 4;
CSys.prototype.e_msgSelectVoiceEnd = 5;
CSys.prototype.e_msgResulttVoiceStart = 6;
CSys.prototype.e_msgResultVoiceEnd = 7;
CSys.prototype.e_msgSetResult_wParamIsNewResult = 8;
CSys.prototype.e_msgSetHitStart = 9;
CSys.prototype.e_msgSetHitEnd = 10;
CSys.prototype.e_msgTimeOver = 11;
CSys.prototype.e_msgNextQuiz = 12;
CSys.prototype.e_msgVoiceRetryEnd = 13;
CSys.prototype.e_msgGameOver = 14;
CSys.prototype.e_msgStartDragGame = 15;
CSys.prototype.e_msgEndDragGame = 16;

CSys.prototype.e_modeNone = 0;
CSys.prototype.e_modeTitle = 1;
CSys.prototype.e_modeQuiz = 2;
CSys.prototype.e_modeCheckSelect = 3;
CSys.prototype.e_modeDragGame = 4;

CSys.prototype.e_Level1 = 1;
CSys.prototype.e_Level2 = 2;
CSys.prototype.e_Level3 = 3;

CSys.prototype.m_arstMsgQ = [];
CSys.prototype.m_first = 10;
CSys.prototype.m_Second = 6;
CSys.prototype.m_Select = 0;
CSys.prototype.m_arstQuiz = [];
CSys.prototype.m_arstQuizFail = [];
CSys.prototype.m_arstQuizSuccess = [];
CSys.prototype.m_arstQuizHistory = [];
CSys.prototype.m_isLoadImage = false;
CSys.prototype.m_eLevel = 300;
CSys.prototype.m_BtnIdLevel = 0;
CSys.prototype.m_eMode = 0;
CSys.prototype.IsModeNone = function(){return (this.e_modeNone===this.m_eMode);}
CSys.prototype.IsModeTitle = function(){return (this.e_modeTitle===this.m_eMode);}
CSys.prototype.IsModeQuiz = function(){return (this.e_modeQuiz===this.m_eMode);}
CSys.prototype.IsModeCheckSelect = function(){return (this.e_modeCheckSelect===this.m_eMode);}
CSys.prototype.IsModeDragGame = function(){return (this.e_modeDragGame===this.m_eMode);}
CSys.prototype.m_arszNumber = ['영','일','이','삼','사','오','육','칠','팔','구','십'];
CSys.prototype.m_arszJosaUl   = ['을','을','를','을','를','를','을','을','을','를','을'];
CSys.prototype.m_arszJosaUn   = ['은','은','는','은','는','는','은','은','은','는','은'];
CSys.prototype.m_arszJosaKa   = ['이','이','가','이','가','가','이','이','이','가','이'];
CSys.prototype.m_arszJosaYa   = ['이야','이야','야','이야','야','야','이야','이야','이야','야','이야'];
CSys.prototype.m_arszJosaRa   = ['이라','이라','라','이라','라','라','이라','이라','이라','라','이라'];
CSys.prototype.m_arszJosaRan  = ['이란','이란','란','이란','란','란','이란','이란','이란','란','이란'];
CSys.prototype.m_arszJosaE   = ['이에','이에','에','이에','에','에','이에','이에','이에','에','이에'];

CSys.prototype.GetCntQuizFail = function(){
  return this.m_arstQuizFail.length;
}

CSys.prototype.GetCntQuizSuccess = function(){
  return this.m_arstQuizSuccess.length;
}

CSys.prototype.GetCntTotalQuiz = function(){
  return this.m_arstQuizSuccess.length + this.m_arstQuizFail.length + this.m_arstQuiz.length;
}

CSys.prototype.IsCanReTry = function(){
  return (this.m_arstQuizFail.length >  0);
}

CSys.prototype.ReTryQuiz = function(){
  this.m_arstQuiz = [];
  this.m_arstQuiz = this.m_arstQuizFail.slice();
  this.m_arstQuizFail = [];
  this.m_arstQuizSuccess = [];
  this.m_arstQuizHistory = [];
}

CSys.prototype.IsTimeOver = function(){return (0 === this.m_Select);}
CSys.prototype.IsHitSucces = function(i_Select){
  i_Select = typeof i_Select !== 'undefined' ? i_Select : this.m_Select;
  return (i_Select == (this.m_first - this.m_Second));
}

CSys.prototype.GetRightResult = function(){
  return (this.m_first - this.m_Second);
}

CSys.prototype.IsLevel1 = function(){
  return (this.e_Level1 === this.m_eLevel);
}
CSys.prototype.IsLevel2 = function(){return (this.e_Level2 === this.m_eLevel);}
CSys.prototype.IsLevel3 = function(){return (this.e_Level3 === this.m_eLevel);}

CSys.prototype.IsCanDragGame = function(){
  if (this.m_arstQuiz.length <= 0){
    return (this.m_arstQuizHistory.length >= 1);
  }else{
    return ((this.IsLevel1() && this.m_arstQuizHistory.length >= 3) ||
        (this.IsLevel2() && this.m_arstQuizHistory.length >= 4) ||
        (this.IsLevel3() && this.m_arstQuizHistory.length >= 5)
      );
  }
}

CSys.prototype.GetTimeQuizLimit = function(){
  if (this.IsLevel1()){
    return 3000*10;
  }else if (this.IsLevel2()){
    return 2500*10;
  }else if (this.IsLevel3()){
    return 2000*10;
  }
  console.log(this.m_eLevel);
}

CSys.prototype.CreateQuizMinus = function(){
  this.m_arstQuiz = [];
  this.m_arstQuizFail = [];
  this.m_arstQuizSuccess = [];

  let i = 2;
  while (i < 4){
    let j = 1;
    while (j < i){
      if ((i - j) <= 10 && j <= 10){
        this.m_arstQuiz.push(new CItemQuiz(i,j));
      }
      j ++;
    }
    i ++
  }

  if (false==this.IsLevel1()){
    let stItem = new CItemQuiz();
    for (i = 0;i < (this.m_arstQuiz.length * 10) ;i ++){
      j = Math.floor(Math.random() * this.m_arstQuiz.length);
      if ( j >= this.m_arstQuiz.length)
        j = this.m_arstQuiz.length - 1;
      stItem.Read(this.m_arstQuiz[0]);
      this.m_arstQuiz[0].Read(this.m_arstQuiz[j]);
      this.m_arstQuiz[j].Read(stItem);
    }
  }

  this.m_first = this.m_arstQuiz[0].m_iFirst;
  this.m_Second = this.m_arstQuiz[0].m_iSecond;
  this.m_arstQuizHistory.push(this.m_arstQuiz.shift());
}

CSys.prototype.GetStrNumber = function(i_Num, sz_Josa){
  sz_Josa = typeof sz_Josa !== 'undefined' ? sz_Josa : '';

  let iLast=0;
  let szRet='';
  if (i_Num <= 10){
    iLast=i_Num;
    szRet = this.m_arszNumber[i_Num];
  }
  else if (i_Num < 20){
    iLast=i_Num % 10;
    szRet = this.m_arszNumber[10] + this.m_arszNumber[iLast];
  }
  else if (i_Num < 100){
    iLast = i_Num % 10;
    szRet = this.m_arszNumber[Math.floor(i_Num/10)] + this.m_arszNumber[10] + this.m_arszNumber[iLast];
  }

  if (sz_Josa === '을' || sz_Josa === '를'){
    szRet += this.m_arszJosaUl[iLast];
  }else if (sz_Josa === '은' || sz_Josa === '는'){
    szRet += this.m_arszJosaUn[iLast];
  }else if (sz_Josa === '이' || sz_Josa === '기'){
    szRet += this.m_arszJosaKa[iLast];
  }else if (sz_Josa === '이야' || sz_Josa === '야'){
    szRet += this.m_arszJosaYa[iLast];
  }else if (sz_Josa === '이란' || sz_Josa === '란'){
    szRet += this.m_arszJosaRan[iLast];
  }else if (sz_Josa === '이라' || sz_Josa === '라'){
    szRet += this.m_arszJosaRa[iLast];
  }else if (sz_Josa === '이에' || sz_Josa === '에'){
    szRet += this.m_arszJosaE[iLast];
  }

  return szRet;
}

CSys.prototype.GetStrQuiz = function(){
    return this.GetStrNumber(this.m_first) +
          '에서 '+ this.GetStrNumber(this.m_Second,'를') + ' 빼면 무엇일까?';
}
