let referralArr = [];
let total = 0;
let userTotal = 0;
let levelTotal = [0, 0, 0, 0, 0, 0];
let referral24Hours = 0
let totalUsers24Hours = 0;

$(document).ready(function () {
	const loader = '<img style="height: 19px" class="loading_image" src="/static/assets/images/loader.svg"  alt="loading"/>'
	$('#totalUsers').html(loader);
	$('#totalEth').html(loader);
	$('#totalUSD').html(loader);
	$('#partnersUser').html(loader);
	$('#totalDay').html(loader);
	$('#earnedEth').html(loader);
	$('#earnedUSD').html(loader);
	$('#directReferrals').html(loader);
	$('#idLevel').html(loader);
	$('#idNum').html(loader);

	$('#level1 .earnings').html(loader)
	$('#level2 .earnings').html(loader)
	$('#level3 .earnings').html(loader)
	$('#level4 .earnings').html(loader)
	$('#level5 .earnings').html(loader)
	$('#level6 .earnings').html(loader)
})
	
async function init() {
	let url = "https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd";
	fetch(url).then(response => response.json()).then(data => {
		let price = data.tron.usd;
		trxPrice = price
		getGlobalInfo(price);
	}).catch((err) => {
		console.log("fetch data URL failed");
		console.log(err);
	});
	await getUserDetails();
	getReferralAndEarnings(sessionStorage.currentAccount);
	createBuyEvents();
}

async function getReferralAndEarnings(addr) {
	let directRecruit = await contractGlobal.users(addr).call();
	$('#directReferrals').text(parseInt(directRecruit.referredUsers._hex))
	totalEarnings += (parseInt(directRecruit.referredUsers._hex) * levelPrice(1))
	$('#earnedEth').text((totalEarnings/multiplier).toFixed(2))
	$('#earnedUSD').text((trxPrice * totalEarnings/multiplier).toFixed(2))
}

function getGlobalInfo(price) {
	contractGlobal.currUserID().call().then((result) => {
		$('#totalUsers').text(result);
	}).catch((err) => {
		console.log("currUserID failed");
		console.log(err);
	});
	
	contractGlobal.totalPayout().call().then((result) => {
		let total = parseInt(result._hex)/multiplier
		let usd = (total * price);
		$('#totalEth').text(total.toFixed(2));
		$('#totalUSD').text(usd.toFixed(2));
	}).catch((err) => {
		console.log("currUserID failed");
		console.log(err);
	});
}

function addEventsForLevelBuy(level) {
	let value =  levelPrice(level);

	showPopup('#fadeLoading', 'Please Wait while the transaction completes for Package ' + level + ' contract!');

	contractGlobal.buyPackage(level).send({
		feeLimit: 100000000,
		callValue: value
	}).then(async function (receipt) {
		$('#fadeLoading').popup('hide');
		showPopup('#fade', 'Request Submitted!')
		getUserDetails();
		// showPopup('#fadeLoading', 'Submitted! Waiting for network confirmation, please wait...');
		checkTransactionStatus(receipt, 0).then(async (res) => {
			$('#fadeLoading').popup('hide');
			if (typeof res.ret === 'undefined' || typeof res.ret[0].contractRet === 'undefined') {
				showPopup('#fade', 'Transaction failed');
			} else {
				if (res.ret[0].contractRet === 'REVERT') {
					showPopup('#fade', 'Transaction failed: Transaction was reversed. Have you bought the previous packages?');
				} else if (res.ret[0].contractRet === 'SUCCESS') {
					showPopup('#fade', 'Congratulation! You have purchased a new Package ' + level + ' contract!');
					getUserDetails();
				} else {
					showPopup('#fade', 'Transaction failed: Please try again');
				}
			}
		}).catch((err) => {
			$('#fadeLoading').popup('hide');
			console.log("checkTransactionStatus ERR: " + err);
			showPopup('#fade', 'Transaction failed: ' + err);
		});
	}).catch(err => {
		console.error(err);
		$('#fadeLoading').popup('hide');
		showPopup('#fade', 'Oops! There was some error! Please try Again!');
	});
}

function createBuyEvents() {
	$('#level1').children().find('button').click(() => {
		addEventsForLevelBuy(1);
	})
	$('#level2').children().find('button').click(() => {
		addEventsForLevelBuy(2);
	})
	$('#level3').children().find('button').click(() => {
		addEventsForLevelBuy(3);
	})
	$('#level4').children().find('button').click(() => {
		addEventsForLevelBuy(4);
	})
	$('#level5').children().find('button').click(() => {
		addEventsForLevelBuy(5);
	})
	$('#level6').children().find('button').click(() => {
		addEventsForLevelBuy(6);
	})
	$('#level7').children().find('button').click(() => {
		addEventsForLevelBuy(7);
	})
	$('#level8').children().find('button').click(() => {
		addEventsForLevelBuy(8);
	})
	$('#level9').children().find('button').click(() => {
		addEventsForLevelBuy(9);
	})
	$('#level10').children().find('button').click(() => {
		addEventsForLevelBuy(10);
	})
	$('#level11').children().find('button').click(() => {
		addEventsForLevelBuy(11);
	})
	$('#level12').children().find('button').click(() => {
		addEventsForLevelBuy(12);
	})
	$('#level13').children().find('button').click(() => {
		addEventsForLevelBuy(13);
	})
	$('#level14').children().find('button').click(() => {
		addEventsForLevelBuy(14);
	})
	$('#level15').children().find('button').click(() => {
		addEventsForLevelBuy(15);
	})
	$('#level16').children().find('button').click(() => {
		addEventsForLevelBuy(16);
	})
}
