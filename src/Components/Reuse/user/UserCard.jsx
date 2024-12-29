import { FaEdit } from "react-icons/fa";

const UserCard = ({userData , setUpdateUserModel , setSingleUserData}) => {

    const { userName , userEmail ,subscriptionType , subscriptionDate , projectSubscription : { baccarat : { subscriptionType: baccaratSubscriptionType , subscriptionDate:baccaratSubscriptionDate }} }  = userData;

    
  return (
    <div className={`p-5 my-2 grid gap-5 grid-cols-[1fr,1.5fr,0.7fr,0.8fr,0.7fr,0.8fr,0.2fr] shadow-md cursor-pointer w-full rounded-md text-base ${ (subscriptionType === 'none')  ? 'bg-gray-100' : 'bg-slate-300'}  ${ (baccaratSubscriptionType === 'none')  ? 'bg-gray-100' : 'bg-slate-300'}`}>
        <p className="font-medium">{userName}</p>
        <p className="font-medium">{userEmail}</p>
        <p className="font-medium">{ subscriptionType || 'none'}</p>
        <p className="font-medium">{ subscriptionDate || 'none'}</p>
        <p className="font-medium">{ baccaratSubscriptionType || 'none'}</p>
        <p className="font-medium">{ baccaratSubscriptionDate || 'none'}</p>
        <button onClick={()=>{ setUpdateUserModel(true) ; setSingleUserData(userData)}}><FaEdit className="size-6 text-red-600" /></button>
    </div>
  )
}

export default UserCard;