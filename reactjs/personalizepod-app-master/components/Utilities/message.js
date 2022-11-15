import { notification } from "antd";

export const messageSave = (string) => {
  if (string) {
    notification.success({ message: `The ${string} Saved Successfully!` });
  }
};

export const messagePush = (string) => {
  if (string) {
    notification.success({ message: `The ${string} Pushed Successfully!` });
  }
};

export const messageDelete = (string) => {
  if (string) {
    notification.success({ message: `The ${string} Deleted Successfully!` });
  }
};
export const messageDuplicate = (string) => {
  if (string) {
    notification.success({ message: `The ${string} Duplicated Successfully!` });
  }
};
export const messageRetry = (string) => {
  if (string) {
    notification.success({ message: `The ${string} Retried Successfully!` });
  }
};
export const messageIncorrect = (string) => {
  if (string) {
    return (
      <div style={{ color: "var(--error-color)" }}>
        Incorrect {`${string}`}. Please double-check and try again.
      </div>
    );
  }
};
export const messageDisconnected = (string) => {
  if (string) {
    notification.success({
      message: `The ${string} Disconnected Successfully!`,
    });
  }
};
export const messageReconnected = (string) => {
  if (string) {
    notification.success({
      message: `The ${string} Reconnected Successfully!`,
    });
  }
};
export const messageChange = (string) => {
  if (string) {
    notification.success({
      message: `The ${string} Changed Successfully!`,
    });
  }
};
export const messagePassNotMatch = (string) => {
  if (string) {
    notification.error({
      message: `${string} does not match.`,
    });
  }
};
export const messageDuplicateEmail = (string) => {
  if (string) {
    notification.error({
      message: `An account with this ${string} already exists.`,
    });
  }
};
