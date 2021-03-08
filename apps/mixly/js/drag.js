//window.onload = function() {
function getid(id) {
  return document.getElementById(id);
}
window.addEventListener('load', function load(event) {
	
 var oBox = getid("table_whole"); 
 var oTop = getid("content_blocks"); 
 var oTop1 = getid("content_area");
 var oBottom = getid("side_code_parent");
 var oBottom1 = getid("output_img");
 var oLine = getid("mid_td");

 oLine.onmousedown = function(e) {
 	var disX = (e || event).clientX;
 	oLine.left = oLine.offsetLeft;

 	document.onmousemove = function(e) {
 		//console.log(oBox.clientWidth + " " + oLine.style.left + " " + disX + " " + (e || event).clientX);	
  		var iT = oLine.left + ((e || event).clientX - disX);
 		var e=e||window.event,tarnameb=e.target||e.srcElement;
  		var maxT = oBox.clientWidth;
		var minT = Blockly.mainWorkspace.toolbox_.width;
  		oLine.style.margin = 0;
  		iT < minT && (iT = minT);
  		iT > maxT && (iT = maxT);
		//console.log(oBox.clientWidth+" "+iT+" "+oTop1.style.width+" "+oTop.style.width);
		var percent=iT*100/oBox.clientWidth;
  		oTop1.style.width = percent + '%';
  		oTop.style.width = percent  + '%';  // no need this line
  		oLine.style.left = percent  + '%';
  		Blockly.fireUiEvent(window, 'resize');
  		oBottom.style.width = ( 100 - percent ) + '%';
        if(oBottom1 !== null) oBottom1.style.width = (oBox.clientWidth - iT) + "px";
  		return false;
 	}; 
 	document.onmouseup = function() {
  		document.onmousemove = null;
  		document.onmouseup = null; 
  		Blockly.fireUiEvent(window, 'resize');
  		oLine.releaseCapture && oLine.releaseCapture();
 	};
 	oLine.setCapture && oLine.setCapture();
 	return false;
 };
 
});

//mixpy sidecode drag function
window.addEventListener('load', function load(event) {
	
 var oBox = getid("side_code_parent"); 
 var oTop = getid("side_code_top");
 var oBottom = getid("side_code_bottom");
 var oLine = getid("side_code_mid");
 var oDown = null;
 if (document.getElementById("side_code_down")) {
  oDown = document.getElementById("side_code_down");
 }
 if(oLine === null) return;
 oLine.onmousedown = function(e) {
 	var disY = (e || event).clientY;
 	oLine.top= oLine.offsetTop;
 	document.onmousemove = function(e) { 
 		//console.log(oBox.clientWidth + " " + oLine.style.left + " " + disX + " " + (e || event).clientX);	
  		var iT = oLine.top + ((e || event).clientY - disY);
 		var e=e||window.event,tarnameb=e.target||e.srcElement;
  		var maxT = oBox.clientHeight * 0.85;
		var minT = oBox.clientHeight * 0.15;
  		oLine.style.margin = 0;
  		iT < minT && (iT = minT);
  		iT > maxT && (iT = maxT);
		//console.log(oBox.clientWidth+" "+iT+" "+oTop1.style.width+" "+oTop.style.width);
		var percent=iT*100/oBox.clientHeight;
      if (oDown) {
        oTop.style.height= percent + '%';  // no need this line
        oLine.style.top = percent + '%';
        oBottom.style.height= (100 - percent - oDown.clientHeight*100/oBox.clientHeight) + '%';
      } else {
        oTop.style.height= percent  + '%';  // no need this line
        oLine.style.top = percent  + '%';
  		  oBottom.style.height= ( 100 - percent) + '%';
      }
  		
  		return false;
 	}; 
 	document.onmouseup = function() {
  		document.onmousemove = null;
  		document.onmouseup = null; 
  		oLine.releaseCapture && oLine.releaseCapture();
 	};
 	oLine.setCapture && oLine.setCapture();
 	return false;
 };
 
});

window.addEventListener('load', function load(event) {
  
 var oBox = getid("table_whole"); 
 
 var content_xml = getid("content_xml");
 var content_blocks = getid("content_blocks"); 
 var content_arduino = getid("content_arduino"); 
 var content_area = getid("content_area");
 var side_code_parent = getid("side_code_parent");

 var td_top = getid("td_top");
 var td_middle = getid("td_middle");
 var td_down = getid("td_down");

 td_top.onmousedown = function(e) {
  var disY = (e || event).clientY;
  td_top.top= td_top.offsetTop;

  document.onmousemove = function(e) {
    var iT = td_top.top + ((e || event).clientY - disY);
    var e=e||window.event,tarnameb=e.target||e.srcElement;

    var maxT = oBox.clientHeight * 0.85;
    var minT = oBox.clientHeight * 0.15;
    td_top.style.margin = 0;
    iT < minT && (iT = minT);
    iT > maxT && (iT = maxT);
    var percent=iT;
    var oBox_height = oBox.clientHeight;
    content_xml.style.height = percent + "px";
    content_blocks.style.height = percent + "px";
    content_arduino.style.height = percent + "px";
    content_area.style.height = percent + "px";
    side_code_parent.style.height = percent + "px";
    mid_td.style.height= percent + "px";
    td_middle.style.height = "auto";
    Blockly.fireUiEvent(window, 'resize');
    return false;
  }; 
  document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null; 
      Blockly.fireUiEvent(window, 'resize');
      td_top.releaseCapture && td_top.releaseCapture();
  };
  td_top.setCapture && td_top.setCapture();
  return false;
 };
 
});
