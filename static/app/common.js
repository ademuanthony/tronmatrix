const multiplier = 1000000;

const ownerAddress = 'TQNuR2FXb2rSb7ZZUxmZ1HQAZ3s1VMTCaL'
const contractAddress = 'TKLMAqTB3TH3t8tUUUYBYAo16BpN1sfrfB'
const networkApi = 'https://api.shasta.trongrid.io/'

// const contractAddress = 'TRUforvgWS4b9xnZBGipxZ97oNGRCZDTvH'
// const ownerAddress = 'TQjV8oCVxqAVZxRRoUu7TJ8eSSmrWjKFtS'
// const networkApi = 'https://api.trongrid.io/'

let tronWebGlobal;
let contractGlobal;
let isOwner = false;
let refer = '';
let isReferredLink = false;

let totalEarnings = 0
let trxPrice = 0.028

if (sessionStorage.isViewOnly === 'true') {
	$(async function () {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		if (urlParams.get('refId')) {
			refer = urlParams.get('refId');
			isReferredLink = true;
			$('#ref-addr').val(urlParams.get('refId'));
		}

		if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
			tronWebGlobal = window.tronWeb;
		} else {
			tronWebGlobal = new TronWeb({
				fullNode: networkApi,
				solidityNode: networkApi,
				eventServer: networkApi
			});
		}
		if (typeof sessionStorage.currentAccount === 'undefined' || sessionStorage.currentAccount === 'undefined') {
			sessionStorage.currentAccount = ownerAddress;
		}
		await tronWebGlobal.setAddress(sessionStorage.currentAccount);
		tronWebGlobal.contract().at(contractAddress).then((contract) => {
			contractGlobal = contract;
			_init(sessionStorage.currentAccount)
			if (typeof init === 'function') {
				init();
			}
		}).catch((err) => {
			console.error('Failed to get contract. Are you connected to main net?');
			console.log(err);
			showPopup('#fade', 'Failed to get contract. Are you connected to main net?');
		});
	});
} else {
	$(async function () {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		if (urlParams.get('refId')) {
			refer = urlParams.get('refId');
			isReferredLink = true;
			$('#ref-addr').val(urlParams.get('refId'));
		}

		let count = 0;
		let obj = setInterval(async () => {
			count += 1;
			if (count >= 600) {
				//showPopup('#fade', 'Tronlink wallet not found');
				if (window.location.href.indexOf('/start') === -1) {
					window.location.href = '/';
				}
			}
			if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
				clearInterval(obj);
				tronWebGlobal = window.tronWeb;
				tronWebGlobal.contract().at(contractAddress).then(async (contract) => {
					contractGlobal = contract;
					if (typeof init === 'function') {
						getAccount().then(async () => {
							_init(sessionStorage.currentAccount);
							let userDetails = await contractGlobal.users(sessionStorage.currentAccount).call();
							if (typeof userDetails !== 'undefined' && userDetails.isExist) {
								init();
							} else {
								if (window.location.href.indexOf('/start') === -1) {
									window.location.href = '/';
								}
							}
						}).catch((err) => {
							console.log('Get account failed');
							console.log(err);
						});
					}
				}).catch((err) => {
					console.error('Failed to get contract. Are you connected to main net?');
					console.log(err);
					showPopup('#fade', 'Failed to get contract. Are you connected to main net?');
				});
			}
		}, 10);
	});
}

async function getAccount() {
	return new Promise(async (resolve, reject) => {
		if (typeof tronWebGlobal === 'undefined' || typeof tronWebGlobal.trx === 'undefined') {
			showPopup('#fade', 'Tronlink wallet not found');
			reject('Tronlink wallet not found');
		} else {
			tronWebGlobal.trx.getAccount().then((currentAccount) => {
				let currentAccountBase58 = tronWebGlobal.address.fromHex(currentAccount.__payload__.address);
				$('#connectedAccount').html('Connected account: ' + currentAccountBase58);
				sessionStorage.currentAccount = currentAccountBase58;
				sessionStorage.currentAccountHex = currentAccount.address;
				resolve();
			}).catch((err) => {
				try {
					let currentAccountBase58 = tronWebGlobal.defaultAddress.base58;
					$('#connectedAccount').html('Connected account: ' + currentAccountBase58);
					sessionStorage.currentAccount = currentAccountBase58;
					sessionStorage.currentAccountHex = tronWebGlobal.address.toHex(currentAccountBase58);
					resolve();
				} catch (e) {
					showPopup('#fade', 'No accounts were found');
					reject(e);
				}
			});
		}
	});
}

async function loginButton() {
	login()
}

async function login(msg) {
	if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
		tronWebGlobal = window.tronWeb;
	} else {
		tronWebGlobal = new TronWeb({
			fullNode: networkApi,
			solidityNode: networkApi,
			eventServer: networkApi
		});
	}

	getAccount().then(() => {
		contractGlobal.users(sessionStorage.currentAccount).call().then((userDetails) => {
			console.log(userDetails)
			if (typeof userDetails !== 'undefined' && userDetails.isExist) {
				sessionStorage.isViewOnly = false;
				window.location.href = '/dashboard';
			} else {
				showPopup('#fade', msg || 'You are not registered');
			}
		}).catch((err) => {
			showPopup('#fade', msg || 'Login failed');
			console.log(err);
		});
	}).catch((err) => {
		console.log('Get account failed');
		console.log(err);
	});
}

