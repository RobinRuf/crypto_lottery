import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import { useContract, useMetamask, useDisconnect, useAddress, useContractData, useContractCall } from '@thirdweb-dev/react'
import Login from '../components/Login'

const Home: NextPage = () => {
  const address = useAddress();

  if (!address) return <Login />
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
    </div>
  )
}

export default Home
