import React from 'react'
import { useSelector } from 'react-redux'
// import { ToastContainer } from 'react-toastify'
import RouterPage from './components/RouterPage'
import PageLoader from './components/global/PageLoader'

const App = () => {
  const loading = useSelector((state)=>state?.loader?.loading)
  return (
    <>
    {loading && <PageLoader />}
    {/* <ToastContainer /> */}
    <RouterPage />
    </>
  )
}

export default App