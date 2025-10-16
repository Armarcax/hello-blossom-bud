// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// --- OpenZeppelin Upgradeable ---
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

// --- External Upgradeable Contracts ---
import "./HAYQMiniMVP.sol";

interface IRouter {
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract HAYQ is ERC20Upgradeable, ERC20SnapshotUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IRouter public router;
    HAYQMiniMVP public miniMVP;

    mapping(address => uint256) public staked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Buyback(uint256 tokens, uint256 minOut);

    function initialize(address _router, address _miniMVP) public initializer {
        __ERC20_init("HAYQ Token", "HAYQ");
        __ERC20Snapshot_init();
        __Ownable_init();
        __ReentrancyGuard_init();

        if (_router != address(0)) router = IRouter(_router);
        require(_miniMVP != address(0), "MiniMVP invalid");
        miniMVP = HAYQMiniMVP(_miniMVP);

        _mint(msg.sender, 1_000_000 * 1e18);
    }

    // --- Setters ---
    function setRouter(address _router) external onlyOwner {
        require(_router != address(0), "Invalid router");
        router = IRouter(_router);
    }

    function setMiniMVP(address _mini) external onlyOwner {
        require(_mini != address(0), "Invalid miniMVP");
        miniMVP = HAYQMiniMVP(_mini);
    }

    // --- Snapshot ---
    function snapshot() external onlyOwner {
        _snapshot();
    }

    // --- Staking ---
    function stake(uint256 amount) external nonReentrant {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        staked[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(staked[msg.sender] >= amount, "Not enough staked");
        staked[msg.sender] -= amount;
        _mint(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    // --- Buyback ---
    function buyback(
        uint256 tokenAmount,
        uint256 minOut
    ) external onlyOwner nonReentrant {
        require(address(router) != address(0), "Router not set");

        _approve(address(this), address(router), tokenAmount);

        // ✅ Ճիշտ հայտարարում
        address[] memory path = new address[](2);
        path[0] = address(this);        // HAYQ token
        path[1] = address(miniMVP);    // MiniMVP token

        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            minOut,
            path,
            address(this),
            block.timestamp + 300
        );

        emit Buyback(tokenAmount, minOut);
    }


    // --- MiniMVP helper ---
    function mintMiniTokens(address to, uint256 amount) external onlyOwner {
        miniMVP.mint(to, amount);
    }

    // --- Overrides ---
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20SnapshotUpgradeable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
