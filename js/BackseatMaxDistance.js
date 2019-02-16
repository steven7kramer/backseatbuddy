console.log(adminSession);

var maxDistPOI = function(pIcon){

  if(adminSession == 1){
    switch(pIcon) {
      case '1': return 1; break; // viewpoint
      case '2': return 10; break; // game
      case '4': return 7; break; // quiz
      default: return 5; // park + infopoint
    };
  }else{
    return 10000;
  }
}
