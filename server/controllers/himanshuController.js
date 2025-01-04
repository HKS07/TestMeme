const { ethers } = require('ethers');
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");

// ABI for the basic public functions of USDT contract
const TETHER_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)"
];

// Tether contract address on Ethereum mainnet
const TETHER_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const InfurKey = 'f9ef20d4613a41298875930909c5d475'
// Initialize provider with Infura
const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${InfurKey}`
);

// Initialize contract instance
const contract = new ethers.Contract(
    TETHER_ADDRESS,
    TETHER_ABI,
    provider
);

exports.getPublicSmartContractInfo = asyncErrorHandler(async (req, res) => {
    try {
        // Fetch multiple contract details in parallel
        const [
            name,
            symbol,
            decimals,
            totalSupply,
            timestamp
        ] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals(),
            contract.totalSupply(),
            provider.getBlock('latest').then(block => block.timestamp)
        ]);

        // Convert total supply to readable format
        const formattedTotalSupply = ethers.utils.formatUnits(
            totalSupply,
            decimals
        );

        // Create response object
        const contractInfo = {
            name,
            symbol,
            decimals: decimals.toString(),
            totalSupply: formattedTotalSupply,
            contractAddress: TETHER_ADDRESS,
            lastUpdated: new Date(timestamp * 1000).toISOString(),
            network: 'mainnet'
        };

        // Send success response
        return res.status(200).json({
            success: true,
            data: contractInfo,
            message: 'Contract information retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching contract info:', error);
        
        // Send error response
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to fetch contract information'
        });
    }
});