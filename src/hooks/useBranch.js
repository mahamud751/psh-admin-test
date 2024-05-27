import { useState } from "react";
import { useQuery } from "react-query";

const useBranch = () => {
  const [allBranch, setAllBranch] = useState([]);
  const { isLoading, refetch } = useQuery([allBranch], () =>
    fetch(`https://api.psh.com.bd/api/branch`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAllBranch(data);
      })
  );

  setTimeout(() => {
    refetch();
  }, 5000);
  return [allBranch, refetch];
};

export default useBranch;