async function previewMode() {
	if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
		tronWebGlobal = window.tronWeb;
	} else {
		tronWebGlobal = new TronWeb({
			fullNode: networkApi,
			solidityNode: networkApi,
			eventServer: networkApi
		});
	}

	await tronWebGlobal.setAddress('TQNuR2FXb2rSb7ZZUxmZ1HQAZ3s1VMTCaL');
	tronWebGlobal.contract().at(contractAddress).then(async (contract) => {
		contractGlobal = contract;
		sessionStorage.isViewOnly = true;

		let manualAddr = $('#manual-addr').val();
		if (manualAddr === '') {
			showPopup('#fade', 'Enter Address or user ID to enter preview mode');
		} else {
			if (manualAddr.length === 42 && manualAddr.indexOf('0x') !== -1) {
				sessionStorage.currentAccountHex = manualAddr;
				sessionStorage.currentAccount = tronWebGlobal.address.fromHex(manualAddr);
				await tronWebGlobal.setAddress(sessionStorage.currentAccount);
				window.location.href = '/dashboard';
			} else if (manualAddr.length === 34) {
				sessionStorage.currentAccount = manualAddr;
				sessionStorage.currentAccountHex = tronWebGlobal.address.toHex(manualAddr);
				await tronWebGlobal.setAddress(sessionStorage.currentAccount);
				window.location.href = '/dashboard';
			} else {
				contractGlobal.userList(manualAddr).call().then(async (result) => {
					if (result === '410000000000000000000000000000000000000000') {
						console.error('Invalid User ID');
						showPopup('#fade', 'Invalid User ID');
					} else {
						sessionStorage.currentAccountHex = result;
						sessionStorage.currentAccount = tronWebGlobal.address.fromHex(result);
						await tronWebGlobal.setAddress(sessionStorage.currentAccount);
						window.location.href = '/dashboard';
					}
				}).catch((err) => {
					console.error('Failed to get User ID');
					console.log(err);
					showPopup('#fade', 'Failed to get User ID');
				});
			}
		}
	}).catch((err) => {
		console.error('Failed to get contract. Are you connected to main net?');
		console.log(err);
		showPopup('#fade', 'Failed to get contract. Are you connected to main net?');
	});
}

async function signup() {
	let globalRef = 1; // Math.floor(Math.random() * 136) + 1;
	if (typeof tronWebGlobal === 'undefined' || typeof tronWebGlobal.trx === 'undefined') {
		showPopup('#fade', 'Tronlink wallet not found');
	} else {
		if (!isReferredLink) {
			refer = $('#ref-addr').val();
			if (refer === '') {
				refer = globalRef
			}
		} else {
			if (refer === '') {
				refer = $('#ref-addr').val() === '' ? globalRef : $('#ref-addr').val();
			}
		}

		showPopup('#fadeLoading', 'Signing up, please wait...');
		contractGlobal.register(refer).send({
			feeLimit: 100000000,
			callValue: 40 * multiplier
		}).then(async (receipt) => {
			$('#fadeLoading').popup('hide');
			login('Registration failed. Please try again later')
			return
			showPopup('#fadeLoading', 'Waiting for the transaction to complete, please wait...');
			checkTransactionStatus(receipt, 0).then(async (res) => {
				console.log(res)
				$('#fadeLoading').popup('hide');
				if (typeof res.ret === 'undefined' || typeof res.ret[0].contractRet === 'undefined') {
					showPopup('#fade', 'Sign-up failed.' +
					' Please try again later');
				} else {
					if (res.ret[0].contractRet === 'REVERT') {
						// Revert may be because the user already have an account. Let's try login
						login('Sign-up failed: Transaction was reversed')
					} else if (res.ret[0].contractRet === 'SUCCESS') {
						showPopup('#fade', 'Sign-up was successful!');
						getAccount().then(() => {
							sessionStorage.isViewOnly = false;
							window.location.href = '/dashboard';
						}).catch((err) => {
							console.log('Get account failed');
							console.log(err);
						});
					} else {
						showPopup('#fade', 'Sign-up failed: Transaction status not recognized.' +
							' Please make sure that you have a minimum of 110 TRX for registration/network fee and try again');
					}
				}
			}).catch((err) => {
				$('#fadeLoading').popup('hide');
				console.log("checkTransactionStatus ERR" + err);
				showPopup('#fade', 'Sign-up failed: ' + err);
			});
		}).catch((err) => {
			$('#fadeLoading').popup('hide');
			showPopup('#fade', 'Sign-up failed');
			console.log(err);
		});
	}
}

