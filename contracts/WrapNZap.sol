// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "./interfaces/IWrappedETH.sol";

contract WrapNZap {
    address public zappee;
    IWrappedETH public wrapper;

    constructor(address _zappee, address _wrapper) payable {
        zappee = _zappee;
        wrapper = IWrappedETH(_wrapper);
    }

    receive() external payable {
        // wrap
        wrapper.deposit{value: msg.value}();

        // send to zappee
        require(wrapper.transfer(zappee, msg.value), "transfer failed");
    }
}
