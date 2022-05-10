// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact support@financebit.co
contract Standard1155 is ERC1155, IERC2981, AccessControl, Pausable, ERC1155Supply, Initializable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    using SafeMath for uint256;
    address private royaltiesRecipient;
    uint8 internal royaltiesPercentage;

    string private _name;
    string private _symbol;
    uint256 public _MAX_SUPPLY;
    uint256 public _TOTAL_SUPPLY;
    uint256 public NFT_PRICE = 1000000000000000;

    modifier tokenOwnerOnly(uint256 tokenId) {
        require(this.balanceOf(msg.sender, tokenId) != 0, "You don't have any token");
        _;
    }

    constructor() ERC1155("") { }
    function initialize(address owner_, string memory name_, string memory symbol_, uint256 max_supply_) external initializer {
        _name = name_;
        _symbol = symbol_;
        _grantRole(DEFAULT_ADMIN_ROLE, owner_);
        _grantRole(URI_SETTER_ROLE, owner_);
        _grantRole(PAUSER_ROLE, owner_);
        _grantRole(MINTER_ROLE, owner_);
        _MAX_SUPPLY = max_supply_;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }
    
    function maxSupply() external view returns (uint256) {
        return _MAX_SUPPLY;
    }

    function setMaxSupply(uint256 supply) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool){
        require(supply > 0, "Supply must be greater than 0");
        _MAX_SUPPLY = supply;
        return true;
    }

    function setNftPrice(uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool){
        require(price > 0, "Price must be greater than 0");
        NFT_PRICE = price;
        return true;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function buyToken() public payable returns (bool) {
        require(msg.value >= NFT_PRICE, "Insufficient funds for purchase");
        require(_MAX_SUPPLY > _TOTAL_SUPPLY + 1, "This value exceeds maximum supply!");
        _mint(msg.sender, _TOTAL_SUPPLY, 1, "0x");
        _TOTAL_SUPPLY = _TOTAL_SUPPLY.add(1);
        return true;
    }

    function mint(address account) public onlyRole(MINTER_ROLE){
        require(_MAX_SUPPLY > _TOTAL_SUPPLY + 1, "This value exceeds maximum supply!");
        _mint(account, _TOTAL_SUPPLY, 1, "0x");
        _TOTAL_SUPPLY = _TOTAL_SUPPLY.add(1);
    }

    function mintBatch(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(_MAX_SUPPLY > _TOTAL_SUPPLY + amount, "This value exceeds maximum supply!");
        for(uint i = 0; i < amount; i++){
            _mint(to, _TOTAL_SUPPLY, 1, "0x");
            _TOTAL_SUPPLY = _TOTAL_SUPPLY.add(1);
        }
    }

    /** @dev EIP2981 royalties implementation. */

    // Maintain flexibility to modify royalties recipient (could also add basis points).
    function _setRoyalties(address _newRecipient) internal {
        require(_newRecipient != address(0), "Royalties: new recipient is the zero address");
        royaltiesRecipient = _newRecipient;
    }

    function setRoyalties(address _newRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setRoyalties(_newRecipient);
    }

    // EIP2981 standard royalties return.
    function royaltyInfo(uint256, uint256 _salePrice) external view override
        returns (address receiver, uint256 royaltyAmount)
    {
        //1 corresponds to 1%
        return (royaltiesRecipient, (_salePrice * royaltiesPercentage * 100) / 10000);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, IERC165, AccessControl)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId));
    }
}