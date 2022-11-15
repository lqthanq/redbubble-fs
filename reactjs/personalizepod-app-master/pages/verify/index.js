import React, { useEffect, useState } from "react";
import RegisterLayout from "../../layouts/register";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import AccountModal from "components/Utilities/AccountModal";
import { VERIFY_USER } from "graphql/mutate/user/userAction";

const verify = () => {
  const router = useRouter();
  const [type, setType] = useState(null);
  const [verifyUser] = useMutation(VERIFY_USER);
  useEffect(() => {
    if (router.query.token) {
      verifyUser({
        variables: {
          oneTimeToken: router.query.token,
        },
      })
        .then((res) => {
          setType("success");
        })
        .catch((err) => {
          setType("error");
        });
    }
  }, []);
  return <div>{type && <AccountModal type={type} />}</div>;
};
verify.Layout = RegisterLayout;
export default verify;
