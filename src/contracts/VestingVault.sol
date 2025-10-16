// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VestingVaultUpgradeable is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    IERC20Upgradeable public token;
    address public HAYQ;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 released;
        uint64 start;
        uint64 duration;
    }

    mapping(address => VestingSchedule) public vestings;

    event VestingCreated(address indexed beneficiary, uint256 amount, uint64 start, uint64 duration);
    event TokensReleased(address indexed beneficiary, uint256 amount);

    function initialize(IERC20Upgradeable _token) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        require(address(_token) != address(0), "Invalid token");
        token = _token;
    }

    modifier onlyHAYQ() {
        require(msg.sender == HAYQ, "Not authorized");
        _;
    }

    function setHAYQ(address _hayq) external onlyOwner {
        require(_hayq != address(0), "Invalid address");
        HAYQ = _hayq;
    }

    // Vesting creation triggered by HAYQ.sol
    function createVesting(address beneficiary, uint256 amount, uint64 start, uint64 duration) external onlyHAYQ {
        require(vestings[beneficiary].totalAmount == 0, "Already vested");
        require(duration > 0, "Duration must be > 0");

        vestings[beneficiary] = VestingSchedule(amount, 0, start, duration);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        emit VestingCreated(beneficiary, amount, start, duration);
    }

    function release() external nonReentrant {
        VestingSchedule storage vesting = vestings[msg.sender];
        require(vesting.totalAmount > 0, "No vesting");

        uint256 vested = _vestedAmount(vesting);
        uint256 unreleased = vested - vesting.released;
        require(unreleased > 0, "Nothing to release");

        vesting.released += unreleased;
        require(token.transfer(msg.sender, unreleased), "Token transfer failed");

        emit TokensReleased(msg.sender, unreleased);
    }

    function _vestedAmount(VestingSchedule memory vesting) internal view returns (uint256) {
        if (block.timestamp < vesting.start) return 0;
        if (block.timestamp >= vesting.start + vesting.duration) return vesting.totalAmount;
        return (vesting.totalAmount * (block.timestamp - vesting.start)) / vesting.duration;
    }
}
