import { useState } from "react";
import { useQuery } from "react-query";

const useSubscription = () => {
  const [subsCriptions, setSubscriptions] = useState([]);
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://api.psh.com.bd/api/subscription`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data?.subcription);
      })
  );
  return [subsCriptions, refetch];
};

export default useSubscription;
