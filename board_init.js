var Mixly_20_environment = 0;
try {
	Mixly_20_environment = (window && window.process && window.process.versions && window.process.versions['electron'])? 0: 1;
} catch (error) {
	Mixly_20_environment = 1;
}

function getid(id) {
	return document.getElementById(id);
}

if (getid("mixly-board")) {
	var board_container = getid("mixly-board");
	var board_num = 0;
	var a_row = '';
	board_container.innerHTML = '';
	for (var i = 0; i < mixly_board.length; i++) {
		if (mixly_board[i]['environment'] == 2 || Mixly_20_environment == mixly_board[i]['environment']) {
			a_row += `
			<div class="col-sm-4 col-md-3">
	            <div class="service-single">
	                <a href="${mixly_board[i]['BoardIndex']}">
	                    <img src="${mixly_board[i]['BoardImg']}" alt="service image" class="tiltimage">
	                    <h2>${mixly_board[i]['BoardName']}</h2>
	                </a>
	                <!--<p>${mixly_board[i]['BoardDescription']}</p>-->
	            </div>
	        </div>
			`;
			board_num++;
			if (board_num % 4 == 0) {
				if (board_num == 4)
					a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
				else
					a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
				board_container.innerHTML = board_container.innerHTML + a_row;
				a_row = '';
			}
		}
	}
	if (board_num % 4 != 0 && a_row != '') {
		while(board_num % 4 != 0) {
			a_row += `
			<div class="col-sm-4 col-md-3">
	            <div class="service-single">
	                <a href="javascript:;">
	                    <img src="./files/blank2.jpg" alt="service image" class="tiltimage">
	                </a>
	            </div>
	        </div>
			`;
			board_num++;
		}
		a_row = '<div style="background-color:rgba(0,0,0,0);padding-left: 70px;padding-right: 70px;"><div class="row maxs">' + a_row + '</div></div>';
		board_container.innerHTML = board_container.innerHTML + a_row;
		a_row = '';
	}
}

setTimeout(function () {
	if (getid("footer")) {
		var footer = getid("footer");
		footer.innerHTML = 
		`
		<div class="container" style="text-align:center;">
		    <hr>
		    <p>Copyright © Mixly Team@BNU, CHINA</p>
		</div>
		`;
	}
}, 400);