pragma solidity 0.6.12;

import "./IMyContract.sol";
import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./IProtocolDataProvider.sol";
import "./IERC20.sol";


contract MyContract is IMyContract {
    ILendingPoolAddressesProvider provider;
    ILendingPool lendingPool;
    IProtocolDataProvider protovalDataProvider;
    
    function initialize(address lendingPoolAddressesProviderAddress,address protocolDataProviderAddress) public{
      provider = ILendingPoolAddressesProvider(lendingPoolAddressesProviderAddress);
      lendingPool = ILendingPool(provider.getLendingPool());
      protovalDataProvider = IProtocolDataProvider(protocolDataProviderAddress);
    }


    function deposit(address _erc20Contract, uint256 _amountexternal)
        external
        override
        returns (bool success)
    {
        address lpAddr = provider.getLendingPool();
        IERC20 erc20 = IERC20(_erc20Contract);
        bool isSuccess = erc20.approve(lpAddr, _amountexternal);
        require(isSuccess == true, "cannot approve");

        bool transferSuccess =
            erc20.transferFrom(msg.sender, address(this), _amountexternal);
        require(transferSuccess == true, "transfer failed");

        ILendingPool(lpAddr).deposit(
            _erc20Contract,
            _amountexternal,
            msg.sender,
            0
        );

        return true;
    }

    function withdraw(address _erc20Contract, uint256 _amount)
        external
        override
        returns (uint256 amountWithdrawn)
    {   
        address aTokenAddress;
        address stableDebtTokenAddress;
        address variableDebtTokenAddress;

        (aTokenAddress,stableDebtTokenAddress,variableDebtTokenAddress)=protovalDataProvider.getReserveTokensAddresses(_erc20Contract);
        IERC20 aToken = IERC20(aTokenAddress);

        bool transferSuccess = aToken.transferFrom(msg.sender, address(this), _amount);
        require(transferSuccess == true, "transfer failed");

        return lendingPool.withdraw(_erc20Contract, _amount, msg.sender);
    }

    function checkCollateralValueInEth()
        external
        view
        override
        returns (uint256 amountInEth)
    {
        uint256 totalCollateralETH;
        uint256 totalDebtETH;
        uint256 availableBorrowsETH;
        uint256 currentLiquidationThreshold;
        uint256 ltv;
        uint256 healthFacto;
        (
            totalCollateralETH,
            totalDebtETH,
            availableBorrowsETH,
            currentLiquidationThreshold,
            ltv,
            healthFacto
        ) = lendingPool.getUserAccountData(msg.sender);

        return totalCollateralETH;
    }

    function getLendingPool() external view returns (address) {
        return provider.getLendingPool();
    }

    function getReserveNormalizedIncome(address asset)
        external
        view
        returns (uint256)
    {
        return lendingPool.getReserveNormalizedIncome(asset);
    }
}
