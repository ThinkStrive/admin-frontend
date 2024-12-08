import { Bar } from "react-chartjs-2";
import { Chart as ChartJS , Tooltip , Legend,Title , CategoryScale , LinearScale, LineElement, BarElement } from "chart.js";

ChartJS.register(
    Tooltip,
    Legend,
    Title,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement
);



const UserBarChart = ({usersCount}) => {

    const options = {
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
          scales: {
            x: {
              ticks: {
                color: "#000", 
                font: {
                  size: 13, 
                },
              },
            },
            y: {
              ticks: {
                color: "#000", 
                font: {
                  size: 13, 
                },
              },
            },
          },
    };

    const barChartData = {
        labels:["1 Day","7 Days","1 Month","3 Month","6 Month","1 Year"],
        datasets:[
            {
                label:"users",
                data:[...usersCount],
                backgroundColor:["#9966FF"],
                borderWidth:1
            }
        ]
    }


  return (
    <div className="h-[270px] w-[430px] md:h-[300px] md:w-[550px]">
        <Bar options={options} data={barChartData} />
    </div>
  )
}

export default UserBarChart;