import React , { useState } from 'react';
import EmailComposer from '../Reuse/email/EmailComposer';
import axios from 'axios';
import "../../Styles/Email.css";
import { ADMIN_EMAIL_SEND } from '../../api/ApiDetails';
import { closeSnackbar, useSnackbar } from "notistack";

const Email = () => {

  const [ status , setStatus ] = useState('all');
  const { enqueueSnackbar } = useSnackbar();


  const handleSendEmail = async({subject,body})=>{

    const keyToast = enqueueSnackbar('Sending emails...',{
      variant:'info',
      persist:true,
      action:(
        <div className='flex items-center'>
          <div className='spinner'></div>
        </div>
      )
    }) 

      try {
        const response = await axios.post(ADMIN_EMAIL_SEND,{
          status,
          subject,
          body
        });
        closeSnackbar(keyToast);
        enqueueSnackbar(response.data.message,{variant:'success'});
        
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message;
        closeSnackbar(keyToast);
        enqueueSnackbar(`Error:${errorMessage}`,{variant:'error'});
      }
  }
 

  return (
    <div>
        <h2 className='text-center text-lg my-4 font-medium text-gray-700'>Compose & Send Email</h2>
        <div className='flex justify-end my-2'>
        <label htmlFor="sendToSelect" className='inline-flex items-center mr-2 text-lg'>Send To :</label>
        <select id='sendToSelect' className='px-2 py-1 rounded-md bg-orange-700 text-white cursor-pointer outline-none' onChange={e=>setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
        </div>
        <EmailComposer onSend={handleSendEmail} status={status}/>
    </div>
  )
}

export default Email;