import { useState, useEffect } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import {
  ADD_NEW_WEBINAR_USER,
  GET_SESSION_ID_PAYMENT,
  NEW_PAYMENT_USER,
} from "../../api/ApiDetails";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useToast } from "./Toast";

function CashFree({ passingUserDataForPayment }) {
  const navigate = useNavigate();
  const showToast = useToast();
  let cashfree;

  useEffect(() => {
    async function initializeSDK() {
      cashfree = await load({
        mode: "production",
      });
    }
    initializeSDK();
  }, []);

  const getSessionId = async () => {
    try {
      let res = await axios.post(GET_SESSION_ID_PAYMENT, {
        amount: passingUserDataForPayment.amount,
        currency: "INR",
        name: passingUserDataForPayment.name,
        customer_details: {
          customer_id: passingUserDataForPayment.webinar_id,
          customer_phone: String(passingUserDataForPayment.user_number),
          customer_name: passingUserDataForPayment.user_name,
          customer_email: passingUserDataForPayment.user_email,
        },
      });
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        return {
          sessionId: res.data.payment_session_id,
          orderId: res.data.order_id,
        };
      } else {
        showToast(res.data.error, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    try {
      let obj = await getSessionId();

      console.log('obj', obj)
      let sessionId = obj.sessionId;
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then(async (res) => {
        console.log('response from casgfree', res)
        if(res.paymentDetails.paymentMessage){
          axios
          .post(NEW_PAYMENT_USER, {
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm:ss"),
            payment_for: "Webinar",
            amount: passingUserDataForPayment.amount,
            currency: "INR",
            payment_session_id : sessionId,
            gateway_name: "CashFree",
            customer_details: {
              name: passingUserDataForPayment.user_name,
              number: passingUserDataForPayment.user_number,
              mail: passingUserDataForPayment.user_email,
            },
          })
          .then(async (response) => {
            console.log({...passingUserDataForPayment, payment_session_id : sessionId})
            await axios
              .post(ADD_NEW_WEBINAR_USER, {...passingUserDataForPayment, payment_session_id : sessionId})
              .then((res) => {
                if (res.data.status) {
                  showToast('Registered Successfully, Please check your Mail', 'success')
                }
              });
          })
          .catch((e) => {
            console.log(e);
          });
        }else{
          showToast('Payment failed, try again', "error")
        }

        
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  return <></>;
}

export default CashFree;
