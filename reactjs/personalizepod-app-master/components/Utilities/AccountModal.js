import { Modal, Button } from "antd";
import {
  IoIosCheckmarkCircle,
  IoIosInformationCircleOutline,
} from "react-icons/io";
import { useRouter } from "next/router";
const AccountModal = ({ type }) => {
  const router = useRouter();
  return (
    <Modal
      visible={true}
      footer={false}
      closable={false}
      width={400}
      bodyStyle={{ padding: 0, textAlign: "center" }}
    >
      <div
        style={{
          height: 120,
          backgroundColor:
            type === "success" ? "var(--primary-color)" : "var(--error-color)",
          fontSize: 90,
          color: "#fff",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {type === "success" ? (
          <IoIosCheckmarkCircle />
        ) : (
          <IoIosInformationCircleOutline />
        )}
      </div>
      <div>
        <h2>{type === "success" ? "Awesome" : "Opps!"}</h2>
        <p style={{ fontSize: 20, textAlign: "center" }}>
          {type === "success"
            ? "Your account has been verified!"
            : "Something went wrong!"}
        </p>
        <Button
          type={type === "success" ? "primary" : "danger"}
          style={{ width: "60%", marginBottom: 24 }}
          onClick={() => router.push("/", "/")}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};
export default AccountModal;
