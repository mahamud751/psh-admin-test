import { useEffect, useState } from "react";

const usePromo = () => {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    fetch(`https://psh-server-test.onrender.com/api/promo`)
      .then((res) => res.json())
      .then((data) => setPromos(data));
  }, []);
  return [promos];
};
export default usePromo;
