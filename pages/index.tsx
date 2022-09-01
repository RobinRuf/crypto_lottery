import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { useContract, useMetamask, useDisconnect, useAddress, useContractData, useContractCall } from '@thirdweb-dev/react'
import Login from '../components/Login'
import Loading from '../components/Loading'

const Home: NextPage = () => {
  const address = useAddress();
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);

  // First Loader and then check if already login to prevent page from flicking...
  if (isLoading) return <Loading />
  if (!address) return <Login />

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Draw Box */}
      <div>
        <div className='stats-container'>
          <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
          <div className='flex justify-between p-2 space-x-2'>
            <div className='stats'>
              <h2 className='text-sm'>Total Pool</h2>
              <p className='text-xl'>0.1 MATIC</p>
            </div>
            <div className='stats'>
              <h2 className='text-sm'>Tickets Remaining</h2>
              <p className='text-xl'>100</p>
            </div>
          </div>

          {/** Countdown Timer */}
          
        </div>
      </div>

      {/** Buy Tickets Box */}
      <div>

      </div>
    </div>
  )
}

export default Home
