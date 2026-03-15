import {useEffect, useState} from 'react';
import {
  Plus, 
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

import moment from "moment";
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const EmployerDashboard = () => {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLodading, setIsLoading] = useState(false);

  const getDashBoardOverView = async () => {
    try{
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if(response.status === 200){
        setDashboardData(response.data);
      }
    } catch(error){
      console.error("Error fetching dashboard overview:", error);
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDashBoardOverView();
  }, [])

  return (
    <div>EemployerDashboard</div>
  )
}

export default EmployerDashboard