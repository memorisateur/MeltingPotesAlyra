// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;


/**
 * @title A contract where people can put together funds to spend it, with a 
 * deadline that automaticaly send back the funds to their owner. 
 * @author Arnaud Clary
 * @notice This contract has been made during Alyra course. DO NOT USE in production
 */
contract MeltingPotesFactory {


  MeltingPotes[] meltingPotesContracts;

    
  struct InstancesDetails {
    string title;
    address instanceAddress;
  }
  
  // @notice address in userInstancesAddress is the user wallet address
  // @notice address in allInstances is the smart contract address of each instance created
  mapping(address => InstancesDetails[]) public userInstancesAddress;
  mapping(address => InstancesDetails) public allInstances;


  /// events

  // USER INTERFACE
  event instanceCreated(address instanceAddress, string title, uint date, uint dateOfExpire, address administrator);
  event instanceAdded(address instanceAddress, address user, string title);


  constructor() {}

  ///////////////////////// GETTER //////////////////////////////////


  function getUserInstanceAddress(address _address, uint _num) external view returns(address) {
    return userInstancesAddress[_address][_num].instanceAddress;
  }
    /**
    * @notice Get the amount of ethers on a specific instance
    * @return The amount of ethers the instance has on the smart contract
    */
    function getBalanceOfInstanceByContract(MeltingPotes _contract) external view returns(uint) {
        return _contract.getBalanceOfInstance();
    }

    /** 
    * @notice Get the total amount of ethers on a specific instance
    * @return The amount of ethers that was sended on the instance
    */
    function getTotalBalanceOfInstanceByContract(MeltingPotes _contract) external view returns(uint) {
        return _contract.getTotalBalanceOfInstance();
    }

    /** 
    * @notice Get the title on the instance 
    * @return The title on the instance
    */
    function getTitleByContract(MeltingPotes _contract) external view returns(string memory) {
        return _contract.title();
    }

     /** 
    * @notice Get the instance's current status
    * @return The instance's current status
    */
    function getInstanceOffByContract(MeltingPotes _contract) external view returns(bool) {
        return _contract.instanceOff();
    }


///////////USER INTERFACE ////////////////////////

    /**
     * @notice create a new smart contract of MeltingPotes and add the user as participant 
     * @param _title give a title for easier comprehension
     * @param _minimumDeposit set the minimum deposit of the instance 
     * @param _dateOfExpire set the date of expire of the instance
     * @param _name set the name of the user
     */
function createMeltingPotesContracts(string memory _title, uint _minimumDeposit, uint _dateOfExpire, string memory _name) external returns(address) {
    require (userInstancesAddress[msg.sender].length <= 30, "You have reached the maximum amount of instances per user");
    address admin = msg.sender;
    // create new instance
    MeltingPotes instance = new MeltingPotes(admin, _title, _minimumDeposit, _dateOfExpire, _name); // Pass msg.sender as the first argument
    meltingPotesContracts.push(instance);

    // add the new instance to the list of userInstanceAddress
    InstancesDetails memory newInstance = InstancesDetails({
        title: _title,
        instanceAddress: address(instance)
    });
    userInstancesAddress[msg.sender].push(newInstance);

    // add to the mapping with all instances
    allInstances[address(instance)] = newInstance;

    emit instanceCreated(address(instance), _title, block.timestamp, _dateOfExpire, msg.sender);
    emit instanceAdded(address(instance), msg.sender, _title);

    return address(instance);
}



    /**
     * @notice add a smart contract to the user interface
     * @param _instanceAddress the address of the smart contract the user wants to connect into
     */
  function connectToInstance(address _instanceAddress) public {
    require (userInstancesAddress[msg.sender].length < 30, "You have reached the maximum amount of instances per user");
    require( _instanceAddress == allInstances[_instanceAddress].instanceAddress, "this address is not one of the smart contract's instance");
            for (uint i = 0; i < userInstancesAddress[msg.sender].length; i++) {
    require(userInstancesAddress[msg.sender][i].instanceAddress != _instanceAddress, "this instance is already registered");
        }
    require(msg.sender == MeltingPotes(_instanceAddress).getParticipant(msg.sender), "you are not allowed in this instance");

    InstancesDetails memory instanceToAdd = allInstances[_instanceAddress];
    userInstancesAddress[msg.sender].push(instanceToAdd);

    emit instanceAdded(_instanceAddress, msg.sender, instanceToAdd.title);
  }


}

