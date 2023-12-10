const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { time } = require ("@nomicfoundation/hardhat-network-helpers");
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require('ethers');

  describe('MeltingPotesFactory contract', function() {
    async function deployMeltingPotesFactory() {
      //deploy the Contract MeltingPotesFactory with right infos.
      const MeltingPotesFactory = await ethers.getContractFactory('MeltingPotesFactory');
      const [owner, part1, part2, part3, authAddr4, authAddr5, addr6] =
      await ethers.getSigners();

      const meltingPotesFactory = await MeltingPotesFactory.deploy();

      return { MeltingPotesFactory, meltingPotesFactory, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    async function deployMeltingPotesFactory_withNewInstances() {
      const { MeltingPotesFactory, meltingPotesFactory, owner, part1, part2, part3, authAddr4, authAddr5, addr6 } =
      await deployMeltingPotesFactory();

      await meltingPotesFactory.createMeltingPotesContracts("first instance", 5000000000, 1703074776, "Lary");
      await meltingPotesFactory.createMeltingPotesContracts("second instance", 6000000000, 1706074776, "Arnaud");
      const firstInstance = await meltingPotesFactory.getUserInstanceAddress(owner.address, 0);
      const secondInstance = await meltingPotesFactory.getUserInstanceAddress(owner.address, 1);

       // Créez une instance de MeltingPotes à partir de l'adresse obtenue
       const mpFirstInstance = await ethers.getContractAt('MeltingPotes', firstInstance);
       const mpSecondInstance = await ethers.getContractAt('MeltingPotes', secondInstance);

      return { MeltingPotesFactory, meltingPotesFactory, mpFirstInstance, mpSecondInstance, firstInstance, secondInstance,
         owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    /////////////////////////////////////////////////////////

    describe('USER INTERFACE - new instance', () => {
      it('should should generate differents random address', async () => {
        const { meltingPotesFactory, firstInstance, secondInstance } =
        await loadFixture(deployMeltingPotesFactory_withNewInstances);
        expect(firstInstance).to.not.be.equal(secondInstance);
      });
  
      it('should not be able to create more than 30 instances', async () => {
        const { meltingPotesFactory } =
        await loadFixture(deployMeltingPotesFactory_withNewInstances);
        for(let i = 0; i < 29; i++) {
          await meltingPotesFactory.createMeltingPotesContracts("second instance", 6000000000, 1706074776, "Arnaud");
        }
        await expect(meltingPotesFactory.createMeltingPotesContracts("last instance", 6000000000, 1706074776, "Arnaud")).to.be.
        revertedWith("You have reached the maximum amount of instances per user")
      });
  
      it('should create a new instance with right parameters', async () => {
        const { meltingPotesFactory, firstInstance, mpFirstInstance } =
        await loadFixture(deployMeltingPotesFactory_withNewInstances);

        const balance = await meltingPotesFactory.getBalanceOfInstanceByContract(mpFirstInstance);
        expect(balance).to.be.equal(0);
        const title = await meltingPotesFactory.getTitleByContract(mpFirstInstance);
        expect(title).to.be.equal("first instance");
        const instanceOff = await meltingPotesFactory.getInstanceOffByContract(mpFirstInstance); 
        expect(instanceOff).to.be.equal(false);
      });
  
      it('should set the new instance in the mapping AllInstances', async () => {
        const { meltingPotesFactory, firstInstance, secondInstance } =
        await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const newInstanceDetails = await meltingPotesFactory.allInstances(firstInstance)
        expect(newInstanceDetails.title).to.be.equal("first instance");
      });
  
  
      it('should add the instance in the user interface', async () => {
        const { meltingPotesFactory, firstInstance, owner } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const userInstance = await meltingPotesFactory.getUserInstanceAddress(owner.address, 0);
         await expect(userInstance).to.be.equal(firstInstance);

      });     


    describe('GETTERS', () => {

      it('should return user instance address', async () => {
        const { meltingPotesFactory, owner, firstInstance } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const userInstance = await meltingPotesFactory.getUserInstanceAddress(owner.address, 0);
        
        expect(userInstance).to.be.equal(firstInstance);
      });

      it('should return balance of instance', async () => {
        const { meltingPotesFactory, mpFirstInstance } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const balance = await meltingPotesFactory.getBalanceOfInstanceByContract(mpFirstInstance);
        
        expect(balance).to.be.equal(0);
      });

      it('should return total balance of instance', async () => {
        const { meltingPotesFactory, mpFirstInstance } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const totalBalance = await meltingPotesFactory.getTotalBalanceOfInstanceByContract(mpFirstInstance);
        
        expect(totalBalance).to.be.equal(0);
      });

      it('should return title', async () => {
        const { meltingPotesFactory, mpFirstInstance } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const title = await meltingPotesFactory.getTitleByContract(mpFirstInstance);
        expect(title).to.be.equal("first instance");
      });

      it('should return the instance currant status', async () => {
        const { meltingPotesFactory, mpFirstInstance } = await loadFixture(deployMeltingPotesFactory_withNewInstances);
        const instanceOff = await meltingPotesFactory.getInstanceOffByContract(mpFirstInstance); 
        expect(instanceOff).to.be.equal(false);
      });

    });
  
  });
});

  describe('MeltingPotes contract', function() {
    async function deployMeltingPotes() {
      //deploy the Contract MeltingPotes with right infos.
      const MeltingPotes = await ethers.getContractFactory('MeltingPotes');
      const [owner, part1, part2, part3, authAddr4, authAddr5, addr6] =
      await ethers.getSigners();

      const meltingPotes = await MeltingPotes.deploy(owner.address,"Good try", 5000000000, 1703074776, "Lary");

      return { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    async function deployMeltingPotes_withParticipants() {
      //get the ContractFactory and Signers here.
      const { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 } =
      await deployMeltingPotes();

      await meltingPotes.addParticipant(part1, "Marilou", true);
      await meltingPotes.addParticipant(part2, "Matthieu", true);
      await meltingPotes.addParticipant(part3, "Lary", false);

      return { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    async function deployMeltingPotes_withParticipantsAndAuthorizedAddress() {
      //get the ContractFactory and Signers here.
      const { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6} =
      await deployMeltingPotes_withParticipants();

      await meltingPotes.addAuthorizedAddress(authAddr4, "Booking.com");
      await meltingPotes.addAuthorizedAddress(authAddr5, "Fnac");

      return { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    async function deployMeltingPotes_withMoneyDeposited() {
      //get the ContractFactory and Signers here.
      const { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6} =
      await deployMeltingPotes_withParticipantsAndAuthorizedAddress();

      await meltingPotes.depositMoney({ value: parseEther("2.3") });
      await meltingPotes.connect(part1).depositMoney({ value: parseEther("1") });
      await meltingPotes.connect(part2).depositMoney({ value: parseEther("0.7") });

      return { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }

    async function deployMeltingPotes_withDateOfExpire() {
      //get the ContractFactory and Signers here.
      const { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6} =
      await deployMeltingPotes_withMoneyDeposited();
      await helpers.time.increaseTo(await time.latest() + 2629743);

      return { MeltingPotes, meltingPotes, owner, part1, part2, part3, authAddr4, authAddr5, addr6 };
    }


  ////////////////////////////////////////////////////////////

  describe('Deployment', function () {

    it('Should revert because date of expire is invalid', async () => {
      const MeltingPotes = await ethers.getContractFactory('MeltingPotes');
      const [owner] =
      await ethers.getSigners();

    await expect(MeltingPotes.deploy(owner.address,"Good try", 5000000000, 173074776, "Lary"))
        .to.be.revertedWith("date of expire cannot be in the past");
    });

    it('Should set the right owner', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, owner } = await deployMeltingPotes();
    
      const admin = await meltingPotes.participantAddress(0);
      expect(admin).to.equal(owner.address);
    });
    

    it('Should deploy with right parameters', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes } = await deployMeltingPotes();
      expect(await meltingPotes.title()).to.be.equal("Good try");
      expect(await meltingPotes.dateOfExpire()).to.be.equal(1703074776);
      expect(await meltingPotes.minimumDeposit()).to.be.equal(5000000000);
    });

    it('Should deploy with owner as first participant', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, owner } = await deployMeltingPotes("Good try", halfEther, 1941298148, "Lary");
      // Check if the owner is added as the first participant
      const ownerParticipant = await meltingPotes.participants(owner.address);
      expect(ownerParticipant.userAddress).to.equal(owner.address);
      expect(ownerParticipant.name).to.equal("Administrator : Lary");
      expect(ownerParticipant.moneyDeposited).to.equal(0); 
      expect(ownerParticipant.authorizedToSpend).to.equal(false); 
    });

  });
    

    describe('INSIDE INSTANCE - add a participant', () => {
      it('should revert if not called by the administrator', async () => {
        const halfEther = parseEther("0.5");
        const { meltingPotes, owner, part1, addr6 } = await deployMeltingPotes("Good try", halfEther, 1941298148, "Lary");
        await expect(meltingPotes.connect(addr6).addParticipant(part1, "Marilou", true)).to.be.reverted;
      });

      it('should not be able to be called if instance is inactive', async () => {
        const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await meltingPotes.endInstanceBeforeDateOfExpire();
        await expect(meltingPotes.addParticipant(addr6, "Raphael", true)).to.be.revertedWith("The instance has ended");
      });
    
    it('should revert if invalid address', async () => {
        const halfEther = parseEther("0.5");
        const { meltingPotes, owner, part1 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");
        const invalidAddress = '0x0000000000000000000000000000000000000000';
        await expect(meltingPotes.addParticipant(invalidAddress, "Marilou", true)).to.be.revertedWith("invalid address");
    });
    

    it('should revert if the same address is added twice twice', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, owner, part1 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");
      await meltingPotes.addParticipant(part1, "Marilou", true);
      await expect(meltingPotes.addParticipant(part1, "Marilou", false)).to.be.revertedWith("this address is already registered");
    });
  
    it('should create a new participant and add it to participants', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, owner, part1 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");
      await meltingPotes.addParticipant(part1, "Marilou", true);
      const newParticipant = await meltingPotes.participants(part1.address);
      expect(newParticipant.userAddress).to.equal(part1.address);
      expect(newParticipant.name).to.equal("Marilou");
      expect(newParticipant.moneyDeposited).to.equal(0); 
      expect(newParticipant.authorizedToSpend).to.equal(true); 
    });

    it('should add the new participant to participantAddress array', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, part1 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");
      await meltingPotes.addParticipant(part1, "Marilou", true);
      const newParticipant = await meltingPotes.participantAddress(1);
      expect(newParticipant).to.be.equal(part1.address);
    });

    it('should emit participantAdded event', async () => {
      const halfEther = parseEther("0.5");
      const { meltingPotes, part1, authAddr4 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");

      await expect(meltingPotes.addParticipant(part1, "Marilou", true))
        .to.emit(meltingPotes, 'participantAdded')
        .withArgs(part1.address, "Marilou", true);
    });

  });

    describe('INSIDE INSTANCE - add new authorized address', () => {
      it('should revert if not called by the administrator', async () => {
        const { meltingPotes, addr6, authAddr4 } = await loadFixture(deployMeltingPotes_withParticipants);
        await expect(meltingPotes.connect(addr6).addAuthorizedAddress(authAddr4, "Leonie")).to.be.reverted;
      });
  
      it('should revert if not a valid address', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withParticipants);
        const invalidAddress = '0x0000000000000000000000000000000000000000';
        await expect(meltingPotes.addAuthorizedAddress(invalidAddress, "Ikea")).to.be.revertedWith("invalid address");
      });
  
      it('should not be able to be called if instance is inactive', async () => {
        const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await meltingPotes.endInstanceBeforeDateOfExpire();
        await expect(meltingPotes.addAuthorizedAddress(authAddr4, "Ikea")).to.be.revertedWith("The instance has ended");
  
      });
  
      it('should revert if address is already registered', async () => {
        const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withParticipants);
        await meltingPotes.addAuthorizedAddress(authAddr4, "Ikea");
        await expect(meltingPotes.addAuthorizedAddress(authAddr4, "Ikea")).to.be.revertedWith("this address is already registered");
      });
  
      it('should add a new address to the allowedArray', async () => {
        const halfEther = parseEther("0.5");
        const { meltingPotes, authAddr4 } = await deployMeltingPotes("Good try", halfEther, 1704370148, "Lary");
        await meltingPotes.addAuthorizedAddress(authAddr4, "Ikea");
        const newAddress = await meltingPotes.allowedArray(0);
        expect(newAddress).to.be.equal(authAddr4.address);
      });
      
  
      it('should add a new address to the allowed mapping', async () => {
        const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withParticipants);
        await meltingPotes.addAuthorizedAddress(authAddr4, "Ikea");
        
        // Access the allowed mapping directly using authAddr4
        const newAuthAddress = await meltingPotes.allowed(authAddr4.address);
    
        expect(newAuthAddress.name).to.equal("Ikea");
        expect(newAuthAddress.addressToSpend).to.equal(authAddr4.address); 
        expect(newAuthAddress.isRegistered).to.equal(true); 
      });

      it('should emit addressAuthorized event', async () => {
        const { meltingPotes, part1, authAddr4 } = await loadFixture(deployMeltingPotes_withParticipants);
        console.log(authAddr4.address);
        await expect(meltingPotes.addAuthorizedAddress(authAddr4.address, "ikea"))
          .to.emit(meltingPotes, 'addressAuthorized')
          .withArgs(authAddr4.address, "ikea");
      });

    });

    describe('INSIDE INSTANCE - Spend Money', () => {
      it('should revert if amount to send is superior to balance instance', async () => {
       const { meltingPotes, part1, addr6 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await expect(meltingPotes.connect(part1).spendMoney(parseEther("5"), addr6.address, "cadeau")).to.be
          .revertedWith("Not enough funds");
      });
  
      it('should revert if caller is not a participant authorized to spend', async () => {
        const { meltingPotes, part3, addr6 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await expect(meltingPotes.connect(part3).spendMoney(parseEther("0.1"), addr6.address, "cadeau")).to.be
          .revertedWith("You have not been authorized to spend");
      });
  
      it('should revert if not a receiver address', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        const invalidAddress = '0x0000000000000000000000000000000000000000';
        await expect(meltingPotes.connect(part1).spendMoney(parseEther("0.1"), invalidAddress, "cadeau" )).to.be.revertedWith("invalid address");
      });
  
      it('should not be able to be called if instance is inactive', async () => {
        const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await meltingPotes.endInstanceBeforeDateOfExpire();
        await expect(meltingPotes.spendMoney(parseEther("0.1"), authAddr4.address, "cadeau")).to.be.revertedWith("The instance has ended");
      });
  
      it('should send to any address if authorizedAddress is empty with right amount', async () => {
        const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withParticipants);
        await meltingPotes.depositMoney({ value: parseEther("2.3") });
        await expect(meltingPotes.spendMoney(parseEther("0.1"), addr6.address, "cadeau"));
      });
  
      it('should not send to any address if authorizedAddress is not empty', async () => {
        const { meltingPotes, addr6, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await expect(meltingPotes.connect(part1).spendMoney(parseEther("0.1"), addr6.address, "cadeau")).to.be
        .revertedWith("this address is not authorized to receive funds");
      });
  
      it('should be able to send to authorized address with right amount', async () => {
        const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withParticipantsAndAuthorizedAddress);
        await expect(meltingPotes.spendMoney(parseEther("0.1"), authAddr4.address, "cadeau"));
      });
  
      it('should update the balance of instance', async () => {
        const { meltingPotes, authAddr4, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        
        // Spend money
        await meltingPotes.connect(part1).spendMoney(parseEther("0.1"), authAddr4.address, "cadeau");
      
        // Check the updated balance
        const updatedBalance = await meltingPotes.getBalanceOfInstance();
        await expect(updatedBalance).to.be.equal(parseEther("3.9"));
      });

      it('should emit EtherSpended event', async () => {
        const { meltingPotes, part1, authAddr4 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
  
        await expect(meltingPotes.connect(part1).spendMoney(parseEther("0.1"), authAddr4.address, "cadeau"))
          .to.emit(meltingPotes, 'EtherSpended')
          .withArgs(await time.latest() + 1, parseEther("0.1"), part1.address, authAddr4.address, "cadeau");
      });
  
    });

    describe('INSIDE INSTANCE - Deposit Money', () => {
      it('should revert if amount to send is inferior to the minimum required', async () => {
         const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withParticipantsAndAuthorizedAddress);
         await expect(meltingPotes.connect(part1).depositMoney({ value: 500 })).to.be
          .revertedWith("Not enough funds deposited");
      });
  
      it('should revert if sender is not a participant', async () => {
        const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withParticipantsAndAuthorizedAddress);
        await expect(meltingPotes.connect(addr6).depositMoney({ value: 50000 })).to.be
         .revertedWith("You are not in this instance");
      });
  
      it('should not be able to be called if instance is inactive', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await meltingPotes.endInstanceBeforeDateOfExpire();
        await expect(meltingPotes.depositMoney({ value: parseEther("1") })).to.be.revertedWith("The instance has ended");
      });
  
      it('should increase the balance of the instance', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        
        // Spend money
        await meltingPotes.depositMoney({ value: parseEther("1") });
      
        // Check the updated balance
        const updatedBalance = await meltingPotes.getBalanceOfInstance();
        await expect(updatedBalance).to.be.equal(parseEther("5"));
      });
  
      it('should increase the totalAmountSended of the instance', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        
        // Spend money
        await meltingPotes.depositMoney({ value: parseEther("1") });
      
        // Check the updated balance
        const updatedTotalBalance = await meltingPotes.getTotalBalanceOfInstance();
        await expect(updatedTotalBalance).to.be.equal(parseEther("5"));
      });
  
      it('should increase the moneyDeposited of the participant', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      
        // Deposit money
        await meltingPotes.connect(part1).depositMoney({ value: parseEther("1") });
      
        // Get the updated moneyDeposited
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
      
        // Assert the updated balance
        await expect(updatedMoneyDeposited).to.equal(parseEther("2"));
      });

      it('should emit EtherDeposited event', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
  
        await expect(meltingPotes.connect(part1).depositMoney({ value: parseEther("1") }))
          .to.emit(meltingPotes, 'EtherDeposited')
          .withArgs(part1.address, parseEther("1"));
      });
    
    });

    describe('Ending instance - percentage', () => {
      it('should calculate the right percentage for a participant', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
        const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
        const percentage = await meltingPotes.calculatePercentage(updatedMoneyDeposited, totalBalance);
        await expect(percentage).to.be.equal(2500);

      });
  
      it('should revert if totalBalance = 0', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withParticipants);
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
        const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
        await expect(meltingPotes.calculatePercentage(updatedMoneyDeposited, totalBalance)).to.be.revertedWith("There is no money to send back");
      });
  
      it('should return 0 if no funds in the userBalance', async () => {
        const { meltingPotes, part3 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part3.address);
        const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
        const percentage = await meltingPotes.calculatePercentage(updatedMoneyDeposited, totalBalance);
        await expect(percentage).to.be.equal(0);
      });
  
    });
  
  
    describe('Ending instance - amountToSend', () => {
      it('should calculate the right amount to send', async () => {
        const { meltingPotes, part1, authAddr4 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);

        await meltingPotes.connect(part1).spendMoney(parseEther("1"), authAddr4.address, "cadeau");

        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
        const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
        const balance = await meltingPotes.getBalanceOfInstance();
        const percentage = await meltingPotes.calculatePercentage(updatedMoneyDeposited, totalBalance);

        const amountToSend = await meltingPotes.calculateAmountToSend(balance, percentage);

        await expect(amountToSend).to.be.equal(parseEther("0.75"));
      });
  
      it('should revert if Balance = 0', async () => {
        const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withParticipants);
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
        const balance = await meltingPotes.getBalanceOfInstance();
        await expect(meltingPotes.calculateAmountToSend(balance, updatedMoneyDeposited)).to.be.revertedWith("There is no money to send back");
      });
  
      it('should return 0 if the percentage is 0%', async () => {
        const { meltingPotes, part3, authAddr4, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);

        await meltingPotes.connect(part1).spendMoney(parseEther("1"), authAddr4.address, "cadeau");
        const updatedMoneyDeposited = await meltingPotes.getMoneyDeposited(part3.address);
        const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
        const balance = await meltingPotes.getBalanceOfInstance();
        const percentage = await meltingPotes.calculatePercentage(updatedMoneyDeposited, totalBalance);
        const amountToSend = await meltingPotes.calculateAmountToSend(balance, percentage);

        await expect(amountToSend).to.be.equal(0);
      });
    });

    describe('Ending instance - sendBackFunds', () => {
      it('should revert if the balance is 0', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withParticipants);
        await expect(meltingPotes.sendBackFunds()).to.be.revertedWith("there is no money to send back");
      });
  
      it('should send back the right amount for each participant', async () => {
        const { meltingPotes, part1, part2 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);

        const initialBalancePart1 = await ethers.provider.getBalance(part1.address);
        const initialBalancePart2 = await ethers.provider.getBalance(part2.address);
        await meltingPotes.endInstanceBeforeDateOfExpire();
      
        const finalBalancePart1 = await ethers.provider.getBalance(part1.address);
        const finalBalancePart2 = await ethers.provider.getBalance(part2.address);

        const part1BalanceDiff = await finalBalancePart1 - initialBalancePart1;
        const part2BalanceDiff = await finalBalancePart2 - initialBalancePart2;

        await expect(part1BalanceDiff).to.be.equal(parseEther("1"));
        await expect(part2BalanceDiff).to.be.equal(parseEther("0.7"));
      });
  
      it('should set back the balance to 0', async () => {
        const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
        await meltingPotes.endInstanceBeforeDateOfExpire();
        const balance = await meltingPotes.getBalanceOfInstance();
        await expect(balance).to.equal(0);
      });
  
      it('should emit moneySendedBack event for each participant', async () => {
        const { meltingPotes, part1, part2 } = await loadFixture(deployMeltingPotes_withParticipants);
        await meltingPotes.connect(part1).depositMoney({ value: parseEther("1") });

        // Check for part1
        await expect(meltingPotes.endInstanceBeforeDateOfExpire())
          .to.emit(meltingPotes, 'moneySendedBack')
          .withArgs(await time.latest() + 1, part1.address, parseEther("1"));
      
      });
      
  });

  describe('Ending instance - before dateOfExpire', () => {
    it('should revert if not called by the administrator', async () => {
      const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      await expect(meltingPotes.connect(part1).endInstanceBeforeDateOfExpire()).to.be.reverted;
    });
    it('should make the instance expire', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      await meltingPotes.endInstanceBeforeDateOfExpire();
      const status = await meltingPotes.instanceOff();
      await expect(status).to.be.equal(true);

    });

    it('should send back the funds', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      await meltingPotes.endInstanceBeforeDateOfExpire();
      const balance = await meltingPotes.getBalanceOfInstance();
      await expect(balance).to.equal(0);
    });

    it('should emit instanceEnded event', async () => {
      const { meltingPotes, part1, part2 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);

      await expect(meltingPotes.endInstanceBeforeDateOfExpire())
        .to.emit(meltingPotes, 'instanceEnded')
        .withArgs(await time.latest() +2);
    });

  });

  describe('Ending instance - after date of expire', () => {
    it('should revert if date of expire is not reached yet', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      await expect(meltingPotes.endInstanceAfterDateOfExpire()).to.be.revertedWith("the instance is still active");
    });

    it('should revert if not called by a participant', async () => {
      const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.connect(addr6).endInstanceAfterDateOfExpire()).to.be.revertedWith("You are not in this instance");
    });

    it('should send back the funds', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await meltingPotes.endInstanceAfterDateOfExpire();
      const balance = await meltingPotes.getBalanceOfInstance();
      await expect(balance).to.equal(0);
    });

    it('should revert if the instance is inactive', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await meltingPotes.endInstanceAfterDateOfExpire();
      await expect(meltingPotes.endInstanceAfterDateOfExpire()).to.be.revertedWith("Instance already ended");
    });

    it('should make the instance expire', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await meltingPotes.endInstanceAfterDateOfExpire();
      const status = await meltingPotes.instanceOff();
      await expect(status).to.be.equal(true);
    });

    it('should emit instanceEnded event', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);

      await expect(meltingPotes.endInstanceAfterDateOfExpire())
        .to.emit(meltingPotes, 'instanceEnded')
        .withArgs(await time.latest() + 1);
    });

  });

  describe('getters', () => {
    it('should get the balance of the instance', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      const balance = await meltingPotes.getBalanceOfInstance(); 
      await expect(balance).to.equal(parseEther("4"));
    });

    it('should get the total amount sended of the instance', async () => {
      const { meltingPotes, authAddr4, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      await meltingPotes.connect(part1).spendMoney(parseEther("1"), authAddr4.address, "cadeau");
      const totalBalance = await meltingPotes.getTotalBalanceOfInstance();
      await expect(totalBalance).to.equal(parseEther("4"));
    });

    it('should return a participant', async () => {
      const { meltingPotes, part1} = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      const participant1 = await meltingPotes.getParticipant(part1.address);
      await expect(participant1).to.equal(part1.address);
    });

    it('should return the moneyDeposited of a participant', async () => {
      const { meltingPotes, part1 } = await loadFixture(deployMeltingPotes_withMoneyDeposited);
      const moneyDeposited = await meltingPotes.getMoneyDeposited(part1.address);
      await expect(moneyDeposited).to.equal(parseEther("1"));
    });

  });

  describe('Date of expire', () => {
    it('should revert addParticipant', async () => {
      const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.addParticipant(addr6, "Mariloou", true)).to.be.revertedWith("The instance has ended");
    });

    it('should revert addAuthorizedAddress', async () => {
      const { meltingPotes, addr6 } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.addAuthorizedAddress(addr6.address, "leroy")).to.be.revertedWith("The instance has ended");
    });

    it('should revert spendMoney', async () => {
      const { meltingPotes, authAddr4 } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.spendMoney(parseEther("0.1"), authAddr4.address, "cadeau")).to.be.revertedWith("The instance has ended");

    });

    it('should revert depositMoney', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.depositMoney({ value: parseEther("2.3") })).to.be.revertedWith("The instance has ended");
    });

    it('should revert endInstanceBeforeDateOfExpire', async () => {
      const { meltingPotes } = await loadFixture(deployMeltingPotes_withDateOfExpire);
      await expect(meltingPotes.endInstanceBeforeDateOfExpire()).to.be.revertedWith("The instance has ended");
    });

  });

  });
