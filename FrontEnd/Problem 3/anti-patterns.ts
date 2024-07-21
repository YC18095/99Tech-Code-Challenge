
interface WalletBalance {
    currency: string;
    amount: number;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }

  //turn a getPriority function to Priority Enum object for easy to read and use
  const Priority: {[key: string]: number} = {
    "Osmosis": 100,
    "Ethereum": 50,
    "Arbitrum":30,
    "Zilliqa":20,
    "Neo":20,
    "Min": -99
    };

  interface Props extends BoxProps {}

  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();
  

    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = Priority[balance.currency];
            
            return balancePriority > Priority["Min"] && balance.amount <=0 ? true : false
          
          }).sort((leftWalletBalance: WalletBalance, rightWalletBalance: WalletBalance) => {
            
            return Priority[leftWalletBalance.currency] > Priority[rightWalletBalance.currency] ? 1 : -1;
      });
    }, [balances, prices]);
  
    const formattedBalances = useMemo(() => {
      return sortedBalances.map((balances: FormattedWalletBalance) => {
        return {
          ...balances,
          formatted: balances.amount.toFixed(2)
        }
      })
    },[sortedBalances]);
  
    const rows = useMemo(() => {
      return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return
          <WalletRow 
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
      })
    },[formattedBalances]);
  
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }