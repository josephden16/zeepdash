import loadingImg from "../../assets/img/loading-3.svg";

const ScreenLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 999,
      }}
    >
      <div>
        <img src="/img/logo.jpg" alt="app-logo" draggable={false} />
      </div>
      <div>
        <img
          src={loadingImg}
          draggable={false}
          width="85"
          style={{ margin: "auto" }}
          alt="loading"
        />
      </div>
    </div>
  );
};

export default ScreenLoader;
