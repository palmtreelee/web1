function CSound(){

}

CSound.prototype.m_stSnd = null;
CSound.prototype.Load = function(sz_File){
  this.m_stSnd = new Audio(sz_File);
}

CSound.prototype.Play = function(f_Vol,is_loop){
  this.m_stSnd.volume = typeof f_vol !== 'undefined' ? f_vol : 1;
  this.m_stSnd.loop = typeof is_loop !== 'undefined' ? is_loop : false;
  this.m_stSnd.currentTime = 0;
  this.m_stSnd.play();
}

CSound.prototype.Stop = function(){
  this.m_stSnd.pause();
}
