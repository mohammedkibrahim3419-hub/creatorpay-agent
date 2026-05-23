// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICreatorRegistry {
    function isRegistered(address wallet) external view returns (bool);
    function updateEarnings(address creator, uint256 amount) external;
}

contract PaymentTrigger {
    ICreatorRegistry public registry;
    address public owner;
    uint256 public payoutPerEngagement;

    event PayoutSent(address indexed creator, uint256 amount, uint256 engagements);
    event PoolFunded(address indexed funder, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _registry, uint256 _payoutPerEngagement) {
        owner = msg.sender;
        registry = ICreatorRegistry(_registry);
        payoutPerEngagement = _payoutPerEngagement;
    }

    receive() external payable {
        emit PoolFunded(msg.sender, msg.value);
    }

    function triggerPayout(address creator, uint256 engagements) external onlyOwner {
        require(registry.isRegistered(creator), "Creator not registered");
        require(engagements > 0, "No engagements");

        uint256 amount = engagements * payoutPerEngagement;
        require(address(this).balance >= amount, "Insufficient pool balance");

        (bool sent, ) = payable(creator).call{value: amount}("");
        require(sent, "Payout failed");
        registry.updateEarnings(creator, amount);

        emit PayoutSent(creator, amount, engagements);
    }

    function updatePayoutRate(uint256 _newRate) external onlyOwner {
        payoutPerEngagement = _newRate;
    }

    function getPoolBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawPool(uint256 amount) external onlyOwner {
        (bool sent, ) = payable(owner).call{value: amount}("");
        require(sent, "Withdrawal failed");
    }
}
