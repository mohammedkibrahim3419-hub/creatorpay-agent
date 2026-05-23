// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreatorRegistry {
    struct Creator {
        address wallet;
        string contentId;
        bool isRegistered;
        uint256 totalEarned;
    }

    mapping(address => Creator) public creators;
    address[] public creatorList;
    address public owner;
    address public triggerContract;

    event CreatorRegistered(address indexed wallet, string contentId);
    event CreatorRemoved(address indexed wallet);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || msg.sender == triggerContract, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setTriggerContract(address _trigger) external onlyOwner {
        triggerContract = _trigger;
    }

    function register(string calldata contentId) external {
        require(!creators[msg.sender].isRegistered, "Already registered");
        require(bytes(contentId).length > 0, "Content ID required");

        creators[msg.sender] = Creator({
            wallet: msg.sender,
            contentId: contentId,
            isRegistered: true,
            totalEarned: 0
        });

        creatorList.push(msg.sender);
        emit CreatorRegistered(msg.sender, contentId);
    }

    function removeCreator(address creator) external onlyOwner {
        require(creators[creator].isRegistered, "Not registered");
        creators[creator].isRegistered = false;
        emit CreatorRemoved(creator);
    }

    function updateEarnings(address creator, uint256 amount) external onlyAuthorized {
        require(creators[creator].isRegistered, "Not registered");
        creators[creator].totalEarned += amount;
    }

    function getCreator(address wallet) external view returns (Creator memory) {
        return creators[wallet];
    }

    function getCreatorCount() external view returns (uint256) {
        return creatorList.length;
    }

    function isRegistered(address wallet) external view returns (bool) {
        return creators[wallet].isRegistered;
    }
}
