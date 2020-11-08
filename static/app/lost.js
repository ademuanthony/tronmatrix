function init() {
	$('.loader-section').css('display', 'none');
	showPopup('#fadeLoading', 'Please Wait while the data is loading!');
	getUserDetails();
	getLostProfit();
}

function getLostProfit(ts, offset) {
	let timestamp = ts ? ts : 0;
	offset = offset ? offset : 0;
	tronWebGlobal.getEventResult(contractAddress, {
		onlyConfirmed: true,
		eventName: 'LostLevelProfitEvent',
		sinceTimestamp: timestamp,
		referral: sessionStorage.currentAccount,
		size: 200
	}).then((event) => {
		fillLostData(event, offset)
		if (event.length == 200) {
			ts = event[199].timestamp;
			getLostProfit(ts, offset + 200);
			return
		}
		$('#fadeLoading').popup('hide');
	}).catch((err) => {
		getLostProfit(ts, offset);
		console.log(`getLostProfit failed: ${err}`);
	});
}

let sn = 0
function fillLostData(event) {
	let levelProfit = [18, 75, 128, 325, 1000, 2750];
	for (var i = 0; i < event.length; i++) {
		if (tronWebGlobal.address.fromHex(event[i].result.referral) !== sessionStorage.currentAccount) {
			continue
		}

		address = event[i].result.user;
		level = event[i].result.level;
		amount = levelProfit[level - 1]
		if (screen.width < 767) {
			address = address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length);
		}
		sn++;
		$('<tr><td>' + sn + '</td><td>' + level + '</td><td>' + amount + '</td><td>' + address + '</td></tr>').appendTo('.table-content');
	}
}
