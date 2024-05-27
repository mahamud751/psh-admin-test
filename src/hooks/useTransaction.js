import { useState } from "react";
import { useQuery } from "react-query";

const useTransaction = () => {
  const [transactions, setTransaction] = useState([]);
  const { isLoading, refetch } = useQuery([transactions], () =>
    fetch(`https://psh-server-test.onrender.com/api/transaction`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTransaction(data?.transaction);
      })
  );
  return [transactions, refetch];
};

export default useTransaction;
