// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiSigTimelock {
    uint256 public constant MIN_DELAY = 2 days;
    uint256 public requiredConfirmations;

    address[] public owners;
    mapping(address => bool) public isOwner;

    struct Transaction {
        address target;
        uint256 value;
        bytes data;
        uint256 eta;
        uint256 confirmations;
        bool executed;
    }

    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    event Submit(uint256 indexed txId, address indexed target, uint256 value, bytes data, uint256 eta);
    event Confirm(address indexed owner, uint256 indexed txId);
    event Execute(uint256 indexed txId);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length >= _required, "Invalid setup");
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Owner is zero address");
            require(!isOwner[owner], "Owner duplicate");
            isOwner[owner] = true;
        }
        owners = _owners;
        requiredConfirmations = _required;
    }

    function submit(address target, uint256 value, bytes memory data) external onlyOwner {
        uint256 eta = block.timestamp + MIN_DELAY;
        transactions.push(Transaction({
            target: target,
            value: value,
            data: data,
            eta: eta,
            confirmations: 0,
            executed: false
        }));
        emit Submit(transactions.length - 1, target, value, data, eta);
    }

    function confirm(uint256 txId) external onlyOwner {
        require(txId < transactions.length, "Tx does not exist");
        require(!confirmations[txId][msg.sender], "Already confirmed");
        confirmations[txId][msg.sender] = true;
        transactions[txId].confirmations += 1;
        emit Confirm(msg.sender, txId);
    }

    function execute(uint256 txId) external onlyOwner {
        require(txId < transactions.length, "Tx does not exist");
        Transaction storage txn = transactions[txId];
        require(block.timestamp >= txn.eta, "Timelock not passed");
        require(!txn.executed, "Already executed");
        require(txn.confirmations >= requiredConfirmations, "Not enough confirmations");

        (bool success, ) = txn.target.call{value: txn.value}(txn.data);
        require(success, "Execution failed");
        txn.executed = true;
        emit Execute(txId);
    }

    receive() external payable {}
}