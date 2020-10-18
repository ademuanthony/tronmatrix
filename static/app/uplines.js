function init() {
	$('.loader-section').css('display', 'none');
	showPopup('#fadeLoading', 'Please Wait while the data is loading!');
	getUserDetails();
	getUserDetails1();
}

function getUserDetails1() {
	contractGlobal.getUserDetails(sessionStorage.currentAccount).call().then((result) => {
		$('#idLevel').html(parseInt(result[0]._hex));
		$('#idNum').html(parseInt(result[1]._hex));
		getUserUpline(parseInt(result[0]._hex));
	}).catch((err) => {
		console.error('Call for Level Failed');
		console.log(err);
	});
}

function getUserUpline(level) {
	let ul = {};
	level = (level > 6) ? 6 : level;
	contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 1).call(function (error, result) {
		ul[0] = result;
		contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 2).call(function (error, result) {
			ul[1] = result;
			contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 3).call(function (error, result) {
				ul[2] = result;
				contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 4).call(function (error, result) {
					ul[3] = result;
					contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 5).call(async function (error, result) {
						ul[4] = result;
						if (level === 1) {
							await fillUplineData(ul, level);
						} else if (level > 1) {
							contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 6).call(async function (error, result) {
								ul[5] = result;
								if (level === 2) {
									await fillUplineData(ul, level);
								} else if (level > 2) {
									contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 7).call(async function (error, result) {
										ul[6] = result;
										if (level === 3) {
											await fillUplineData(ul, level);
										} else if (level > 3) {
											contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 8).call(async function (error, result) {
												ul[7] = result;
												if (level === 4) {
													await fillUplineData(ul, level);
												} else if (level > 4) {
													contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 9).call(async function (error, result) {
														ul[8] = result;
														if (level === 5) {
															await fillUplineData(ul, level);
														} else if (level > 5) {
															contractGlobal.getUserUpline(sessionStorage.currentAccount, level, 10).call(async function (error, result) {
																ul[9] = result;
																await fillUplineData(ul, level);
															}).catch((err) => {
																console.log(err);
																$('#fadeLoading').popup('hide');
																showPopup('#fade', 'Call for Up-line Failed');
															});
														}
													}).catch((err) => {
														console.log(err);
														$('#fadeLoading').popup('hide');
														showPopup('#fade', 'Call for Up-line Failed');
													});
												}
											}).catch((err) => {
												console.log(err);
												$('#fadeLoading').popup('hide');
												showPopup('#fade', 'Call for Up-line Failed');
											});
										}
									}).catch((err) => {
										console.log(err);
										$('#fadeLoading').popup('hide');
										showPopup('#fade', 'Call for Up-line Failed');
									});
								}
							}).catch((err) => {
								console.log(err);
								$('#fadeLoading').popup('hide');
								showPopup('#fade', 'Call for Up-line Failed');
							});
						}
					}).catch((err) => {
						console.log(err);
						$('#fadeLoading').popup('hide');
						showPopup('#fade', 'Call for Up-line Failed');
					});
				}).catch((err) => {
					console.log(err);
					$('#fadeLoading').popup('hide');
					showPopup('#fade', 'Call for Up-line Failed');
				});
			}).catch((err) => {
				console.log(err);
				$('#fadeLoading').popup('hide');
				showPopup('#fade', 'Call for Up-line Failed');
			});
		}).catch((err) => {
			console.log(err);
			$('#fadeLoading').popup('hide');
			showPopup('#fade', 'Call for Up-line Failed');
		});
	}).catch((err) => {
		console.log(err);
		$('#fadeLoading').popup('hide');
		showPopup('#fade', 'Call for Up-line Failed');
	});
}

async function fillUplineData(obj, _level) {
	$('#fadeLoading').popup('hide');
	let entries = _level + 4;
	for (let i = 0; i < entries; i++) {
		let address = obj[i];
		if (address === '410000000000000000000000000000000000000000') {
			continue
		}
		let id, level;
		if (address !== '410000000000000000000000000000000000000000') {
			let user = await contractGlobal.getUserDetails(address).call();
			address = tronWebGlobal.address.fromHex(address);
			id = user[1];
			level = user[0];
		} else {
			address = '0x0000000000000000000000000000000000000000';
			id = 'NA';
			level = 'NA';
		}
		if (screen.width < 767) {
			address = address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length);
		}
		$('<tr><td>' + (i + 1) + '</td><td>' + id + '</td><td>' + level + '</td><td>' + address + '</td></tr>').appendTo('.table-content');
	}
}
