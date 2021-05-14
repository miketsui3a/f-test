pragma solidity 0.6.12;

import "./IMyContract.sol";
import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
// import "./IPriceOracle.sol";

contract MyContract is IMyContract{

  ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(address(0x88757f2f99175387aB4C6a4b3067c77A695b0349)); // mainnet address, for other addresses: https://docs.aave.com/developers/deployed-contracts/deployed-contract-instances 
  ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
  // IPriceOracleGetter priceOracle = IPriceOracleGetter(0xB8bE51E6563BB312Cbb2aa26e352516c25c26ac1);

  function deposit(address _erc20Contract, uint256 _amountexternal) override external returns (bool success){
    lendingPool.deposit(_erc20Contract, _amountexternal, msg.sender, 0);
    return true;
  }

  function withdraw(address _erc20Contract,uint256 _amount) external override returns (uint256 amountWithdrawn){
    return lendingPool.withdraw(_erc20Contract, _amount, msg.sender);
  }

  function checkCollateralValueInEth()external override view returns(uint256 amountInEth){
    uint256 totalCollateralETH;
    uint256 totalDebtETH;
    uint256 availableBorrowsETH;
    uint256 currentLiquidationThreshold;
    uint256 ltv;
    uint256 healthFacto;
    (totalCollateralETH, totalDebtETH,availableBorrowsETH,currentLiquidationThreshold,ltv,healthFacto) = lendingPool.getUserAccountData(msg.sender);

    return totalCollateralETH;

  }

  function getLendingPool()external view returns (address){
    return provider.getLendingPool();
  }

  function getReserveNormalizedIncome(address asset) external view returns (uint256){
    return lendingPool.getReserveNormalizedIncome(asset);
  }


}