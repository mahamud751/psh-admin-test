import { useState } from "react";
import { useQuery } from "react-query";

const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const { isLoading, refetch } = useQuery([bookings], () =>
    fetch(`https://psh-server-test.onrender.com/api/order`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data?.orders);
      })
  );
  setTimeout(() => {
    refetch();
  }, 5000);
  return [bookings, refetch];
};

export default useBooking;
