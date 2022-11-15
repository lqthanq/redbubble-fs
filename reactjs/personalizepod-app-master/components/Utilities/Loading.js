import { LoadingOutlined } from "@ant-design/icons";

const Loading = () => {
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: 300,
      }}
    >
      <div>
        <LoadingOutlined
          style={{ fontSize: 30, color: "var(--primary-color)" }}
        />
        <h4>Loading...</h4>
      </div>
    </div>
  );
};

export default Loading;