contract MeltingPotes {

/**
 * @notice the participantAddress array is used to iter and send back the funds
 * @notice The allowedArray is used to iter and authorize receiving address if not empty
 */
    address[] public participantAddress;
    address[] public allowedArray;

    address public Administrator;

  struct Participant {
    string name;
    address userAddress;
    uint moneyDeposited;
    bool authorizedToSpend;
  }

  struct AllowedAddress {
    string name;
    address addressToSpend;
    bool isRegistered;
  }

    // @notice minimum amount per deposit for each user
    uint public minimumDeposit;

    // @notice date when instance expire
    uint public dateOfExpire;

    // @notice to switch the instance from active to inactive
    bool public instanceOff;

    // @notice title of the instance
    string public title;

   // @notice instance details
  struct InstanceType {
    uint balance;
    uint totalSended;
  }

    InstanceType Instance;

  /**
  * @notice address is the participant's address in participants
  * @notice address is the authorized address that can receive funds from the instance
  */
  mapping(address => Participant) public participants;
  mapping(address => AllowedAddress) public allowed;


  /// event
    // INSIDE INSTANCE
  event participantAdded(address userAddress, string name, bool authorizedToSpend);
  event EtherSpended(uint date, uint amount, address indexed from, address indexed to, string description);
  event EtherDeposited(address indexed from, uint amount);
  event addressAuthorized(address indexed newAddress, string name);

  // ENDING INSTANCE
  event instanceEnded( uint date);
  event moneySendedBack(uint date, address to, uint amount);

    /**
     * @notice initiate the instance's rules and conditions + set the msg.sender as the first participant and administrator
     * @param _title set the title of the instance, for better user experience
     * @param _minimumDeposit set the minimum amount of deposit for each users
     * @param _dateOfExpire set the date when the instance will end
     * @param _name gives an easy way to identify the administrator
     */
    constructor(address _admin, string memory _title, uint _minimumDeposit, uint _dateOfExpire, string memory _name) {
      require (_dateOfExpire > block.timestamp, "date of expire cannot be in the past");
        title = _title;
        minimumDeposit = _minimumDeposit;
        dateOfExpire = _dateOfExpire;

        participantAddress.push(msg.sender);

        Participant memory administrator =  Participant ({
            name: _name,
            userAddress: _admin,
            moneyDeposited: 0,
            authorizedToSpend: true
        });
        participants[msg.sender] = administrator;
        Administrator = _admin;
    emit participantAdded( _admin, _name, true);
    }

    /** @notice authorize only the participants to use the function */
    modifier isParticipant() {
        require(participants[msg.sender].userAddress == msg.sender, "You are not in this instance");
        _;
    }

        /** @notice authorize only the participants to use the function */
    modifier isAdministrator() {
        require(Administrator == msg.sender, "You are not the administrator");
        _;
    }
     /** @notice authorize only when the instance is actif */
    modifier isActif() {
        require(!instanceOff && block.timestamp < dateOfExpire, "The instance has ended");
        _;
    }
    /** @notice authorize only the participants that can spend the funds to use the function */
    modifier isAuthorized() {
        require(participants[msg.sender].authorizedToSpend, "You have not been authorized to spend");
         _;
    }


///////////////////////// GETTER //////////////////////////////////

    /**
    * @notice Get the amount of ethers the instance has on the smart contract 
    * @return The amount of ethers the instance has on the smart contract
    */
    function getBalanceOfInstance() public view returns(uint) {
        return Instance.balance;
    }

    /** 
    * @notice Get the total amount of ethers that was sended on the instance 
    * @return The amount of ethers that was sended on the instance
    */
    function getTotalBalanceOfInstance() public view returns(uint) {
        return Instance.totalSended;
    }

   /** 
    * @notice Get a participant address on the instance 
    * @return The participant address on the instance
    */
    function getParticipant(address _participantAddress) external view returns(address) {
        return participants[_participantAddress].userAddress;
    }

  /** 
  * @notice Get the minimum deposit parameter on the instance 
  * @return The minimum deposit on the instance
  */
  function getMoneyDeposited(address _address) external view returns(uint) {
      return participants[_address].moneyDeposited;
  }

    
////////////////// INSIDE INSTANCE //////////////////////

    /**
     * @notice add a new participant in the instance and emit event
     * @param _address get the new user address
     * @param _name gives an easy way to identify amoung other participants
     * @param _authorizedToSpend define if the new participant can spend the money in the instance
     */
  function addParticipant( address _address, string memory _name, bool _authorizedToSpend) external isActif isAdministrator {
    require(_address != address(0), "invalid address");
        for (uint i = 0; i < participantAddress.length; i++) {
    require(participantAddress[i] != _address, "this address is already registered");
        }

    // generate new participant
    Participant memory newParticipant = Participant ({
      name: _name,
      userAddress: _address,
      moneyDeposited: 0,
      authorizedToSpend: _authorizedToSpend
    });

    // add the new participant to the instance
    participants[_address] = newParticipant;
    participantAddress.push(newParticipant.userAddress);

    emit participantAdded( _address, _name, _authorizedToSpend);
  }


    /**
     * @notice add a new address where funds can be send in the instance and emit event
     * @param _name give a name for easier comprehension
     * @param _authorizedAddress new address to authorize
     */
  function addAuthorizedAddress(address _authorizedAddress, string memory _name) external isActif isAdministrator {
    require(_authorizedAddress != address(0) , "invalid address");
    require(allowed[_authorizedAddress].isRegistered != true, "this address is already registered");

    AllowedAddress memory newAllowedAddress = AllowedAddress ({
        name: _name,
        addressToSpend: _authorizedAddress,
        isRegistered: true
    });

      allowed[_authorizedAddress] = newAllowedAddress;
      allowedArray.push(newAllowedAddress.addressToSpend);

      emit addressAuthorized( _authorizedAddress, _name);
  }

    /**
     * @notice Allows the user to withdraw ethers from the smart contract 
     * @param _amount The amount of ethers the user wants to withdraw
     * @param _to The address of destination
     */
    function spendMoney(uint _amount, address _to, string memory _description) external isActif isAuthorized {
        require(_to != address(0) , "invalid address");
        require(Instance.balance >= _amount, "Not enough funds");

        // Automatically consider every address authorized if there is no specification
        if (allowedArray.length != 0) {
          require(allowed[_to].isRegistered == true, "this address is not authorized to receive funds");
        }
        (bool received, ) = _to.call{value: _amount}("");
        require(received, "An error occured");

        // update the balances
        Instance.balance -= _amount;

      emit EtherSpended( block.timestamp, _amount, msg.sender, _to, _description);
    }

    /** @notice Allows a user to deposit ethers on the smart contract */
    function depositMoney() external payable isActif isParticipant {
        require(msg.value >= minimumDeposit, "Not enough funds deposited");
        Instance.balance += msg.value;
        Instance.totalSended += msg.value;
        participants[msg.sender].moneyDeposited += msg.value;

        emit EtherDeposited( msg.sender, msg.value);
    }


  //////////////////////END INSTANCE//////////////////////////

    /**
     * @notice Fonction to calculate percentage 
     * @param _userBalance The amount of ethers the user sended during the instance
     * @param _totalBalance The total amount of ethers sended during the instance
     * @dev avoid security problem with divisions by rounding the result up to two decimal places
    */
    function calculatePercentage(uint _userBalance, uint _totalBalance) public pure returns (uint256) {
      require(_totalBalance > 0, "There is no money to send back");
    
    // If user never sent eth, it will return 0
      if (_userBalance == 0) {
        return 0;
      }

    // Calculate percentage with rounding to two decimal places
      uint256 percentage = (_userBalance * 100 * 100) / _totalBalance; // Multiply by 100 twice for two decimal places

      return percentage;
    }

    /**
     * @notice Fonction to calculate money to send back for each participant
     * @param _balance The amount of ethers left in the instance
     * @param _percentage The percentage of the balance to send back
     */
    function calculateAmountToSend(uint _balance, uint _percentage) public pure returns (uint) {
      require(_balance > 0, "There is no money to send back");

        // if user never sended eth, it will return 0
        if ( _percentage == 0) {
            return 0;
        }
        uint256 amountToSend = (_balance * _percentage) / 10000;
        return amountToSend;
    }
   

    /** @notice Allows the users to get back their funds */
    function sendBackFunds() public {
     require(Instance.balance > 0, "there is no money to send back");

      // get the balance and totalMoneySended
      uint totalBalance = getTotalBalanceOfInstance();
      uint balance = getBalanceOfInstance();

      // update the balance and avoid reentrancy attack
      Instance.balance = 0;

      // goes through all the array to calculate and send the money own to each
      for (uint i = 0; i < participantAddress.length; i++) {

        // get the percentage of money to send to this user
        address userAddress = participantAddress[i];
        uint userBalance = participants[userAddress].moneyDeposited;
        uint percentage = calculatePercentage(userBalance, totalBalance);

        // calculate the money to send
        uint moneyToSend = calculateAmountToSend(balance, percentage);

        if(moneyToSend == 0) {
          continue;
        }
          // call to withdraw
        (bool received, ) = userAddress.call{value: moneyToSend}("");
        require(received, "A nasty error occured");

        //save the event
        emit moneySendedBack(block.timestamp, userAddress, moneyToSend);
          }
      }

      /** @notice allows the administrator to end the instance prematurally */
    function endInstanceBeforeDateOfExpire() external isActif isAdministrator {

      instanceOff = true;
      sendBackFunds();

      emit instanceEnded( block.timestamp);
    }


    /** @notice allow participants to get back their funds after date of expire */
    function endInstanceAfterDateOfExpire() external isParticipant {
      require(block.timestamp > dateOfExpire, "the instance is still active");
      require(!instanceOff, "Instance already ended");
      instanceOff = true;
      sendBackFunds();
      emit instanceEnded( block.timestamp);
    }

}

  /////////////////////////////////////////////////////////////////