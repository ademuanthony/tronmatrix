
// for(let i = 65; i <= 74; i++) {insertV1User(i)}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

window.insertV1User = async function (min, max) {
	for (let id = min; id <= max; id++) {
		let _user, _referrerID, _created, randNum = String(randomIntFromInterval(475, 724));
		tronWebGlobal.contract().at('TJ7sahmVoFN1Y9PPygydpUJqsobM4Gcgpe').then(async (fromContract) => {
			let result = await fromContract.userAddresses(id).call()
			_user = await tronWebGlobal.address.fromHex(result)
			result = await fromContract.getUser(_user, 1).call()
			_referrerID = result[1]
			_created = result[3]
			let levelResult = await fromContract.getUserLevel(_user).call();
			let _level = parseInt(levelResult)

			let cumDirectDownlines = 0;
			if (id == 10 || id == 11 || id == 4) {
				cumDirectDownlines = 18
			}
			if (id == 395 || id == 5) {
				cumDirectDownlines = 6
			}
			if (id == 505) {
				_level = 2
				cumDirectDownlines = 6
			}

			console.log(_user, id, parseInt(_referrerID._hex), parseInt(_created._hex), _level, cumDirectDownlines, randNum)
			contractGlobal.insertV1User(_user, String(id), String(parseInt(_referrerID._hex)),
					String(parseInt(_created._hex)), String(_level), String(cumDirectDownlines), String(randNum)).send({
						feeLimit: 20000000,
					}).then((result) => {
				console.log('done', result)
			})
		}).catch((err) => {
			console.error('Failed to get contract. Are you connected to main net?');
			console.log(err);
			showPopup('#fade', 'Failed to get contract. Are you connected to main net?');
		});
		await sleep(5000)
	}
}