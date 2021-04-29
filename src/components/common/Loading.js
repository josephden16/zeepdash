import React from 'react'


const Loading = (props) => {
  return (
    <div className="mx-auto mt-4 mb-2" style={{width: '200px'}}>
      <img className="text-center" style={{width: '40px', 'marginLeft': '75px'}} src="/img/loading.svg" alt="loading" />
      <p style={{fontSize: '16px'}} className="text-center text-black">{props.text}</p>
    </div>
  )
}

export default Loading;
