import React, { useEffect, useState } from "react";
import { GET_ALL_PAYMENTS } from "../../api/ApiDetails";
import axios from "axios";
import moment from "moment";

const Payments = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [searchInput, setSearchInput] = useState('')
  const [duplicateData, setDuplicateData] = useState([])
  const getAllPayments = async () => {
    await axios
      .get(GET_ALL_PAYMENTS)
      .then((res) => {
        console.log(res.data)
        setAllPayments(res.data);
        setDuplicateData(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllPayments();
  }, []);



  useEffect(() => {
    const searchFunction = () => {
      const lowerCaseInput = searchInput.toLowerCase();

      const filtered = duplicateData.filter((payment) => {
        return (
          payment.payment_id.toLowerCase().includes(lowerCaseInput) ||
          payment.customer_details.number.includes(lowerCaseInput) ||
          payment.customer_details.mail.includes(lowerCaseInput)
        );
      });

      setAllPayments(filtered);
    };

    searchFunction();
  }, [searchInput, duplicateData]);


  console.log('all payments', allPayments)
  return (
    <div className="w-full h-full py-4 px-6">
      <div className="flex justify-between">
        <div className="w-[30%] relative">
          <i className="fa-solid fa-magnifying-glass absolute top-3 left-4 text-slate-500"></i>
          <input
            type="text"
            className="shadow-md w-[100%] rounded-lg py-2.5 bg-white pl-12 search-input text-sm"
            placeholder="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between my-4">
        <h4 className="font-semibold text-lg">
          Total Payments - {allPayments.length}
        </h4>
      </div>

      {allPayments.length !== 0 ? (
        <div className="w-full mt-4 max-h-[95%] flex flex-wrap justify-start items-start">
          {allPayments.map((payment, index) => (
            <div
              key={index}
              className="shadow-md bg-white rounded-xl p-3 m-2"
            >
              <h2>{payment.amount}</h2>
              <h2 className="text-sm" >{payment.customer_details.mail}</h2>
              <h2 className="text-sm" >{payment.customer_details.number}</h2> 
              <p className="text-sm" >{moment(payment.date).format('YYYY-MM-DD')} {moment(payment.time, 'HH:mm:ss').format('hh:mm:ss A')}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-[80%] flex justify-center items-center">
          <p>No Data's available</p>
        </div>
      )}
    </div>
  );
};

export default Payments;
