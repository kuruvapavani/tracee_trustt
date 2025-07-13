// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductTraceability {
    struct TraceStep {
        string stepType;
        string description;
        string location;
        uint256 timestamp;
    }

    struct Product {
        string name;
        string description;
        address creator;
        bool exists;
        TraceStep[] steps;
    }

    mapping(string => Product) public products; // QR Code as key

    event ProductCreated(string qrCode, string name, address creator);
    event StepAdded(string qrCode, string stepType, string location);

    function createProduct(string memory qrCode, string memory name, string memory description) public {
        require(!products[qrCode].exists, "Product already exists");

        products[qrCode].name = name;
        products[qrCode].description = description;
        products[qrCode].creator = msg.sender;
        products[qrCode].exists = true;

        emit ProductCreated(qrCode, name, msg.sender);
    }

    function addStep(
        string memory qrCode,
        string memory stepType,
        string memory description,
        string memory location
    ) public {
        require(products[qrCode].exists, "Product does not exist");

        TraceStep memory step = TraceStep({
            stepType: stepType,
            description: description,
            location: location,
            timestamp: block.timestamp
        });

        products[qrCode].steps.push(step);

        emit StepAdded(qrCode, stepType, location);
    }

    function getSteps(string memory qrCode) public view returns (TraceStep[] memory) {
        return products[qrCode].steps;
    }
}
