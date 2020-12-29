pragma solidity 0.5.8;

// TQPJS5zEdMV6JxVUfo93HbYYBVG6Dm2dwo

contract GlobalPool {
    address payable public ownerWallet;
    address payable internal networkFee;
    uint public currUserID;
    uint public totalPayout;
    uint REGISTRATION_FEE = 20  * (10**6);

    mapping(uint => uint) public levelCurrUserID;
    mapping(uint => uint) public levelActiveUserID;
   
    struct UserStruct {
      bool isExist;
      uint id;
      uint referrerID;
      uint referredUsers;
    }
    
    struct LevelUserStruct {
      bool isExist;
      uint id;
      uint paymentReceived; 
      uint referredUsers;
    }
    
    mapping (address => UserStruct) public users;
    mapping (uint => address) public userList;
    
    mapping(uint => mapping (address => LevelUserStruct)) public levelUsers;
    mapping(uint => mapping (uint => address)) public levelUserList;
    
    event RegisterUserEvent(address indexed _user, address indexed _referrer, uint _time);
    event PayReferralEvent(address indexed _user, address indexed _referral, uint _level, uint _time);
    event LostProfitEvent(address indexed _user, address indexed _referral, uint _level, uint _time);
    event BuyLevelEvent(address indexed _user,uint _value, uint _time);
    event GetLevelPaymentEvent(address indexed _user,address indexed _receiver, uint _value, uint _time);
     
    constructor(address payable _owner) public {
        ownerWallet = _owner;
        networkFee = msg.sender;
    
        UserStruct memory userStruct;
        currUserID++;

        userStruct = UserStruct({
            isExist: true,
            id: currUserID,
            referrerID: 0,
            referredUsers:0
           
        });
        
        users[ownerWallet] = userStruct;
        userList[currUserID] = ownerWallet;
       
        for(uint l = 1; l <= 16; l++) {
           LevelUserStruct memory leveluser;
        
            levelCurrUserID[l]++;

            leveluser = LevelUserStruct({
                isExist:true,
                id:levelCurrUserID[l],
                paymentReceived:0,
                referredUsers:0
            });
            levelActiveUserID[l] = levelCurrUserID[l];
            levelUsers[l][ownerWallet] = leveluser;
            levelUserList[l][levelCurrUserID[l]] = ownerWallet;
       }
       
        //// for networkFee
        UserStruct memory userStruct1;
        currUserID++;

        userStruct1 = UserStruct({
            isExist: true,
            id: currUserID,
            referrerID: 1,
            referredUsers:0
        });
        
        users[networkFee] = userStruct1;
        userList[currUserID] = networkFee;

        for(uint l = 1; l <= 16; l++) {
           LevelUserStruct memory leveluser;
        
            levelCurrUserID[l]++;

            leveluser = LevelUserStruct({
                isExist:true,
                id:levelCurrUserID[l],
                paymentReceived:0,
                referredUsers: 0
            });
            levelUsers[l][networkFee] = leveluser;
            levelUserList[l][levelCurrUserID[l]] = networkFee;
       }   
    }
     
    function() external payable {
        revert();
	}

    function levelPrice(uint _level) public pure returns(uint) {
        if (_level == 1) {
            return 20  * (10**6);
        }

        if (_level == 2) {
            return 2 * levelPrice(1);
        }

        return (levelPrice(_level - 1) + levelPrice(_level - 2));
    }

    function levelReferralCommission(uint _level) public pure returns(uint) {
        if (_level == 1) {
            return 0;
        }

        if(_level >= 11) {
            return 20;
        }
        
        if(_level >= 6) {
            return 15;
        }

        return 10;
    }

    function register(uint _referrerID) public payable {
        require(!users[msg.sender].isExist, "User Exists");
        require(_referrerID > 0 && _referrerID <= currUserID, 'Incorrect referral ID');
        require(msg.value == REGISTRATION_FEE, 'Incorrect Value');

        UserStruct memory userStruct;
        currUserID++;

        userStruct = UserStruct({
            isExist: true,
            id: currUserID,
            referrerID: _referrerID,
            referredUsers:0
        });

        users[msg.sender] = userStruct;
        userList[currUserID] = msg.sender;

        users[userList[users[msg.sender].referrerID]].referredUsers++;

        totalPayout += REGISTRATION_FEE;
        payReferral(1, msg.sender, REGISTRATION_FEE);
        emit RegisterUserEvent(msg.sender, userList[_referrerID], now);
    }
   
    function payReferral(uint _level, address _user, uint _amount) internal {
        if (_amount <= 0) {
            return;
        }
        address referrer = userList[users[_user].referrerID];
        if(levelUsers[_level][referrer].isExist) {
            levelUsers[_level][referrer].referredUsers+=1;
            address(uint160(referrer)).transfer(_amount);
            emit PayReferralEvent(referrer, _user, _level, now);
        } else {
            address(uint160(networkFee)).transfer(_amount);
            emit LostProfitEvent(referrer, _user, _level, now);
        }
    }
    
    function buyPackage(uint _level) public payable {
        require(users[msg.sender].isExist, "User Not Registered");
        require(_level >= 1 && _level <= 16, "Invalid level");
        if (_level > 1) {
            require(levelUsers[_level - 1][msg.sender].isExist, "You do not have previous level");
        }
        require(!levelUsers[_level][msg.sender].isExist, "Already in Autolevel");
        uint _levelPrice = levelPrice(_level);
        require(msg.value == _levelPrice, 'Incorrect Value');

        LevelUserStruct memory userStruct;
        address levelCurrentuser = levelUserList[_level][levelActiveUserID[_level]];

        levelCurrUserID[_level]++;

        userStruct = LevelUserStruct({
            isExist:true,
            id:levelCurrUserID[_level],
            paymentReceived:0,
            referredUsers: 0
        });

        levelUsers[_level][msg.sender] = userStruct;
        levelUserList[_level][levelCurrUserID[_level]]=msg.sender;
        totalPayout += _levelPrice;
        address(uint160(levelCurrentuser)).transfer(_levelPrice * (100 - levelReferralCommission(_level))/100);
        payReferral(_level, msg.sender, _levelPrice * levelReferralCommission(_level)/100);

        levelUsers[_level][levelCurrentuser].paymentReceived+=1;
        uint maxPayout = 2;
        if (_level >= 3) {
            maxPayout = 3;
        }
        if(levelUsers[_level][levelCurrentuser].paymentReceived >= maxPayout)
        {
            levelActiveUserID[_level]+=1;
        }

        emit GetLevelPaymentEvent(msg.sender,levelCurrentuser, msg.value, now);
        emit BuyLevelEvent(msg.sender, msg.value, now);
    }
}