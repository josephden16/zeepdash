import React from 'react'


const Loading = (props) => {
  return (
    <div className="mx-auto mt-5 mb-5" style={{width: '200px'}}>
      <img className="text-center" style={{width: '70px', 'marginLeft': '60px'}} src="/img/loading-3.svg" alt="loading" />
      <p style={{fontSize: '16px'}} className="text-center text-black">{props.text}</p>
    </div>
  )
}

export default Loading;
