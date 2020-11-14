pragma solidity ^0.5.8;

library SafeMath {
	/**
	 * @dev Returns the addition of two unsigned integers, reverting on
	 * overflow.
	 *
	 * Counterpart to Solidity's `+` operator.
	 *
	 * Requirements:
	 *
	 * - Addition cannot overflow.
	 */
	function add(uint256 a, uint256 b) internal pure returns (uint256) {
		uint256 c = a + b;
		require(c >= a, "SafeMath: addition overflow");

		return c;
	}

	/**
	 * @dev Returns the subtraction of two unsigned integers, reverting on
	 * overflow (when the result is negative).
	 *
	 * Counterpart to Solidity's `-` operator.
	 *
	 * Requirements:
	 *
	 * - Subtraction cannot overflow.
	 */
	function sub(uint256 a, uint256 b) internal pure returns (uint256) {
		return sub(a, b, "SafeMath: subtraction overflow");
	}

	/**
	 * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
	 * overflow (when the result is negative).
	 *
	 * Counterpart to Solidity's `-` operator.
	 *
	 * Requirements:
	 *
	 * - Subtraction cannot overflow.
	 */
	function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b <= a, errorMessage);
		uint256 c = a - b;

		return c;
	}

	/**
	 * @dev Returns the multiplication of two unsigned integers, reverting on
	 * overflow.
	 *
	 * Counterpart to Solidity's `*` operator.
	 *
	 * Requirements:
	 *
	 * - Multiplication cannot overflow.
	 */
	function mul(uint256 a, uint256 b) internal pure returns (uint256) {
		// Gas optimization: this is cheaper than requiring 'a' not being zero, but the
		// benefit is lost if 'b' is also tested.
		// See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
		if (a == 0) {
			return 0;
		}

		uint256 c = a * b;
		require(c / a == b, "SafeMath: multiplication overflow");

		return c;
	}

	/**
	 * @dev Returns the integer division of two unsigned integers. Reverts on
	 * division by zero. The result is rounded towards zero.
	 *
	 * Counterpart to Solidity's `/` operator. Note: this function uses a
	 * `revert` opcode (which leaves remaining gas untouched) while Solidity
	 * uses an invalid opcode to revert (consuming all remaining gas).
	 *
	 * Requirements:
	 *
	 * - The divisor cannot be zero.
	 */
	function div(uint256 a, uint256 b) internal pure returns (uint256) {
		return div(a, b, "SafeMath: division by zero");
	}

	/**
	 * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
	 * division by zero. The result is rounded towards zero.
	 *
	 * Counterpart to Solidity's `/` operator. Note: this function uses a
	 * `revert` opcode (which leaves remaining gas untouched) while Solidity
	 * uses an invalid opcode to revert (consuming all remaining gas).
	 *
	 * Requirements:
	 *
	 * - The divisor cannot be zero.
	 */
	function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b > 0, errorMessage);
		uint256 c = a / b;
		// assert(a == b * c + a % b); // There is no case in which this doesn't hold

		return c;
	}

	/**
	 * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
	 * Reverts when dividing by zero.
	 *
	 * Counterpart to Solidity's `%` operator. This function uses a `revert`
	 * opcode (which leaves remaining gas untouched) while Solidity uses an
	 * invalid opcode to revert (consuming all remaining gas).
	 *
	 * Requirements:
	 *
	 * - The divisor cannot be zero.
	 */
	function mod(uint256 a, uint256 b) internal pure returns (uint256) {
		return mod(a, b, "SafeMath: modulo by zero");
	}

	/**
	 * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
	 * Reverts with custom message when dividing by zero.
	 *
	 * Counterpart to Solidity's `%` operator. This function uses a `revert`
	 * opcode (which leaves remaining gas untouched) while Solidity uses an
	 * invalid opcode to revert (consuming all remaining gas).
	 *
	 * Requirements:
	 *
	 * - The divisor cannot be zero.
	 */
	function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
		require(b != 0, errorMessage);
		return a % b;
	}
}

