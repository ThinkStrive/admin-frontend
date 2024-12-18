import axios from "axios";
import { EXCEL_DATA, GET_ALL_USER } from "../../api/ApiDetails";
import { useEffect, useState } from "react";
import Loading from "../Resources/Loading";
import { BsStars , BsGraphUpArrow } from "react-icons/bs";
import { IoRocketSharp } from "react-icons/io5";
import { IoMdSunny } from "react-icons/io";
import { FaUserShield , FaMoon , FaCoins} from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { dailySubcriptionPrice , weeklySubscriptionPrice , monthlySubscriptionPrice } from "../../utils/constants";
import UserDoughnutChart from "../Charts/UserDoughnutChart";
import UserBarChart from "../Charts/UserBarChart";
import { filterUsersByDate } from "../../utils/helpers";
import { utils , writeFile } from "xlsx";
import { useSnackbar } from "notistack";
import { FiDownload } from "react-icons/fi";

const Dashboard = () => {
  const [allUserData, setAllUserData] = useState([]);
  const [loading, setLoading] = useState(false);
            // users Count based on Subscription Date
  const [ userAccountCategory , setUserAccountCategory ] = useState({
    accWithinDay:[],
    accWithinWeek:[],
    accWithinMonth:[],
    accWithin3Month:[],
    accWithin6Month:[],
    accWithinYear:[]
  })  

        // destructuring state variables 
const { accWithinDay ,accWithinWeek , accWithinMonth , accWithin3Month , accWithin6Month , accWithinYear} = userAccountCategory;

          // user count based on Type Of Subscription
  const [ dailySubCount , setDailySubCount ] = useState(0);
  const [ weeklySubCount , setWeeklySubCount ] = useState(0);
  const [ monthlySubCount , setMonthlySubCount ] = useState(0);

            // user count based on having a subscription plan
  const [ usersWithPlanCount , setUsersWithPlanCount ] = useState(0);
  const [ usersWithoutPlanCount , setUsersWithoutPlanCount ] = useState(0);

// Toast Notification
const { enqueueSnackbar } = useSnackbar();

  const filterUsersBySubscription = (users)=>{
    const oneDaySub = users.filter(user=>user.subscriptionType === "daily").length;
    const oneWeekSub = users.filter(user=>user.subscriptionType === "weekly").length;
    const oneMonthSub = users.filter(user=>user.subscriptionType === "monthly").length;
    const usersWithPlan = oneDaySub + oneWeekSub + oneMonthSub;
    const userWithoutPlan = users.length - usersWithPlan;

    setDailySubCount(oneDaySub);
    setWeeklySubCount(oneWeekSub);
    setMonthlySubCount(oneMonthSub);
    setUsersWithPlanCount(usersWithPlan);
    setUsersWithoutPlanCount(userWithoutPlan);
  }

  const calculateTotalSubscriptionValue = ()=>{
    const total = (dailySubCount * dailySubcriptionPrice) + ( weeklySubCount * weeklySubscriptionPrice ) + (monthlySubCount * monthlySubscriptionPrice);
    return new Intl.NumberFormat('en-US',{style:"currency",currency:"USD"}).format(total);
  }

  const calculateOtherSubscriptionValue =(a,b)=>{
    const total = a*b;
    return new Intl.NumberFormat('en-US',{style:"currency",currency:"USD"}).format(total);
  }

  const getAllUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GET_ALL_USER);
      const data = response?.data?.data || [];
      setAllUserData(data);
      filterUsersBySubscription(data);
       const { usersWithinDay , usersWithinWeek , usersWithinMonth , usersInThreeMonths , usersInSixMonths , usersWithinYear } = filterUsersByDate(data);

       // assigning filtered values to state variable
        setUserAccountCategory({
        accWithinDay:usersWithinDay,
        accWithinWeek:usersWithinWeek,
        accWithinMonth:usersWithinMonth,
        accWithin3Month:usersInThreeMonths,
        accWithin6Month:usersInSixMonths,
        accWithinYear:usersWithinYear
       })
      
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndExportData = async () =>{
    try {
      const response = await axios.get(EXCEL_DATA);
      const { data , status } = response?.data ;
      
      if(status){
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook,worksheet,"user details");
        writeFile(workbook,"userDetails.xlsx");
        enqueueSnackbar("File Exported Successfully!",{variant:"success",autoHideDuration:2000});

      }else {
        enqueueSnackbar(`Failed-${response.message}`,{variant:"error",autoHideDuration:2000});
      }   
    } catch (error) {
      enqueueSnackbar(`Export Failed-${error.message}`,{variant:"error",autoHideDuration:2000});
    }
  }
  
  
  useEffect(() => {
    getAllUserData();
  }, []);

  return (
    <div className="w-full h-full pt-2 pb-4 px-6">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:mb-5">
      <div className="text-lg font-semibold my-5">Admin Dashboard <BsGraphUpArrow className="inline-block ml-2 size-5"/></div>
      <div>
      <button
      className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white font-medium py-1.5 px-2  md:py-2 md:px-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-95 hover:shadow-2xl "
       onClick={fetchAndExportData}
      >
      Download <FiDownload className="inline-flex items-center"/>
      </button>
      </div>
      </div>

      {loading ? ( // Show loading spinner/message when loading
        <div className="w-full h-[80%] flex justify-center items-center">
          <>
            <Loading />
          </>
          {/* Replace this with a spinner for better UX */}
        </div>
      ) : allUserData.length !== 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">

                       
              <div className="flex mx-32 mb-5 justify-between border-b-2 border-purple-500 gap-16">

                        {/* Doughnut chart */}
                <div>
                  <p className="text-center text-base md:text-lg font-semibold mb-3">Users</p>
                  <UserDoughnutChart users={{usersWithPlanCount,usersWithoutPlanCount}}/>
                </div>
                        {/* Bar chart */}
                <div>
                  <p className="text-center text-base md:text-lg font-semibold mt-4">User Traffic</p>
                  <UserBarChart usersCount ={[accWithinDay.length,accWithinWeek.length,accWithinMonth.length,accWithin3Month.length,accWithin6Month.length,accWithinYear.length]}/>
                </div>
              </div>

                               {/* Earnings based on Subscription Type in our platform */}
              <p className="ml-6 font-semibold">
                <GiCash className="inline-block text-red-600 mr-1 size-6" />
                Earnings Based on Subscription Type
              </p>
              <div className="flex justify-between px-3 py-4 gap-2">
                <div className="border border-gray-300 w-3/12 p-5 rounded-md bg-blue-600 text-slate-100">
                  <p className="text-lg md:text-xl font-medium">Total </p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl font-semibold">{calculateTotalSubscriptionValue()}</p>
                    <p className="text-base">
                      {" "}
                      since Launch
                      <BsStars className="inline-block text-orange-400 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Monthly</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                      {calculateOtherSubscriptionValue(monthlySubCount,monthlySubscriptionPrice)}
                    </p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      since Launch
                      <FaCoins className="inline-block text-orange-600 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Weekly</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">{calculateOtherSubscriptionValue(weeklySubCount,weeklySubscriptionPrice)}</p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      since Launch
                      <FaCoins className="inline-block text-orange-600 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Daily</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">{calculateOtherSubscriptionValue(dailySubCount,dailySubcriptionPrice)}</p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      since Launch
                      <FaCoins className="inline-block text-orange-600 size-5 ml-1" />
                    </p>
                  </div>
                </div>
              </div>

              {/* users in our platform */}
              <p className="ml-6 mt-4 font-semibold">
                <FaUserShield className="inline-block text-rose-600 mr-1 size-6" />
                Users in Platform
              </p>
              <div className="flex justify-between px-3 py-4 gap-2">
                <div className="border border-gray-300 w-2/6 p-5 rounded-md bg-blue-600 text-slate-100">
                  <p className="text-lg md:text-xl font-medium">Total</p>
                  <div className="flex flex-col items-center my-3">
                    <p className="text-2xl md:text-3xl font-semibold">{allUserData.length}</p>
                    <p className=" text-base">
                      {" "}
                      since Launch
                      <BsStars className="inline-block text-orange-400 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Month</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                      {accWithinMonth.length}
                    </p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      last 30 Days
                      <IoRocketSharp className="inline-block text-red-600 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Week</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                      {accWithinWeek.length}
                    </p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      last 7 Days
                      <IoMdSunny className="inline-block text-orange-500 size-5 ml-1" />
                    </p>
                  </div>
                </div>
                <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                  <p className="text-lg md:text-xl font-medium">Day</p>
                  <div className="flex flex-col items-center my-3 gap-1">
                    <p className="text-2xl md:text-3xl text-blue-800 font-semibold">{accWithinDay.length}</p>
                    <p className="text-blue-800 text-base">
                      {" "}
                      last 24 Hours
                      <FaMoon className="inline-block text-rose-500 size-5 ml-1" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[80%] flex justify-center items-center">
          <p>No Data's available</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
