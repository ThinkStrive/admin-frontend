import axios from "axios";
import {
  USERS_BY_PROJECT_SUBSCRIPTION,
  USERS_BY_REGISTRATION_DATE,
} from "../../api/ApiDetails";
import { useEffect, useState } from "react";
import Loading from "../Resources/Loading";
import { BsStars, BsGraphUpArrow } from "react-icons/bs";
import { IoRocketSharp } from "react-icons/io5";
import { IoMdSunny } from "react-icons/io";
import { FaUserShield, FaMoon, FaCoins, FaUser } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import {
  dailySubcriptionPrice,
  weeklySubscriptionPrice,
  monthlySubscriptionPrice,
} from "../../utils/constants";
import UserDoughnutChart from "../Charts/UserDoughnutChart";
import UserBarChart from "../Charts/UserBarChart";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [usersByRegisteredDate, setUsersByRegisteredDate] = useState({
    withinADay: [],
    withinAWeek: [],
    withinAMonth: [],
    withinThreeMonths: [],
    withinSixMonths: [],
    withinAYear: [],
  });
  // destructure usersByRegisteredDate
  const {
    withinADay,
    withinAWeek,
    withinAMonth,
    withinThreeMonths,
    withinSixMonths,
    withinAYear,
  } = usersByRegisteredDate;
  const [usersByProjectSubscription, setUsersByProjectSubscription] = useState({
    totalUsersCount: 0,
    noSubUsersCount: 0,
    baccaratSubscribers: [],
    rouletteSubscribers: [],
  });

  // destructure usersByProjectSubscription
  const {
    totalUsersCount,
    noSubUsersCount,
    baccaratSubscribers,
    rouletteSubscribers,
  } = usersByProjectSubscription;

  const [rouletteUsers, setRouletteUsers] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [baccaratUsers, setBaccaratUsers] = useState({
    hourly: [],
    daily: [],
    weekly: [],
    monthly: [],
  });

  const categorizeSubscribers = () => {
    const rouletteFiltered = {
      daily: rouletteSubscribers.filter(
        (user) => user?.subscriptionType === "daily"
      ),
      weekly: rouletteSubscribers.filter(
        (user) => user?.subscriptionType === "weekly"
      ),
      monthly: rouletteSubscribers.filter(
        (user) => user?.subscriptionType === "monthly"
      ),
    };

    const baccaratFiltered = {
      hourly: baccaratSubscribers.filter(
        (user) =>
          user?.projectSubscription?.baccarat?.subscriptionType === "hourly"
      ),
      daily: baccaratSubscribers.filter(
        (user) =>
          user?.projectSubscription?.baccarat?.subscriptionType === "daily"
      ),
      weekly: baccaratSubscribers.filter(
        (user) =>
          user?.projectSubscription?.baccarat?.subscriptionType === "weekly"
      ),
      monthly: baccaratSubscribers.filter(
        (user) =>
          user?.projectSubscription?.baccarat?.subscriptionType === "monthly"
      ),
    };

    setRouletteUsers(rouletteFiltered);
    setBaccaratUsers(baccaratFiltered);
  };

  const fetchUsersByRegisteredDate = async () => {
    try {
      const response = await axios.get(USERS_BY_REGISTRATION_DATE);
      const data = response?.data?.data || {};
      setUsersByRegisteredDate({
        withinADay: data.withinADay || [],
        withinAWeek: data.withinAWeek || [],
        withinAMonth: data.withinAMonth || [],
        withinThreeMonths: data.withinThreeMonths || [],
        withinSixMonths: data.withinSixMonths || [],
        withinAYear: data.withinAYear || [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUsersByProjectSubscription = async () => {
    setLoading(true);
    try {
      const response = await axios.get(USERS_BY_PROJECT_SUBSCRIPTION);
      const { data } = response?.data;

      setUsersByProjectSubscription({
        totalUsersCount: data.totalUsersCount,
        noSubUsersCount: data.noSubUsersCount,
        baccaratSubscribers: data.baccaratSubscribers || [],
        rouletteSubscribers: data.rouletteSubscribers || [],
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersByRegisteredDate();
    fetchUsersByProjectSubscription();
  }, []);
  
  useEffect(() => {
    if (rouletteSubscribers.length || baccaratSubscribers.length) {
      categorizeSubscribers();
    }
  }, [rouletteSubscribers, baccaratSubscribers]);

  return (
    <div className="w-full h-full pt-2 pb-4 px-6">
      <div className="text-lg font-semibold my-5">
        Admin Dashboard
        <BsGraphUpArrow className="inline-block ml-2 size-5" />
      </div>

      {loading ? ( // Show loading spinner/message when loading
        <div className="w-full h-[80%] flex justify-center items-center">
          <>
            <Loading />
          </>
          {/* Replace this with a spinner for better UX */}
        </div>
      ) : baccaratSubscribers.length > 0 || rouletteSubscribers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="flex mx-32 mb-5 justify-between border-b-2 border-purple-500 gap-16">
                {/* Doughnut chart */}
                <div>
                  <p className="text-center text-base md:text-lg font-semibold mb-3">
                    Users
                  </p>
                  <UserDoughnutChart
                    users={{ totalUsersCount, noSubUsersCount }}
                  />
                </div>
                {/* Bar chart */}
                <div>
                  <p className="text-center text-base md:text-lg font-semibold mt-4">
                    User Traffic
                  </p>
                  <UserBarChart
                    usersCount={[
                      withinADay.length,
                      withinAWeek.length,
                      withinAMonth.length,
                      withinThreeMonths.length,
                      withinSixMonths.length,
                      withinAYear.length,
                    ]}
                  />
                </div>
              </div>

              {/* Active subscriptions - Baccarat*/}
              <div className="mt-3">
                <p className="ml-6 inline-flex items-center">
                  <GiCash className="text-rose-600 mr-1 size-6" />
                  <span className="font-semibold">
                    Baccarat active subscriptions
                  </span>
                </p>
                <div className="flex justify-between px-3 py-2 gap-2">
                  <div className="border border-gray-300 w-2/6 p-5 rounded-md bg-blue-700 text-slate-200">
                    <p className="text-lg md:text-xl font-medium">Total</p>
                    <div className="flex flex-col items-center my-3">
                      <p className="text-2xl md:text-3xl font-semibold">
                        { baccaratSubscribers.length }
                      </p>
                      <p className="inline-flex items-center">
                        <span className="font-medium">members</span>
                        <BsStars className="text-orange-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Monthly plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {baccaratUsers.monthly.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Weekly plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {baccaratUsers.weekly.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                 
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Daily plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {baccaratUsers.daily.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Hourly plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {baccaratUsers.hourly.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active subscriptions - Roulette*/}
              <div className="mt-3">
                <p className="ml-6 inline-flex items-center">
                  <GiCash className="text-rose-600 mr-1 size-6" />
                  <span className="font-semibold">
                    DD Roulette & Spin cycle active subscriptions
                  </span>
                </p>
                <div className="flex justify-between px-3 py-2 gap-2">
                  <div className="border border-gray-300 w-2/6 p-5 rounded-md bg-blue-700 text-slate-200">
                    <p className="text-lg md:text-xl font-medium">Total</p>
                    <div className="flex flex-col items-center my-3">
                      <p className="text-2xl md:text-3xl font-semibold">
                        {rouletteSubscribers.length}
                      </p>
                      <p className="inline-flex items-center">
                        <span className="font-medium">members</span>
                        <BsStars className="text-orange-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Monthly plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {rouletteUsers.monthly.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Weekly plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {rouletteUsers.weekly.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Daily plan
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {rouletteUsers.daily.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className=" text-base font-medium">members</span>
                        <FaUser className="text-rose-500 size-3 ml-1" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* users registratons in our platform */}
              <div className="mt-3">
                <p className="ml-6 inline-flex items-center">
                  <FaUserShield className="text-rose-600 mr-1 size-6" />
                  <span className="font-semibold">
                    Users registrations in this platform
                  </span>
                </p>
                <div className="flex justify-between px-3 py-2 gap-2">
                  <div className="border border-gray-300 w-2/6 p-5 rounded-md bg-blue-700 text-slate-200">
                    <p className="text-lg md:text-xl font-medium">Total</p>
                    <div className="flex flex-col items-center my-3">
                      <p className="text-2xl md:text-3xl font-semibold">
                        {totalUsersCount}
                      </p>
                      <p className="inline-flex items-center">
                        <span className="font-medium">since Launch</span>
                        <BsStars className="text-orange-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Within a month
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {withinAMonth.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className="font-medium">last 30 Days</span>
                        <IoRocketSharp className="text-rose-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Within a week
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {withinAWeek.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className="font-medium">last 7 Days</span>
                        <IoMdSunny className="text-rose-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-2/6 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">
                      Within a day
                    </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {withinADay.length}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className="font-medium">last 24 Hours</span>
                        <FaMoon className="text-rose-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings based on Subscription Type in our platform */}
              {/* <div className="mt-3">
                <p className="ml-6 font-semibold inline-flex items-center">
                  <GiCash className=" text-red-600 mr-1 size-6" />
                  Earnings Based on Subscription Type
                </p>
                <div className="flex justify-between px-3 py-2 gap-2">
                  <div className="border border-gray-300 w-3/12 p-5 rounded-md bg-blue-700 text-slate-200">
                    <p className="text-lg md:text-xl font-medium">Total </p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl font-semibold">
                        {calculateTotalSubscriptionValue()}
                      </p>
                      <p className=" inline-flex items-center">
                        <span className="font-medium">since Launch</span>
                        <BsStars className="text-orange-500 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">Monthly</p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {calculateOtherSubscriptionValue(
                          monthlySubCount,
                          monthlySubscriptionPrice
                        )}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className="font-medium">since Launch</span>
                        <FaCoins className="text-orange-600 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">Weekly</p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {calculateOtherSubscriptionValue(
                          weeklySubCount,
                          weeklySubscriptionPrice
                        )}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                        <span className="font-medium">since Launch</span>
                        <FaCoins className=" text-orange-600 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                  <div className="border border-gray-400 w-3/12 p-5 bg-slate-50 rounded-md">
                    <p className="text-lg md:text-xl font-medium text-gray-800">Daily</p>
                    <div className="flex flex-col items-center my-3 gap-1">
                      <p className="text-2xl md:text-3xl text-blue-800 font-semibold">
                        {calculateOtherSubscriptionValue(
                          dailySubCount,
                          dailySubcriptionPrice
                        )}
                      </p>
                      <p className="inline-flex items-center text-gray-800">
                       <span className="font-medium">since Launch</span>
                        <FaCoins className="text-orange-600 size-4 ml-1" />
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
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
