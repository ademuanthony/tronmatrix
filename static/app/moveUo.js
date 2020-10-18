
// for(let i = 65; i <= 74; i++) {insertV1User(i)}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

window.insertV1User = async function (min, max) {
	for (let id = min; id <= max; id++) {
		let _user, _referrerID, _created, _l1, _l2, _l3, _l4, _l5, _l6, randNum = String(randomIntFromInterval(2046, 4093));
		tronWebGlobal.contract().at('TRUforvgWS4b9xnZBGipxZ97oNGRCZDTvH').then(async (fromContract) => {
			let result = await fromContract.userAddresses(id).call()
			_user = await tronWebGlobal.address.fromHex(result)
			result = await fromContract.getUser(_user).call()
			_referrerID = result[1]
			_created = result[3]
			_l1 = await fromContract.getLevelActivationTime(_user, 1).call()
			_l2 = await fromContract.getLevelActivationTime(_user, 2).call()
			_l3 = await fromContract.getLevelActivationTime(_user, 3).call()
			_l4 = await fromContract.getLevelActivationTime(_user, 4).call()
			_l5 = await fromContract.getLevelActivationTime(_user, 5).call()
			_l6 = await fromContract.getLevelActivationTime(_user, 6).call()
			let _level;
			if (parseInt(_l6) > 0) {
				_level = 6
			} else if (parseInt(_l5) > 0) {
				_level = 5
			} else if (parseInt(_l4) > 0) {
				_level = 4
			} else if (parseInt(_l3) > 0) {
				_level = 3
			} else if (parseInt(_l2) > 0) {
				_level = 2
			} else {
				_level = 1
			}
			let six = [10, 11, 4]
			if (id == 10 || id == 11 || id == 4) {
				_level = 6
			}
			if (id == 395) {
				_level = 2
			}

			console.log(_user, id, parseInt(_referrerID._hex), parseInt(_created._hex), _level, randNum)
			contractGlobal.insertV1User(_user, String(id), String(parseInt(_referrerID._hex)),
					String(parseInt(_created._hex)), String(_level), String(randNum)).send().then((result) => {
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