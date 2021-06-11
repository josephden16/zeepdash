import loadingImg from "../../assets/img/loading-3.svg";

const ScreenLoader = () => {
  return (
    <div style={{position: 'fixed', backgroundColor: 'white', height: '100%', width: '100%', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div>
        <img src={loadingImg} draggable={false} width="85" style={{margin: 'auto'}} alt="loading" />
      </div>
    </div>
  )
}


export default ScreenLoader;
