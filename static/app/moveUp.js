
// for(let i = 65; i <= 74; i++) {insertV1User(i)}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

window.insertV1User = async function (min, max) {
	for (let id = min; id <= max; id++) {
		let _user, _referrerID, _created;
		tronWebGlobal.contract().at(contractAddress).then(async (fromContract) => {
			let result = await fromContract.userAddresses(id).call()
			_user = await tronWebGlobal.address.fromHex(result)
			result = await fromContract.getUser(_user, 1).call()// TODO: if registered before last version, skip
			_referrerID = result[1]
			_created = result[3]
			let levelResult = await fromContract.getUserLevel(_user).call();
			let _level = parseInt(levelResult)
			if (_level < 2) {
				return
			}

			var referrals = await fromContract.getUserReferrals(sessionStorage.currentAccount, 1).call();
			var referralsCount = [0, 0, 0, 0, 0, 0]
			for (let i = 0; i < referrals.length; i++) {
				if (parseInt(_created._hex) > 1604028306) {
					continue
				}
				result = await fromContract.getUserDetails(referrals[i]).call()
				let level = parseInt(result[0]._hex);
				for (let l = 0; l < 6; l++) {
					if (level >= l + 1) {
						referralsCount[l]++
					}
				}
			}

			result = await fromContract.getUserDirectReferralCounts(sessionStorage.currentAccount).call()
			for (let i = 0; i < result.length; i++) {
				referralsCount[i] += parseInt(result[i]._hex)
			}

			let cumDirectDownlines = 0;
			if (id == 10 || id == 11 || id == 4) {
				cumDirectDownlines = 18
				referralsCount = [3, 3, 3, 3, 3, 3]
			}
			if (id == 395 || id == 5 || id == 50 || id == 727 || id == 728 || id == 729 || id == 731) {
				referralsCount = [3, 3, 0, 0, 0, 0]
			}
			if (id == 505) {
				_level = 2
				referralsCount = [3, 3, 0, 0, 0, 0]
			}

			console.log(_user, id, parseInt(_referrerID._hex), parseInt(_created._hex), _level, referralsCount)
			//return
			gplContractGlobal.insertV1User(_user, String(id), String(parseInt(_referrerID._hex)),
					String(parseInt(_created._hex)), String(_level), referralsCount).send({
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