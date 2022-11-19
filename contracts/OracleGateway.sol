// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract OracleGateway {

    event OracleInvokeHTTPGet(address callback, string url, string responseKey);

    function get(string calldata url, string calldata responseKey) public {
        emit OracleInvokeHTTPGet(msg.sender, url, responseKey);
    }
}