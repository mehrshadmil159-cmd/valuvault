// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ValuVault - KOL Round Valuation Comparison
/// @notice Privacy-preserving FDV comparison platform for KOL funding rounds
/// @dev Users submit encrypted FDV values and compare against benchmark (100M) using FHE
contract ValuVault is ZamaEthereumConfig {
    // Benchmark FDV value: 100M (stored as encrypted uint32)
    euint32 private benchmarkFDV;
    
    // User submissions: encrypted FDV values
    mapping(address => euint32) private userFDVs;
    
    // Comparison results: 1 if above benchmark, 0 if below
    mapping(address => euint32) private comparisonResults;
    
    // Tracking submission status
    mapping(address => bool) public hasSubmitted;
    
    // Events
    event FDVSubmitted(address indexed user, uint256 timestamp);
    event ComparisonCompleted(address indexed user);
    
    /// @notice Initialize contract with benchmark FDV of 100M
    constructor() {
        // Set benchmark to 100 (representing 100M)
        benchmarkFDV = FHE.asEuint32(uint32(100));
        FHE.allowThis(benchmarkFDV);
    }
    
    /// @notice Submit encrypted FDV value and perform comparison
    /// @param encryptedFDV The encrypted FDV value (in millions)
    /// @param proof Zero-knowledge proof for the encrypted input
    /// @dev Compares user FDV against benchmark and stores result
    function submitFDV(
        externalEuint32 encryptedFDV,
        bytes calldata proof
    ) external {
        // Convert external encrypted input to internal representation
        euint32 userFDV = FHE.fromExternal(encryptedFDV, proof);
        
        // Store user's encrypted FDV
        userFDVs[msg.sender] = userFDV;
        
        // Perform FHE comparison: is user FDV > benchmark?
        ebool isAboveBenchmark = FHE.gt(userFDV, benchmarkFDV);
        
        // Convert boolean result to uint32: 1 if above, 0 if below
        euint32 resultValue = FHE.select(
            isAboveBenchmark,
            FHE.asEuint32(uint32(1)),
            FHE.asEuint32(uint32(0))
        );
        
        // Store comparison result
        comparisonResults[msg.sender] = resultValue;
        hasSubmitted[msg.sender] = true;
        
        // Grant permissions: contract needs to access data
        FHE.allowThis(userFDV);
        FHE.allowThis(resultValue);
        
        // Grant permissions: user needs to decrypt results
        FHE.allow(userFDV, msg.sender);
        FHE.allow(resultValue, msg.sender);
        
        emit FDVSubmitted(msg.sender, block.timestamp);
        emit ComparisonCompleted(msg.sender);
    }
    
    /// @notice Get encrypted comparison result
    /// @return bytes32 handle for the encrypted result
    /// @dev Returns 1 if above benchmark, 0 if below (encrypted)
    function getComparisonResult() external view returns (bytes32) {
        require(hasSubmitted[msg.sender], "No submission found");
        return FHE.toBytes32(comparisonResults[msg.sender]);
    }
    
    /// @notice Get user's encrypted FDV value
    /// @return bytes32 handle for the encrypted FDV
    function getMyFDV() external view returns (bytes32) {
        require(hasSubmitted[msg.sender], "No submission found");
        return FHE.toBytes32(userFDVs[msg.sender]);
    }
    
    /// @notice Get benchmark FDV value (encrypted)
    /// @return bytes32 handle for the encrypted benchmark
    /// @dev Benchmark is 100M but returned as encrypted value
    function getBenchmark() external view returns (bytes32) {
        return FHE.toBytes32(benchmarkFDV);
    }
}

