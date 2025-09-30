// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";



contract Wagr is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token = IERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e); // Hardcoded Base USDC
    uint8 public feePercent = 1; // 1% fee


    enum Status { Pending, Countered, Resolved, Cancelled }
    enum Outcome { None, CreatorWins, CounterWins, Draw }
    enum ResolutionType { None, Conceded, OwnerResolved }

    struct Wager {
        address creator;
        address counter;
        address allowedCounter; // address(0) for public
        
        uint256 creatorStake;
        uint256 counterStake;
        uint256 createdAt;

        string description;
        

        Status status;
        Outcome outcome;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 public nextId;

    event WagerCreated(uint256 indexed id, address creator, uint256 stake, string description, address allowedCounter);
    event WagerCountered(uint256 indexed id, address counter, uint256 stake);
    event WagerResolved(uint256 indexed id, Outcome outcome, address winnerOrZero, ResolutionType resolutionType);
    event WagerCancelled(uint256 indexed id, address creator, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {} // No token arg; hardcoded above

    function createWager(string memory _description, uint256 _stake, address _allowedCounter) external nonReentrant {
        require(_stake > 0, "Stake must be > 0");
        token.safeTransferFrom(msg.sender, address(this), _stake);
        uint256 id = nextId++;
        wagers[id] = Wager({
            creator: msg.sender,
            counter: address(0),
            allowedCounter: _allowedCounter,
            creatorStake: _stake,
            counterStake: 0,
            
            createdAt: block.timestamp,
            description: _description,
            status: Status.Pending,
            outcome: Outcome.None
        });
        emit WagerCreated(id, msg.sender, _stake, _description, _allowedCounter);
    }

    function counterWager(uint256 _wagerId) external nonReentrant {
        Wager storage wager = wagers[_wagerId];
        require(wager.status == Status.Pending, "Not pending");
        require(wager.counter == address(0), "Already countered");

        if (wager.allowedCounter != address(0)) {
            require(msg.sender == wager.allowedCounter, "Not allowed to counter");
        }
        require(msg.sender != wager.creator, "Creator can't be the counter");

        token.safeTransferFrom(msg.sender, address(this), wager.creatorStake);
        wager.counter = msg.sender;
        wager.counterStake = wager.creatorStake;
        wager.status = Status.Countered;
        emit WagerCountered(_wagerId, msg.sender, wager.creatorStake);
    }

    function concedeWager(uint256 _wagerId) external nonReentrant {
        Wager storage wager = wagers[_wagerId];
        require(wager.status == Status.Countered, "Not countered");
        require(msg.sender == wager.creator || msg.sender == wager.counter, "Not participant");
        address winner = (msg.sender == wager.creator) ? wager.counter : wager.creator;
        wager.outcome = (msg.sender == wager.creator) ? Outcome.CounterWins : Outcome.CreatorWins;
        wager.status = Status.Resolved;
        uint256 totalPot = wager.creatorStake + wager.counterStake;
        uint256 fee = (totalPot * feePercent) / 100;
        uint256 payout = totalPot - fee;
        token.safeTransfer(winner, payout);
        token.safeTransfer(owner(), fee);
        emit WagerResolved(_wagerId, wager.outcome, winner, ResolutionType.Conceded);
    }

    function resolveWager(uint256 _wagerId, Outcome _outcome) external onlyOwner nonReentrant {
        require(_outcome != Outcome.None, "Invalid outcome");
        Wager storage wager = wagers[_wagerId];
        require(wager.status == Status.Countered, "Not countered");
        wager.outcome = _outcome;
        wager.status = Status.Resolved;
        uint256 feePerStake = (wager.creatorStake * feePercent) / 100;
        address winner = address(0);
        if (_outcome == Outcome.CreatorWins) {
            winner = wager.creator;
            uint256 payout = (wager.creatorStake + wager.counterStake) - (feePerStake * 2);
            token.safeTransfer(wager.creator, payout);
            token.safeTransfer(owner(), feePerStake * 2);
        } else if (_outcome == Outcome.CounterWins) {
            winner = wager.counter;
            uint256 payout = (wager.creatorStake + wager.counterStake) - (feePerStake * 2);
            token.safeTransfer(wager.counter, payout);
            token.safeTransfer(owner(), feePerStake * 2);
        } else if (_outcome == Outcome.Draw) {
            uint256 creatorRefund = wager.creatorStake - feePerStake;
            uint256 counterRefund = wager.counterStake - feePerStake;
            token.safeTransfer(wager.creator, creatorRefund);
            token.safeTransfer(wager.counter, counterRefund);
            token.safeTransfer(owner(), feePerStake * 2);
        }
        emit WagerResolved(_wagerId, _outcome, winner, ResolutionType.OwnerResolved);
    }

    function cancelWager(uint256 _wagerId) external nonReentrant {
        Wager storage wager = wagers[_wagerId];
        require(wager.status == Status.Pending, "Not pending");
        require(wager.counter == address(0), "Already countered");
        require(msg.sender == wager.creator, "Only creator can cancel");
        wager.status = Status.Cancelled;
        
        token.safeTransfer(wager.creator, wager.creatorStake);
        
        emit WagerCancelled(_wagerId, wager.creator, wager.creatorStake);
    }

    // function refund(uint256 _wagerId) external nonReentrant {
    //     Wager storage wager = wagers[_wagerId];
    //     require(wager.status == Status.Pending, "Not pending");
    //     require(wager.counter == address(0), "Already countered");
    //     require(msg.sender == wager.creator, "Only creator can refund");
    //     wager.status = Status.Refunded;
    //     token.safeTransfer(wager.creator, wager.creatorStake);
    //     emit Refunded(_wagerId, wager.creator, wager.creatorStake);
    // }

    function updateFeePercent(uint8 _newFee) external onlyOwner {
        require(_newFee <= 5, "Fee too high");
        feePercent = _newFee;
    }

    function rescueTokens(IERC20 t, address to, uint256 amt) external onlyOwner {
        require(address(t) != address(token), "Use dedicated flow for wager token");
        t.safeTransfer(to, amt);
    }

    function rescueEth(address payable to, uint256 amt) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(address(this).balance >= amt, "Insufficient balance");
        (bool sent, ) = to.call{value: amt}("");
        require(sent, "ETH transfer failed");
    }

}