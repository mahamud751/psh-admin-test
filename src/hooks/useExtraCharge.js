import { useState } from "react";
import { useQuery } from "react-query";

const useExtraCharge = () => {
  const [extraCharge, setExtraCharge] = useState([]);
  const { isLoading, refetch } = useQuery([], () =>
    fetch(`https://psh-server-test.onrender.com/api/extraCharge`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setExtraCharge(data);
      })
  );
  return [extraCharge, refetch];
};

export default useExtraCharge;
