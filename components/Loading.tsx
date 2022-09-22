import React from 'react'
import PropagateLoader from 'react-spinners/PropagateLoader'

function Loading() {
  return (
    <div className='bg-gradient-to-b from-[#5068fc] to-[#011570] h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col sm:flex-row items-center mx-auto mb-10'>
        <img className='h-56 w-56 my-10 sm:mr-5' src={"../sapphire.png"} alt='' />
        <h1 className='text-lg text-white font-bold sm:ml-5'>Sapphire Draw</h1>
      </div>
      <PropagateLoader color='white' size={30} />
    </div>
  )
}

export default Loading