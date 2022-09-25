import React from 'react'
import { useMetamask } from '@thirdweb-dev/react'

function Login() {
    const connect = useMetamask();

  return (
    <div className='bg-gradient-to-b from-[#5068fc] to-[#011570] min-h-screen flex flex-col text-center items-center justify-center'>
        <div className='flex flex-col items-center mb-10'>
            <img className='h-56 w-56 my-10' src={"../sapphire.png"} alt='' />
            <h1 className='md:text-6xl sm:text-5xl text-4xl text-white font-bold'>SAPPHIRE DRAW</h1>
            <h2 className='md:text-md text-sm text-white'>Your Crypto Lottery on the <span className='underline'>Polygon Network</span></h2>

            <button onClick={connect} className='bg-gradient-to-br from-[#5068fc] to-[#011570] text-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Connect with Metamask</button>
            <a href='https://myterablock.medium.com/how-to-create-or-import-a-metamask-wallet-a551fc2f5a6b' target='_blank' className='text-white mt-10 underline'>How to create a Metamask Wallet?</a>

            {/* Reasons for Sapphire */}
            <div className='flex flex-col border-t border-gray-500 mx-5 items-center text-white justify-between p-5 mt-10 w-full'>
              <h4 className='text-white text-lg sm:text-xl md:text-2xl  items-center mb-5 underline'>Reasons for Sapphire</h4>
              <p className='text-white text-md italic mb-2 font-thin'>Lowest Service Fees (5%)</p>
              <p className='text-white text-md italic mb-2 font-thin'>Very Low Gas Fees (Polygon Mainnet)</p>
              <p className='text-white text-md italic font-thin'>Beautiful and Clean UI</p>
            </div>
        </div>
    </div>
  )
}

export default Login