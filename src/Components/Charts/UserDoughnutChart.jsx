import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS , Tooltip , Legend , ArcElement ,Title } from "chart.js";


ChartJS.register(Tooltip,Legend,ArcElement ,Title);

const UserDoughnutChart = ({users}) => {

  const { totalUsersCount , noSubUsersCount } = users;
  const usersWithPlanCount = totalUsersCount - noSubUsersCount ;
  const usersWithoutPlanCount = noSubUsersCount ;
  
  const options = {
    responsive:true,
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position:"bottom",
        labels: {
          font: {
            size: 14, 
          },
          color: "#000", 
        },
      },
    },
  };
  const pieChartData = {
    labels:["with Plan","without Plan"],
    datasets:[
      {
        label:"Users",
        data:[usersWithPlanCount,usersWithoutPlanCount],
        backgroundColor:[
          "#9966FF",
          "#f94c4e"
          
        ],
        hoverOffset:4
      }
    ]
  }

  return (
    <div className="h-[280px] w-[280px] cursor-pointer">
      <Doughnut options={options} data={pieChartData}/>
    </div>
  )
}

export default UserDoughnutChart;