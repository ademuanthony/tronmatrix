let referralArr = [];
let total = 0;
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
	$('#idLevel').html(loader);
	$('#idNum').html(loader);

	$('#level1 .earnings').html(loader)
	$('#level2 .earnings').html(loader)
	$('#level3 .earnings').html(loader)
	$('#level4 .earnings').html(loader)
	$('#level5 .earnings').html(loader)
	$('#level6 .earnings').html(loader)
})
	
function init() {
	let url = "https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd";
	fetch(url).then(response => response.json()).then(data => {
		let price = data.tron.usd;
		getUserProfitsAmount(price);
		getTotalEthProfit(price);
	}).catch((err) => {
		console.log("fetch data URL failed");
		console.log(err);
	});
	getUserDetails();
	getTotalUsers();
	getUserReferrals(sessionStorage.currentAccount, 10);
	getUserDirectReferrals()
	createBuyEvents();
}

function getUserProfitsAmount(price) {
	contractGlobal.getUserProfits(sessionStorage.currentAccount).call().then((result) => {
		let profits = result[2];
		let levels = result[3];
		let levelProfits = [0, 0, 0, 0, 0, 0]
		let sum = 0;
		for (let i = 0; i < profits.length; i++) {
			sum += parseInt(profits[i]);
			levelProfits[levels[i] - 1] += parseInt(profits[i])
		}
		sum /= multiplier;
		$('#earnedEth').text(sum);
		for (let i = 0; i < levelProfits.length; i++) {
			$(`#level${i + 1} .earnings`).html(levelProfits[i] / multiplier)
		}
		let usd = price * sum;
		$('#earnedUSD').text(usd.toFixed(2));
	}).catch((err) => {
		console.error('Call for User Direct Referrals Failed');
		console.log(err);
	});
}

function getUserDirectReferrals() {
	contractGlobal.getUserDirectReferralCounts(sessionStorage.currentAccount).call().then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (parseInt(result[i]._hex) == 0) continue
			$(`#level${i + 1} .direct-referrals`).html(`${parseInt(result[i]._hex)} direct referrals`)
		}
	}).catch((err) => {
		console.error('Call for User Direct Referral Failed');
		console.log(err);
	});
}

function getTotalEthProfit(price, ts) {
	let timestamp = ts ? ts : 0;
	tronWebGlobal.getEventResult(contractAddress, {
		onlyConfirmed: true,
		eventName: 'GetLevelProfitEvent',
		sinceTimestamp: timestamp,
		size: 200
	}).then((event) => {
		for (let i = 0; i < event.length; i++) {
			let level = event[i].result.level;
			switch (level) {
				case "1":
					total += 18;
					break;
				case "2":
					total += 75;
					break;
				case "3":
					total += 128;
					break;
				case "4":
					total += 325;
					break;
				case "5":
					total += 1000;
					break;
				case "6":
					total += 2750
					break;
				default:
			}
		}
		let usd = (total * price).toFixed(2);
		$("#totalEth").text(total.toFixed(2));
		$("#totalUSD").text(usd);
		if (event.length == 200) {
			ts = event[199].timestamp;
			getTotalEthProfit(price, ts);
		}
	}).catch((err) => {
		getTotalEthProfit(price, ts);
		console.log(`getTotalEthProfit failed: ${err}`);
	});
}

async function getUserReferrals(addr, depth) {
	let directRecruit = await contractGlobal.getUserRecruit(addr).call();
	$('#directRecruit').text(directRecruit)

	let queue = [];
	queue.push({
		address: addr,
		level: 0
	});

	while (queue.length !== 0) {
		let address = queue.pop();
		let result = await contractGlobal.getUserReferrals(address.address, 1).call();

		for (let i = 0; i < result.length; i++) {
			if (address.level <= depth) {
				queue.push({
					address: result[i],
					level: address.level + 1
				});
				if (referralArr.indexOf(tronWebGlobal.address.fromHex(result[i])) === -1) {
					referralArr.push(tronWebGlobal.address.fromHex(result[i]));
				}
			}
		}
	}
	displayNewPartners(0);
}

function displayNewPartners(ts) {
	tronWebGlobal.getEventResult(contractAddress, {
		onlyConfirmed: true,
		eventName: 'RegisterUserEvent',
		sinceTimestamp: ts,
		size: 200
	}).then((event) => {
		let yesterday = (new Date().getTime() / 1000) - 86400;

		for (let i = 0; i < event.length; i++) {
			let obj = event[i];
			if (referralArr.indexOf(tronWebGlobal.address.fromHex(obj.result.user)) !== -1 && obj.result.time > yesterday) {
				referral24Hours += 1;
			}
			if (obj.result.time > yesterday) {
				totalUsers24Hours += 1;
			}
		}
		$('#partnersUser').text(referralArr.length + "/" + referral24Hours);
		$('#totalDay').text(totalUsers24Hours);
		if (event.length === 200) {
			let ts = event[199].timestamp;
			displayNewPartners(ts);
		}
	});
}

function getTotalUsers() {
	contractGlobal.last_uid().call().then((result) => {
		$('#totalUsers').text(result);
	}).catch((err) => {
		console.log("last_uid failed");
		console.log(err);
	});
}

function addEventsForLevelBuy(level) {
	let price = [100, 500, 1000, 3000, 10000, 30000];
	let value = price[level - 1] * multiplier;

	showPopup('#fadeLoading', 'Please Wait while the transaction completes for Level ' + level + ' contract!');

	contractGlobal.buyLevel(level).send({
		feeLimit: 20000000,
		callValue: value
	}).then(async function (receipt) {
		$('#fadeLoading').popup('hide');
		showPopup('#fadeLoading', 'Submitted! Waiting for network confirmation, please wait...');
		checkTransactionStatus(receipt, 0).then(async (res) => {
			$('#fadeLoading').popup('hide');
			if (typeof res.ret === 'undefined' || typeof res.ret[0].contractRet === 'undefined') {
				showPopup('#fade', 'Transaction failed');
			} else {
				if (res.ret[0].contractRet === 'REVERT') {
					showPopup('#fade', 'Transaction failed: Transaction was reversed');
				} else if (res.ret[0].contractRet === 'SUCCESS') {
					showPopup('#fade', 'Congratulation! You have purchased a new Level ' + level +
						' contract! Note that you must have ' + level * 3 + ' direct referral to earn at this level');
					getUserDetails();
				} else {
					showPopup('#fade', 'Transaction failed: Make sure you have enough balance to cover upgrade and network fee then try again');
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
	});
}
