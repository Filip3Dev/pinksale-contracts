// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact support@financebit.co
contract Standard721 is ERC721, IERC2981, ERC721Enumerable, ERC721URIStorage, Pausable, AccessControl, ERC721Burnable, Initializable {
    using Counters for Counters.Counter;
    address private royaltiesRecipient;
    uint8 internal royaltiesPercentage = 5;
    
    string private _name;
    string private _symbol;
    string private _base_uri;
    string private _default_url;
    uint256 public MAX_SUPPLY;
    uint256 public NFT_PRICE = 1000000000000000;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping (uint256 => bool) private REVELETED;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("", "") {}
    function initialize(address owner_, string memory name_, string memory symbol_) external initializer {
        _name = name_;
        _symbol = symbol_;
        _base_uri = "";
        MAX_SUPPLY = 10;
        NFT_PRICE = 1000000000000000;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _grantRole(DEFAULT_ADMIN_ROLE, owner_);
        _grantRole(PAUSER_ROLE, owner_);
        _grantRole(MINTER_ROLE, owner_);
    }

    function name() public override view virtual returns (string memory) {
        return _name;
    }

    function symbol() public override view virtual returns (string memory) {
        return _symbol;
    }

    function _baseURI() internal view override returns (string memory) {
        return _base_uri;
    }

    function setURI(string memory newuri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _base_uri = newuri;
    }

    function isRevelated(uint256 tokenId) public view returns (bool) {
        return REVELETED[tokenId];
    }

    function setDefaultUrl(string memory url_) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool){
        _default_url = url_;
        return true;
    }

    function setNftPrice(uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool){
        require(price > 0, "Price must be greater than 0");
        NFT_PRICE = price;
        return true;
    }

    function setMaxSupply(uint256 supply) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bool){
        require(supply > 0, "Supply must be greater than 0");
        MAX_SUPPLY = supply;
        return true;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        REVELETED[tokenId] = true;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, "");
    }

    function buyToken() public payable returns (bool) {
        require(msg.value >= NFT_PRICE, "Insufficient funds for purchase");
        uint256 tokenId = _tokenIdCounter.current();
        require(MAX_SUPPLY > tokenId + 1, "This value exceeds maximum supply!");
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, "");
        REVELETED[tokenId] = true;
        _tokenIdCounter.increment();
        return true;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if(REVELETED[tokenId]) {
            return string(
                abi.encodePacked(_baseURI(), '/', Strings.toString(tokenId), ".json")
            );
        } else {
            return string(_default_url);
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, IERC165, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId));
    }
}