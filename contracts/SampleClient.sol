// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SampleClient {

    string value;

    function updateTokenPrice(address oracle, string calldata url, string calldata responseKey) public {
        return IOracleGateway(oracle).get(url, responseKey);
    }

    function retrieve() public view returns (string memory) {
        return value;
    }

    function onCallbackHTTPGet(string calldata response) public {
       value = response;
    }
}

interface IOracleGateway {
    function get(string calldata url, string calldata responseKey) external;
}