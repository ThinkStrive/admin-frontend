import { FaEdit } from "react-icons/fa";

const UserCard = ({userData , setUpdateUserModel , setSingleUserData}) => {

    const { userName , userEmail , mobileNumber ,subscriptionType , subscriptionDate}  = userData;
    
    
  return (
    <div className={`p-5 my-2 grid gap-5 grid-cols-[0.8fr,1.8fr,1.2fr,0.8fr,0.7fr,0.2fr] shadow-md cursor-pointer w-full rounded-md text-base ${ subscriptionType === 'none' ? 'bg-gray-100' : 'bg-slate-300'}`}>
        <p className="font-medium text-center">{userName}</p>
        <p className="font-medium">{userEmail}</p>
        <p className="font-medium">{mobileNumber}</p>
        <p className="font-medium">{subscriptionDate}</p>
        <p className="font-medium">{subscriptionType}</p>
        <button onClick={()=>{ setUpdateUserModel(true) ; setSingleUserData(userData)}}><FaEdit className="size-6 text-red-600" /></button>
    </div>
  )
}

export default UserCard;