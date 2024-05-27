import { useEffect, useState } from "react";
import axios from "axios";

const UseFetch = (path) => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data2, setData2] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(false);
  const [data3, setData3] = useState([]);
  const [loading3, setLoading3] = useState(false);
  const [error3, setError3] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
        setRoom(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
      setRoom(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    const fetchData2 = async () => {
      setLoading2(true);
      try {
        const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
        setData2(res.data);
      } catch (err) {
        setError2(err);
      }
      setLoading2(false);
    };
    fetchData2();
  }, []);

  const reFetch2 = async () => {
    setLoading2(true);
    try {
      const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
      setData2(res.data);
    } catch (err) {
      setError2(err);
    }
    setLoading2(false);
  };
  useEffect(() => {
    const fetchData3 = async () => {
      setLoading3(true);
      try {
        const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
        setData3(res.data);
      } catch (err) {
        setError3(err);
      }
      setLoading3(false);
    };
    fetchData3();
  }, []);

  const reFetch3 = async () => {
    setLoading3(true);
    try {
      const res = await axios.get(`https://api.psh.com.bd/api/${path}`);
      setData3(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };
  return {
    room,
    loading,
    error,
    reFetch,
    data2,
    loading2,
    error2,
    reFetch2,
    data3,
    loading3,
    error3,
    reFetch3,
  };
};

export default UseFetch;