contract TripleTronGlobal {
	using SafeMath for uint;

	bool public contractStatus;
	uint public created;
	uint public levelDown;
	uint public last_uid;
	uint public maxLevel = 6;
	uint public referralLimit = 3;
	uint multiplier = 1000000;
	address public owner;
	address public creator;
	mapping(uint => mapping(address => User)) public users;
	mapping(uint => address) public userAddresses;
	mapping(uint => mapping(uint => uint)) public directReferrals;
	mapping(address => uint) public usersLevels;
	mapping(uint => uint[]) paymentQueue;
	mapping(uint => uint) paymentCursor;
	mapping(uint => uint) currentPaymentCount;
	mapping(uint => uint) insertCursor;

	event RegisterUserEvent(address indexed user, address indexed referrer, uint time);
	event BuyLevelEvent(address indexed user, uint indexed level, uint time);
	event GetLevelProfitEvent(address indexed user, address indexed referral, uint indexed level, uint time);
	event LostLevelProfitEvent(address indexed user, address indexed referral, uint indexed level, uint time);

	event Transfer(address from, address to, uint amount, uint time);

	struct User {
		uint id;
		uint referrerID;
		uint sponsorID;
		uint position;
		address[] referrals;
		address[] directReferrals;
		mapping(uint => uint) levelActivationTime;
		uint created;
	}

	modifier contractActive() {
		require(contractStatus == true);
		_;
	}
	modifier validLevelAmount(uint _level) {
		require(msg.value == levelPrice(_level), 'Invalid level amount sent');
		_;
	}
	modifier userRegistered() {
		require(users[1][msg.sender].id != 0, 'User does not exist');
		_;
	}
	modifier validReferrerID(uint _referrerID) {
		require(_referrerID > 0 && _referrerID <= last_uid, 'Invalid referrer ID');
		require(users[1][msg.sender].id != _referrerID, 'Refer ID cannot be same as User ID');
		_;
	}
	modifier userNotRegistered() {
		require(users[1][msg.sender].id == 0, 'User is already registered');
		_;
	}
	modifier validLevel(uint _level) {
		require(_level > 0 && _level <= maxLevel, 'Invalid level entered');
		_;
	}
	modifier onlyCreator() {
		require(msg.sender == creator, 'You are not the creator');
		_;
	}
	modifier onlyOwner() {
		require(msg.sender == owner, 'You are not the owner');
		_;
	}
	modifier onlyForUpgrade() {
		require(last_uid <= 1000, 'The last id has past the v1 last id');
		_;
	}

	constructor(address _owner) public {
		contractStatus = true;
		owner = _owner;
		creator = msg.sender;
		created = block.timestamp;
		levelDown = 5;

		last_uid++;
		for (uint i = 1; i <= maxLevel; i++) {
			users[i][creator] = User({
				id : last_uid,
				referrerID : 0,
				sponsorID: 0,
				position: 0,
				referrals : new address[](0),
				directReferrals : new address[](0),
				created : block.timestamp
			});
			directReferrals[i][last_uid] = 3;
			if (i > 1) {
				paymentQueue[i].push(last_uid);
				paymentCursor[i] = 0;
			}
		}
		
		userAddresses[last_uid] = creator;
		usersLevels[creator] = maxLevel;
	}

	function changeOwner(address newOwner) 
	public 
	onlyOwner() {
		owner = newOwner;
	}

	function changeContractStatus(bool newValue)
	public
	onlyCreator() {
		contractStatus = newValue;
	}

	function changeLevelDown(uint newValue)
	public
	onlyCreator() {
		levelDown = newValue;
	}

	function() external payable {
		revert();
	}

	function registerUser(uint _referrerID, uint randNum)
	public
	payable
	userNotRegistered()
	validReferrerID(_referrerID)
	contractActive()
	validLevelAmount(1) {

		directReferrals[1][_referrerID] += 1;
		users[1][userAddresses[_referrerID]].directReferrals.push(msg.sender);
		uint sponsorID = _referrerID;
		if (users[1][userAddresses[_referrerID]].referrals.length >= referralLimit) {
			_referrerID = users[1][findReferrer(userAddresses[_referrerID], 1, true, randNum)].id;
		}
		last_uid++;
		users[1][msg.sender] = User({
			id : last_uid,
			referrerID : _referrerID,
			sponsorID: sponsorID,
			position: 0,
			referrals : new address[](0),
			directReferrals : new address[](0),
			created : block.timestamp
		});

		userAddresses[last_uid] = msg.sender;
		usersLevels[msg.sender] = 1;
		users[1][userAddresses[_referrerID]].referrals.push(msg.sender);

		transferLevelPayment(1, msg.sender);

		emit RegisterUserEvent(msg.sender, userAddresses[_referrerID], block.timestamp);
	}

	function buyLevel(uint _level)
	public
	payable
	userRegistered()
	validLevel(_level)
	contractActive()
	validLevelAmount(_level) {

		for (uint l = _level - 1; l > 0; l--) {
			require(users[l][msg.sender].id > 0, 'Buy previous level first');
		}
		require(users[_level][msg.sender].id == 0, 'Level already active');
		require(canUpgrade(users[1][msg.sender].id, _level), "You are not qualified to upgrade to this level");

		directReferrals[_level][users[1][msg.sender].sponsorID]++;
		usersLevels[msg.sender] = _level;
		
		users[_level][msg.sender] = User({
			id : users[1][msg.sender].id,
			sponsorID: users[1][msg.sender].sponsorID,
			referrerID : 0,
			position: 0,
			referrals : new address[](0),
			directReferrals: new address[](0),
			created : block.timestamp
		});
		
		transferGlobalLevelPayment(_level, msg.sender);
		if (directReferrals[_level][users[1][msg.sender].sponsorID] == earningCondition(_level)) {
			// insert to matrix and payment queue
			addToGlobalPool(userAddresses[users[1][msg.sender].sponsorID], _level);
		}
		if(directReferrals[_level][users[1][msg.sender].id] >= earningCondition(_level)) {
			// and to matrix and payment queue
			addToGlobalPool(msg.sender, _level);
		}
		emit BuyLevelEvent(msg.sender, _level, block.timestamp);
	}

	function addToGlobalPool(address _user, uint _level) internal {
		if (users[_level][_user].id == 0) {
			return;
		}
		address parentAddr = getNextGlobalUpline(_level);
		users[_level][parentAddr].referrals.push(_user);
		users[_level][_user].referrerID = users[1][parentAddr].id;
		users[_level][_user].position = paymentQueue[_level].length;
		paymentQueue[_level].push(users[1][_user].id);
	}

	function getNextGlobalUpline(uint _level) internal returns(address) {
		uint userID = paymentQueue[_level][insertCursor[_level]];
		if (users[_level][userAddresses[userID]].referrals.length >= referralLimit) {
			insertCursor[_level]++;
			return getNextGlobalUpline(_level);
		}
		return userAddresses[userID];
	}

	function canReceiveLevelPayment(uint _userID, uint _level) internal view returns (bool){
		if (_level == 1) {
			return true;
		}
		if (users[_level][userAddresses[_userID]].id == 0) {
			return false;
		}
		return directReferrals[_level][_userID] >= earningCondition(_level);
	}

	function canUpgrade(uint _userID, uint _level) internal view returns (bool){
		if(_level == 1) {
			return true;
		}
		uint count;
		for(uint i = 0; i < users[1][userAddresses[_userID]].directReferrals.length; i++){
			uint downlineID = users[1][users[1][userAddresses[_userID]].directReferrals[i]].id;
			if (canReceiveLevelPayment(downlineID, _level - 1)) {
				count++;
			}
		}
		return (count >= earningCondition(_level - 1));
	}


	function insertV1User(address _user, uint _id, uint _referrerID, uint _created, uint _level, uint[] memory referralsCount, uint randNum) 
	public
	onlyCreator()
	onlyForUpgrade()
	{
		require(users[1][_user].id == 0, 'User is already registered');
		if (users[1][userAddresses[_referrerID]].referrals.length >= referralLimit) {
			_referrerID = users[1][findReferrer(userAddresses[_referrerID], 1, true, randNum)].id;
		}
		if (_id > last_uid) {
			last_uid = _id;
		}
		
		users[1][_user] = User({
			id : _id,
			referrerID : _referrerID,
			sponsorID: _referrerID,
			position: 0,
			referrals : new address[](0),
			directReferrals : new address[](0),
			created : _created
		});
		userAddresses[_id] = _user;
		users[1][userAddresses[_referrerID]].referrals.push(userAddresses[_id]);
		users[1][userAddresses[_referrerID]].directReferrals.push(userAddresses[_id]);
		directReferrals[1][_id] = referralsCount[0];

		insertV1LevelPayment(1, userAddresses[_id]);
		emit RegisterUserEvent(userAddresses[_id], userAddresses[_referrerID], _created);

		for (uint l = 2; l <= _level; l++) {
			users[l][userAddresses[_id]] = User({
				id : _id,
				referrerID : 0,
				sponsorID: _referrerID,
				position: 0,
				referrals : new address[](0),
				directReferrals : new address[](0),
				created : _created
			});
			directReferrals[l][_id] = referralsCount[l-1];
			if(directReferrals[l][_id] >= earningCondition(l)) {
				// and to matrix and payment queue
				addToGlobalPool(userAddresses[_id], l);
			}
			emit BuyLevelEvent(userAddresses[_id], l, _created);
		}

		usersLevels[userAddresses[_id]] = _level;
	}

	function findReferrer(address _user, uint level, bool traverseDown, uint randNum)
	public
	view
	returns (address) {
		if (users[level][_user].referrals.length < referralLimit) {
			return _user;
		}

		uint arraySize = 3 * ((3 ** levelDown) - 1);
		uint previousLineSize = 3 * ((3 ** (levelDown - 1)) - 1);
		address referrer;
		address[] memory referrals = new address[](arraySize);
		referrals[0] = users[level][_user].referrals[0];
		referrals[1] = users[level][_user].referrals[1];
		referrals[2] = users[level][_user].referrals[2];

		for (uint i = 0; i < arraySize; i++) {
			if (users[level][referrals[i]].referrals.length < referralLimit) {
				referrer = referrals[i];
				break;
			}

			if (i < previousLineSize) {
				referrals[(i + 1) * 3] = users[level][referrals[i]].referrals[0];
				referrals[(i + 1) * 3 + 1] = users[level][referrals[i]].referrals[1];
				referrals[(i + 1) * 3 + 2] = users[level][referrals[i]].referrals[2];
			}
		}

		if (referrer == address(0) && traverseDown == true) {
			if (randNum >= previousLineSize && randNum < arraySize) {
				address childAddress = findReferrer(referrals[randNum], level, false, randNum + 1);
				if (childAddress != address(0)) {
					referrer = childAddress;
				}
			}

			if (referrer == address(0)) {
				for (uint i = previousLineSize; i < arraySize; i++) {
					address childAddress = findReferrer(referrals[i], level, false, randNum + 1);
					if (childAddress != address(0)) {
						referrer = childAddress;
						break;
					}
				}
			}
			require(referrer != address(0), 'Referrer not found');
		}

		return referrer;
	}

	function transferLevelPayment(uint _level, address _user) internal {
		address referrer;
		uint sentValue = 0;

		for (uint i = 1; i <= uplines(_level); i++) {
			referrer = getUserUpline(_user, _level, i);
			if (referrer == address(0)) {
				referrer = owner;
			}
			if (canReceiveLevelPayment(users[1][referrer].id, _level)) {

				address(uint160(referrer)).transfer(incentive(_level));
				emit GetLevelProfitEvent(_user, referrer, _level, block.timestamp);
			} else {

				address(uint160(owner)).transfer(incentive(_level));
				emit LostLevelProfitEvent(_user, referrer, _level, block.timestamp);
			}
			sentValue += incentive(_level);
		}

		address(uint160(owner)).transfer(msg.value - sentValue);
	}

	function transferGlobalLevelPayment(uint _level, address _user) internal {
		uint currentID = paymentQueue[_level][paymentCursor[_level]];
		if (users[_level][userAddresses[currentID]].referrals.length >= referralLimit ||
		 currentPaymentCount[_level] >= referralLimit) {
			movePaymentCursor(_level);
		}
		address userToPay = userAddresses[paymentQueue[_level][paymentCursor[_level]]];

		if(userToPay == address(0)) {
			userToPay = owner;
		}
		address(uint160(userToPay)).transfer(incentive(_level));
		emit GetLevelProfitEvent(_user, userToPay, _level, block.timestamp);

		address referrer;
		uint sentValue = incentive(_level);

		for (uint i = 1; i < uplines(_level); i++) { // stop at x - 1 as the 1st user was paid outside this loop
			referrer = getUserUpline(userToPay, _level, i);
			if (referrer == address(0)) {
				referrer = owner;
			}
			address(uint160(referrer)).transfer(incentive(_level));
			emit GetLevelProfitEvent(_user, referrer, _level, block.timestamp);
			sentValue += incentive(_level);
		}

		address(uint160(owner)).transfer(msg.value - sentValue);
		currentPaymentCount[_level]++;
	}

	function movePaymentCursor(uint _level) internal {
		currentPaymentCount[_level] = 0;
		if (paymentQueue[_level].length > paymentCursor[_level] + 1) {
			paymentCursor[_level]++;
			return;
		}
		if (paymentCursor[_level] <= 3){
			if(paymentCursor[_level] != 0) {
				paymentCursor[_level] = 0;
			}
			return;
		}
		uint currentID = paymentQueue[_level][paymentCursor[_level]];
		uint parentID = users[_level][userAddresses[currentID]].referrerID;
		paymentCursor[_level] = users[_level][userAddresses[parentID]].position + 1;
	}

	function insertV1LevelPayment(uint _level, address _user) internal {
		address referrer;

		for (uint i = 1; i <= uplines(_level); i++) {
			referrer = getUserUpline(_user, _level, i);
			if (referrer == address(0)) {
				referrer = owner;
			}

			emit GetLevelProfitEvent(_user, referrer, _level, block.timestamp);
		}
	}

	function levelPrice(uint _level) public view returns(uint) {
		if(_level == 1) {
			return 100 * multiplier;
		}
		if(_level == 2) {
			return 500 * multiplier;
		}
		if(_level == 3) {
			return 1000 * multiplier;
		}
		if(_level == 4) {
			return 3000 * multiplier;
		}
		if(_level == 5) {
			return 10000 * multiplier;
		}
		return 30000 * multiplier;
	}

	function uplines(uint _level) public pure returns(uint) {
		if(_level == 1) {
			return 5;
		}
		if(_level == 2) {
			return 6;
		}
		if(_level == 3) {
			return 7;
		}
		if(_level == 4) {
			return 8;
		}
		if(_level == 5) {
			return 9;
		}
		return 10;
	}

	function incentive(uint _level) public view returns(uint) {
		if(_level == 1) {
			return 18 * multiplier;
		}
		if(_level == 2) {
			return 75 * multiplier;
		}
		if(_level == 3) {
			return 128 * multiplier;
		}
		if(_level == 4) {
			return 325 * multiplier;
		}
		if(_level == 5) {
			return 1000 * multiplier;
		}
		return 2750 * multiplier;
	}

	function earningCondition(uint _level) public pure returns(uint) {
		if(_level == 1) {
			return 0;
		}
		return 3;
	}

	function getUserUpline(address _user, uint _level, uint height)
	public
	view
	returns (address) {
		if (height <= 0 || _user == address(0)) {
			return _user;
		}
		return getUserUpline(userAddresses[users[_level][_user].referrerID], _level, height - 1);
	}

	function getUser(address _user, uint _level)
	public
	view
	returns (uint, uint, address[] memory, uint) {
		return (
			users[_level][_user].id, 
			users[_level][_user].referrerID, 
			users[_level][_user].referrals, 
			users[_level][_user].created
		);
	}

	function getUserReferrals(address _user, uint _level)
	public
	view
	returns (address[] memory) {
		return users[_level][_user].referrals;
	}

	function getUserDirectReferralCounts(address _user) public view 
	returns (uint, uint, uint, uint, uint, uint){
		return (
			directReferrals[1][users[1][_user].id],
			directReferrals[2][users[1][_user].id],
			directReferrals[3][users[1][_user].id],
			directReferrals[4][users[1][_user].id],
			directReferrals[5][users[1][_user].id],
			directReferrals[6][users[1][_user].id]
		);
	}

	function getUserRecruit(address _user)
	public
	view
	returns (uint) {
		return directReferrals[1][users[1][_user].id];
	}

	function getLevelActivationTime(address _user, uint _level)
	public
	view
	returns (uint) {
		return users[_level][_user].created;
	}

	function getUserLevel(address _user) public view returns (uint) {
		if (getLevelActivationTime(_user, 1) == 0) {
			return (0);
		}
		else if (getLevelActivationTime(_user, 2) == 0) {
			return (1);
		}
		else if (getLevelActivationTime(_user, 3) == 0) {
			return (2);
		}
		else if (getLevelActivationTime(_user, 4) == 0) {
			return (3);
		}
		else if (getLevelActivationTime(_user, 5) == 0) {
			return (4);
		}
		else if (getLevelActivationTime(_user, 6) == 0) {
			return (5);
		}
		else {
			return (6);
		}
	}

	function getUserDetails(address _user) public view returns (uint, uint, address) {
		if (getLevelActivationTime(_user, 1) == 0) {
			return (0, users[1][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else if (getLevelActivationTime(_user, 2) == 0) {
			return (1, users[1][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else if (getLevelActivationTime(_user, 3) == 0) {
			return (2, users[2][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else if (getLevelActivationTime(_user, 4) == 0) {
			return (3, users[3][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else if (getLevelActivationTime(_user, 5) == 0) {
			return (4, users[4][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else if (getLevelActivationTime(_user, 6) == block.timestamp) {
			return (5, users[5][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
		else {
			return (6, users[6][_user].id, userAddresses[users[1][_user].sponsorID]);
		}
	}

}