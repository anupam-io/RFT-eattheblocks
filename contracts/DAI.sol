// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.2 <0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract DAI is ERC20{
    constructor() ERC20('DAI Stablecoin', 'DAI'){
    }

    function mint(address to, uint amount) external {
        _mint(to, amount);
    }
}