function CMoveImg() {

}

CMoveImg.prototype.sx = 0;
CMoveImg.prototype.sy = 0;
CMoveImg.prototype.ex = 0;
CMoveImg.prototype.ey = 0;
CMoveImg.prototype.CurX = 0;
CMoveImg.prototype.CurY = 0;
CMoveImg.prototype.GapX = 0;
CMoveImg.prototype.GapY = 0;
CMoveImg.prototype.isNotMove = false;
CMoveImg.prototype.isDrawStart = false;
CMoveImg.prototype.VectorX = 1;
CMoveImg.prototype.VectorY = 1;
CMoveImg.prototype.fAccel = 1;
CMoveImg.prototype.fGapX = 1;
CMoveImg.prototype.fGapY = 1;
CMoveImg.prototype.isAccelInvert = false;
CMoveImg.prototype.isNotAccel = true;
CMoveImg.prototype.isNotMove = 1;

CMoveImg.prototype.AddYStart = 0
CMoveImg.prototype.AddYEnd = 0

CMoveImg.prototype.tStart = 0;
CMoveImg.prototype.tDelay = 0;
CMoveImg.prototype.tLimit = 0;

CMoveImg.prototype.fAlphaS = 1;
CMoveImg.prototype.fAlphaE = 1;
CMoveImg.prototype.fAlphaCur = 1;
CMoveImg.prototype.fZoomS = 1;
CMoveImg.prototype.fZoomE = 1;
CMoveImg.prototype.fZoomCur = 1;

CMoveImg.prototype.stPage = null;
CMoveImg.prototype.stSpr = null;
CMoveImg.prototype.iFrame = 0;

CMoveImg.prototype.isDrawSceen = false;
CMoveImg.prototype.isDrawDelay = false;
CMoveImg.prototype.isDrawStart = false;
CMoveImg.prototype.isDrawOverEnd = true;
CMoveImg.prototype.isComplete = false;

CMoveImg.prototype.isDelete = false;

CMoveImg.prototype.SetPos = function(sx,sy,ex,ey,t_Cur,t_Limit,t_Delay,f_Accel){
  this.fAccel = typeof f_Accel !== 'undefined' ? f_Accel : 1;
  this.tDelay = typeof t_Delay !== 'undefined' ? t_Delay : 0;
  this.tLimit = typeof t_Limit !== 'undefined' ? t_Limit : 1;
  this.tStart = typeof t_Cur !== 'undefined' ? t_Cur : 0;

  if (0 == this.fAccel)
    this.fAccel=1;

  if (this.fAccel < 0){
    this.isAccelInvert = true;
    this.fAccel *= -1;
  }

  if (1 == this.fAccel){
    this.isNotAccel = true;
  }

  this.isNotMove = (sx === ex && sy === ey);
  this.GapX = (sx > ex) ? sx - ex : ex - sx;
  this.GapY = (sy > ey) ? sy - ey : ey - sy;

  this.fGapX = Math.pow(this.GapX,1 / this.fAccel);
  this.fGapY = Math.pow(this.GapY,1 / this.fAccel);

  this.VectorX = (sx > ex) ? -1 : 1;
  this.VectorY = (sy > ey) ? -1 : 1;

  this.sx = sx;
  this.sy = sy;
  this.CurX = sx;
  this.CurY = sy;
  this.ex = ex;
  this.ey = ey;
}

CMoveImg.prototype.SetAlpha = function(f_Start,f_End){
  this.fAlphaS = f_Start;
  this.fAlphaE = f_End;
}

CMoveImg.prototype.SetZoom = function(f_Start,f_End){
  this.fZoomS = f_Start;
  this.fZoomE = f_End;
}

CMoveImg.prototype.SetSprite = function(st_Sprite,i_IndexFrame,is_DrawScene){
  this.stSpr = typeof st_Sprite !== 'undefined' ? st_Sprite : null;
  this.iFrame = typeof i_IndexFrame !== 'undefined' ? i_IndexFrame : null;;
  this.isDrawSceen = typeof is_DrawScene !== 'undefined' ? is_DrawScene : false;
}

