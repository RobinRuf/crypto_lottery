import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { useContract, useMetamask, useDisconnect, useAddress, useContractData, useContractCall } from '@thirdweb-dev/react'
import Login from '../components/Login'
import Loading from '../components/Loading'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { currency } from '../constants'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

const Home: NextPage = () => {
  const [tutorial, setTutorial] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
  const { data: expiration } = useContractData(contract, 'expiration');
  const { data: ticketPrice } = useContractData(contract, 'ticketPrice');
  const { data: ticketCommission } = useContractData(contract, 'ticketCommission');
  
  // Get all sold tickets
  const { data: tickets } = useContractData(contract, "getTickets");

  // get remaining Tickets from Contract
  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );

  // get current Jackpot (Winning Reward) from Contract
  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );

  // get all Tickets of the User
  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const amountOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0);

    setUserTickets(amountOfUserTickets);
  }, [tickets, address])

  // Buy Tickets
  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");

  // get Winnings for Winner
  const { data: winnings } = useContractData(contract, "getWinningsForAddress", address);

  // withdraw winnings
  const { mutateAsync: WithdrawWinnings } = useContractCall(contract, "WithdrawWinnings");

  // get last winner
  const { data: lastWinner } = useContractData(contract, "lastWinner");
  // get last winnings
  const { data: lastWinnerAmount } = useContractData(contract, "lastWinnerAmount");

  // check, if User is Admin
  const { data: isLotteryOperator } = useContractData(contract, "lotteryOperator");

  const handleClick = async () => {
    if (expiration?.toString() < Date.now().toString()) return;
    if (!ticketPrice) return;

    const notification = toast.loading('Buying your tickets...');

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
          ),
        },
      ]);

      toast.success('Tickets purchased successfully', {
        id: notification,
      });
    } catch(err) {
      toast.error('Oops, something went wrong', {
        id: notification,
      });

      console.error('contract all failure', err);
    }
  }

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");

    try {
      await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully!", {
        id: notification,
      })
    } catch(err) {
      toast.error("Oops, something went wrong! Try again.", {
        id: notification,
      })
      console.error("contract call failure", err);
    }
  }

  // First show Loader and then check if already login to prevent page from flicking...
  if (isLoading) return <Loading />
  if (!address) return <Login />

  return (
    <div className="bg-gradient-to-b from-[#5068fc] to-[#011570] min-h-screen flex flex-col">
      <Head>
        <title>Sapphire Draw</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className='flex-1'>
      <Header />
      <Marquee className='bg-[#011570]/10 p-5 mb-5' gradient={false} speed={100}>
        <div className='flex space-x-2 mx-10'>
          <h4 className='text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
          <h4 className='text-white font-bold'>Previous winnings: {" "} {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
        </div>
      </Marquee>

      {/* Admin Panel */}
      {isLotteryOperator === address && (
        <div className='flex justify-center'>
          <AdminControls />
        </div>
      )}

      {/* Winner Button */}
      {winnings > 0 && (
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithdrawWinnings} className='p-5 mx-4 bg-gradient-to-br from-[#5068fc]/50 to-[#011570]/50 border border-[#011570]/60 shadow-lg animate-pulse text-center rounded-xl w-full'>
            <p className='text-xl font-extrabold text-yellow-200'>Winner Winner Chicken Dinner!</p>
            <p className='text-white'>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}{currency}</p>
            <br />
            <p className='font-semibold text-white'>Click Here to Withdraw</p>
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className='flex flex-row items-center justify-center mt-4'>
        <InformationCircleIcon className='h-6 w-6 text-white' />
        <p onClick={(e) => setTutorial(!tutorial)} className='text-white pl-2 underline cursor-pointer'>How to get Matic in Metamask?</p>
      </div>

      { tutorial && (
        <div className='flex justify-center items-center my-2'>
          <div className='flex flex-col'>
            <div className='ml-auto mb-2'>
              <XMarkIcon onClick={(e) => setTutorial(false)} className='h-6 w-6 text-white cursor-pointer' />
            </div>
            <iframe loading='lazy' className='rounded-lg shadow-lg sm:w-[500px] sm:h-[300px] md:w-[744px] md:h-[504px]' src="https://www.veed.io/embed/3c2a865f-1d0a-460f-8afd-548c3dd5ffea" 
              title="Sapphire Draw - How to get Matic in Metamask" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}

      {/* Draw Box */}
      <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
        <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
          <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
              <h2 className='text-sm'>Total Pool</h2>
              <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{" "}{currency}</p>
            </div>
            <div className='stats'>
              <h2 className='text-sm'>Tickets Remaining</h2>
              <p className='text-xl'>{remainingTickets?.toNumber()}</p>
            </div>
          </div>

          {/** Countdown Timer */}
          <div className='mt-5 mb-3'>
            <CountdownTimer />
          </div>
        </div>

        {/** Buy Tickets Box */}
      <div>
        <div className='stats-container space-z-2'>
          <div className='stats-container'>
            <div className='flex justify-between items-center text-white pb-2'>
              <h2>Price per ticket</h2>
              <p>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}{" "}{currency}</p>
            </div>

            <div className='flex text-white items-center space-x-2 bg-[#011570]/50 border-[#011570]/60 border p-4'>
              <p>TICKETS</p>
              <input className='flex w-full bg-transparent text-right outline-none' type='number' min={1} max={10} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>

            <div className='space-y-2 mt-5'>
              <div className='flex items-center justify-between text-[#5068fc] text-sm italic font-extrabold'>
                <p>Total cost of tickets</p>
                <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" "}{currency}</p>
              </div>

              <div className='flex items-center justify-between text-[#5068fc] text-xs italic'>
                <p>Service fees</p>
                <p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString())}{" "}{currency}</p>
              </div>

              <div className='flex items-center justify-between text-[#5068fc] text-xs italic'>
                <p>+ Network Fees</p>
                <p>TBC</p>
              </div>
            </div>
            <button 
              onClick={handleClick} 
              disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0} 
              className='mt-5 w-full bg-gradient-to-br from-[#5068fc] to-[#011570] px-10 
              py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 
              disabled:text-gray-100 disabled:cursor-not-allowed font-semibold'>
                Buy {quantity} Tickets for{" "} {ticketPrice && 
                Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity} {" "} {currency}
            </button>
          </div>
          {userTickets > 0 && (
            <div className='stats mt-4'>
              <p className='text-lg mb-2'>You have {userTickets} Tickets in this draw</p>
              <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                {Array(userTickets).fill("").map((_, index) => (
                  <p key={index} 
                    className='text-[#5068fc] h-20 w-12 bg-[#011570]/50 border-[#011570]/60 border-2 rounded-lg 
                    flex flex-shrink-0 items-center justify-center text-xs italic'
                  >
                    {index + 1}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Footer / Disclaimer */}
    <div className='border-t border-gray-500 mx-5 flex items-center text-white justify-between p-5'>
      <p className='text-xs text-gray-500 pl-5'>
        DISCLAIMER: Gambling is only allowed from the age of 18! With every 
        transaction on this platform, the user confirms to be of legal age. 
        Gambling can be addictive. If you suffer from gambling addiction, 
        please contact a local counseling center. This platform does not assume any liability. 
        A refund is not possible but if the draw was canceled by the platform.
      </p>
    </div>
    </div>
  </div>
  )
}

export default Home
