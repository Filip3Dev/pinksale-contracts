// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../../interfaces/IFactoryManager.sol";

contract TokenFactoryBase is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Address for address payable;

    address public factoryManager;
    address public implementationERC20;
    address public implementationERC721;
    address public implementationERC1155;
    address public feeTo;
    uint256 public flatFee;
    mapping(address => bool) private authorized;

    event TokenCreated(
        address indexed owner,
        address indexed token,
        uint8 tokenType
    );

    modifier enoughFee() {
        require(msg.value >= flatFee, "Flat fee");
        _;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Authorized: Account cannot authorized");
        _;
    }

    constructor(
        address factoryManager_,
        address implementationERC20_,
        address implementationERC1155_,
        address implementationERC721_
    ) {
        factoryManager = factoryManager_;
        implementationERC20 = implementationERC20_;
        implementationERC721 = implementationERC721_;
        implementationERC1155 = implementationERC1155_;
        feeTo = msg.sender;
        flatFee = 10_000_000 gwei;
    }

    function setImplementationERC20(
        address implementation_
    ) external onlyOwner {
        implementationERC20 = implementation_;
    }

    function setImplementationERC1155(
        address implementation_
    ) external onlyOwner {
        implementationERC1155 = implementation_;
    }

    function setImplementationERC721(
        address implementation_
    ) external onlyOwner {
        implementationERC721 = implementation_;
    }

    function setFeeTo(address feeReceivingAddress) external onlyOwner {
        feeTo = feeReceivingAddress;
    }

    function setFlatFee(uint256 fee) external onlyOwner {
        flatFee = fee;
    }

    /**
     * @dev Add address to authorized list
     */
    function addAuthorized(address _addr) external onlyOwner {
        authorized[_addr] = true;
    }

    /**
     * @dev Remove address from authorized list
     */
    function removeAuthorized(address _addr) external onlyOwner {
        authorized[_addr] = false;
    }

    /**
     * @dev Check if address is authorized
     */
    function isAuthorized(address _addr) external view returns (bool) {
      return authorized[_addr];
    }

    function assignTokenToOwner(
        address owner,
        address token,
        uint8 tokenType
    ) internal {
        IFactoryManager(factoryManager).assignTokensToOwner(
            owner,
            token,
            tokenType
        );
    }

    function refundExcessiveFee() internal {
        uint256 refund = msg.value.sub(flatFee);
        if (refund > 0) {
            payable(msg.sender).sendValue(refund);
        }
    }
}