CMoveImg.prototype.DrawRetIsEndDraw = function(st_Page,t_Now){
  let isRet=false;
  this.isDrawStart = true;
  let tDraw = 0;
  if (t_Now < (this.tStart + this.tDelay)) //초기 대기시간보다 작으면...
	{
		this.isDrawStart = false;
    this.CurX = this.sx;
    this.CurY = this.sy;
		this.CurY += this.AddYStart;
		if (false === this.isDrawDelay)
			return isRet;
		this.fAlphaCur = this.fAlphaS;
    this.fZoomCur = this.fZoomS;
		tDraw = 0;
	}
	else if (t_Now >= (this.tStart + this.tDelay + this.tLimit)) //이동 시간을 초과하였으면...
	{
		isRet = true;
    this.CurX = this.ex;
    this.CurY = this.ey;
    this.CurY += this.AddYEnd;
		this.fAlphaCur = this.fAlphaE;
    this.fZoomCur = this.fZoomE;
		tDraw = this.tLimit - 1;

    // console.log('time: ' + tDraw + ',Alpha: ' +   this.fAlphaCur);
    if (false === this.isDrawOverEnd){
      return isRet;
    }
	}
	else if (false)
	{
    this.CurX = this.sx;
    this.CurY = this.sy;
		this.fAlphaCur = this.fAlphaS;
		return isRet;
	}
	else
	{
		let tGap = (t_Now > this.tStart) ?  (t_Now - this.tStart) : 0;
		tGap -= this.tDelay;
		tDraw = tGap;
		//Y운동량 추가 부분
		let iAddY = this.AddYStart;
		{
			let iGap = this.AddYEnd - this.AddYStart;
			if (iGap)
			{
				let iVector = 1;
				if (iGap < 0){
					iVector = -1;
					iGap = 0 - iGap;
				}

				iGap = tGap * iGap / this.tLimit;
				iAddY += (iVector * iGap);
			}
		}

    if (this.fAlphaS !== this.fAlphaE){
        this.fAlphaCur = this.fAlphaS + ((tGap * (this.fAlphaE - this.fAlphaS)) / this.tLimit);
    }

    if (this.fZoomS !== this.fZoomE){
      this.fZoomCur = this.fZoomS + ((tGap * (this.fZoomE - this.fZoomS)) / this.tLimit);
    }

		if (this.isNotMove)
		{
      this.CurX = this.sx;
      this.CurY = this.sy;
		}
		else if (this.isNotAccel)
		{
      this.CurX = this.sx;
      this.CurY = this.sy;
			this.CurX += (tGap*this.GapX / this.tLimit)*this.VectorX;
			this.CurY += (tGap*this.GapY / this.tLimit)*this.VectorY;
		}
		else if (false == this.isAccelInvert)
		{
			let fTemp = ((this.fGapX * tGap) / this.tLimit);
			fTemp = Math.pow(fTemp, this.fAccel) *  this.VectorX;
			this.CurX = this.sx + fTemp;

			fTemp = ((this.fGapY * tGap) / this.tLimit);
			fTemp = Math.pow(fTemp, this.fAccel) *  this.VectorY;
			this.CurY = this.sy + fTemp;
		}
		else
		{
			tGap = this.tLimit - tGap;

			let fTemp = ((this.fGapX * tGap) / this.tLimit);
			fTemp = Math.pow(fTemp, this.fAccel) *  this.VectorX;
			this.CurX = this.sx + (this.ex - (this.sx + fTemp));

			fTemp = ((this.fGapY * tGap) / this.tLimit);
			fTemp = Math.pow(fTemp, this.fAccel) *  this.VectorY;
			this.CurY = this.sy + (this.ey - (this.sy + fTemp));
		}

		this.CurY += iAddY;
	}

	if (null === st_Page || null==this.stSpr || this.fAlphaCur <= 0)
		return isRet;

  if (this.isDrawSceen){

  }else{
      st_Page.DrawSprite(this.CurX,this.CurY,this.stSpr,this.iFrame,this.fAlphaCur,this.fZoomCur);
  }

	return isRet;
}
