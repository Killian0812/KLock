import { defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { BiUser, BiDoorOpen } from "react-icons/bi"; // Importing user and door icons
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from "react";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 25;
defaults.plugins.title.font.family = 'Quicksand'
defaults.plugins.title.color = "white";

const Dashboard = () => {

  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosPrivate.get('/api/admin/dashboardInfo');
        setData([...Object.values(res.data)]);
      } catch (error) {
        console.log(error);
        setData([50, 10, 10, 2]);
      }
    }
    fetchData();
  }, [axiosPrivate]);

  return (
    <div className='MainContainer'>
      <div style={{ height: 400, width: 1000, display: 'flex', marginTop: -140 }}>
        <div style={{ flex: 1, padding: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 20 }}>
          <div style={{ width: '100%', height: '90%' }}>
            <Doughnut
              data={{
                labels: ['Guests', 'Registered'],
                datasets: [
                  {
                    label: "Count",
                    data: [data[0] - data[1], data[1]],
                    backgroundColor: [
                      "rgb(114, 0, 0)",
                      "rgb(18, 40, 96)",
                    ],
                    borderColor: [
                      "rgb(34,34,34)",
                      "rgb(34,34,34)",
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: `Entries count: ${data[0]}`,
                  },
                  legend: {
                    labels: {
                      font: {
                        size: 20,
                      },
                      color: "white",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column' }}>
          <Link to="/admin/building" className="dashboard-nav" style={{ margin: '0 20px 0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <BiUser size={60} style={{ marginBottom: '10px' }} />
              <span style={{ margin: 0 }}>{`Total rooms: ${data[2]}`}</span>
            </div>
          </Link>
          <Link to="/admin/building" className="dashboard-nav" style={{ margin: '20px 20px 0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <BiDoorOpen size={60} style={{ marginBottom: '10px' }} />
              <span style={{ margin: 0 }}>{`Total users: ${data[3]}`}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;