function checkTransactionStatus(hash, stack) {
	return new Promise((resolve, reject) => {
		tronWebGlobal.trx.getConfirmedTransaction(hash).then((res) => {
			resolve(res);
		}).catch((err) => {
			if (err === 'Transaction not found' && stack < 5000) {
				checkTransactionStatus(hash, stack + 1).then(resolve).catch(reject);
			} else {
				reject(err);
			}
		});
	});
}

function _init(addr) {
			// $('.control').find('a').attr("href", window.location.origin + "/dashboard.html");
		// $('.partners').find('a').attr("href", window.location.origin + "/partners.html");
		// $('.uplines').find('a').attr("href", window.location.origin + "/uplines.html");
		// $('.lost-profit').find('a').attr("href", window.location.origin + "/lost.html");
	$('.wallet-box').find('p').text(addr.substring(0, 7) + '...' + addr.substring(addr.length - 7, addr.length));
	$('.address-box').find('p').text(contractAddress.substring(0, 7) + '...' + contractAddress.substring(contractAddress.length - 7, contractAddress.length));

	$('.wallet-box').find('div.copy-sec').find('a').attr("href", 'https://tronscan.org/#/address/' + addr);
	$('.address-box').find('div.copy-sec').find('a').attr("href", 'https://tronscan.org/#/contract/' + contractAddress);

	$('.wallet-box').find('div.copy-sec').find('span').click(() => {
		copyToClipboard(addr)
	});
	$('.address-box').find('div.copy-sec').find('span').click(() => {
		copyToClipboard(contractAddress)
	});
	$('.affilliate-link').find('div.link-box').click(() => {
		copyToClipboard($('.affilliate-link').find('div.link-box').find('p').text());
	});
	$('.display-mobile').click(() => {
		$('.left-item-cover').toggleClass('slide-in-menu');
	});


}

function getUserDetails() {
	contractGlobal.users(sessionStorage.currentAccount).call().then((result) => {
		sessionStorage.userID = parseInt(result.id._hex)
		$('.idNum').html(sessionStorage.userID);
		$('#affLink').find('p').text('https://globalpool.tripletron.com/start?refId=' + sessionStorage.userID);
		
		buyLevelTrigger();
	}).catch((err) => {
		console.log('Call for Level Failed');
		console.log(err);
	});
}

function levelPrice(level) {
	if (level == 2) {
		return 80 * multiplier;
	}
	if (level == 1) {
			return 40 * multiplier;
	}

	return (levelPrice(level - 1) + levelPrice(level - 2));
}

function levelCommission(level) {
	if(level >= 11) {
		return 20;
	}

	if(level >= 6) {
			return 15;
	}

	return 10;
}

function levelProfit(level, count) {
	return count * (100 - levelCommission(level))/100 * levelPrice(level)
}

function levelReferralEarnings(level, count) {
	return count * (levelCommission(level))/100 * levelPrice(level)
}

async function buyLevelTrigger() {
	for (let level = 1; level <= 16; level++) {
		try {
			let result = await contractGlobal.levelUsers(level, sessionStorage.currentAccount).call()
			const selector = `#level${level}`
			if (!result.isExist) {
				$(selector).children().find('span.earnings').text('0.00')
				$('#earnedEth').text((totalEarnings/multiplier).toFixed(2))
				$('#earnedUSD').text((trxPrice * totalEarnings/multiplier).toFixed(2))
				continue
			}
			$(selector).children().find('p').text("Active");
			$(selector).children().addClass('buyLevelActivated');
			$(selector).addClass('bg-c-green')
			$(`#level${level}Buy`).hide()
	
			let referral = parseInt(result.referredUsers._hex)
			$(selector).children().find('p.direct-referrals').text(`${referral} direct referrals`)
			let referralEarnings = levelReferralEarnings(level, referral)
			let payments = parseInt(result.paymentReceived._hex)
			let maxPayout = level <= 2 ? 2 : 3
			if (payments >= maxPayout) {
				$(selector).children().find('p').text("Completed");
			}
			let levelEarnings = levelProfit(level, payments)
			$(selector).children().find('span.earnings').text((levelEarnings/multiplier).toFixed(2))
			totalEarnings += (referralEarnings + levelEarnings)
			$('#earnedEth').text((totalEarnings/multiplier).toFixed(2))
			$('#earnedUSD').text((trxPrice * totalEarnings/multiplier).toFixed(2))
		} catch (err) {
			console.log('Call for Level Activation Time Failed');
			console.error(err);
		}
	}
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(() => {
		showPopup('#fade', 'Copied!');
	}).catch(err => {
		showPopup('#fade', 'Copy Failed!');
		console.log(err);
	});
}

function showPopup(popup, text) {
	$(popup).find('span').text(text);
	$(popup).popup('show');
}

function menuIcon() {
	$('.left-item-cover').toggleClass("open");
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function logoutClick() {
	sessionStorage.currentAccount = undefined;
	sessionStorage.currentAccountHex = undefined;
	sessionStorage.isViewOnly = false;
	window.location.href = '/';
}
