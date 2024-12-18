// employeeRoutes.js

import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";


import MainDashboard from 'views/employee/default3';
import Profile from "views/employee/profile3";
import NFTMarketplace from 'views/employee/marketplace3';
import DataTables from 'views/employee/dataTables3';
import Salary from 'views/employee/Salary3';
import AddEmployeeComponent from 'views/employee/dataTables3/components/addEmployee'; 
import AddSalaryComponent from 'views/employee/marketplace3/components/addSalary';
import AddCandidateComponent from 'views/employee/Salary3/components/AddCandidate';
import Allowances from 'views/employee/marketplace3/components/Allowances'; // Import the Allowances component
import Deductions from 'views/employee/marketplace3/components/Deductions'; 
import Timesheet from 'views/employee/TimeSheet3'; // Import the Timesheet component
import EmployeeTimesheet from 'views/employee/TimeSheet3/components/EmployeeTimesheet';
import LeaveManagement from 'views/employee/TimeSheet3/components/Leave'
import PerformanceOverview from 'views/employee/Performance3';
import PerformanceMetrics from 'views/employee/Performance3/components/PerformanceMetrics';
import AddPerformance from 'views/employee/Performance3/components/EmployeePerformance';
import Exit from 'views/employee/Exit3';
import ExitRecordsTable from 'views/employee/Exit3/components/ExitRecords';
import SortedTimeSheets from 'views/employee/TimeSheet3/components/SortedTimesheet';
import LeaveRequest from "views/employee/TimeSheet3/components/LeaveRequest";
import SignInCentered from 'views/auth/signIn';


const employeeRoutes = [
    {
        name: 'Main Dashboard',
        layout: '/employee',
        path: '/default3',
        icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
        component: <MainDashboard />,
      },
      {
        name: 'Salary',
        layout: '/employee',
        path: '/salary3',
        icon: (
          <Icon
            as={MdOutlineShoppingCart}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: <NFTMarketplace />,
        secondary: true,
      },
      {
        name: 'Employee',
        layout: '/employee',
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        path: '/employee3',
        component: <DataTables />,
      },
      {
        name: 'Interview',
        layout: '/employee',
        path: '/interview3',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <Profile />,
      },

      // {
      //   name: 'Add Employee',
      //   layout: '/employee',
      //   path: '/employee/add-employee',
      //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
      //   component: <AddEmployeeComponent />,
      //   secondary: true,
      // },
    //   {
    //     name: 'Candidate',
    //     layout: '/employee',
    //     path: '/sal3',
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //     component: <Salary />,
    //   },
    //   {
    //     name: 'Sign In',
    //     layout: '/auth',
    //     path: '/sign-in3',
    //     icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    //     component: <SignInCentered />,
    //   },
    //   {
    //     name: 'Add Salary',
    //     layout: '/employee',
    //     path: '/salary3/add-salary',
    //     component: <AddSalaryComponent />,
    //     secondary: true,
    //   },
    //   {
    //     name: 'Add Candidate', // Add route for AddCandidate
    //     layout: '/employee',
    //     path: '/candidate3/add-candidate', // The path for the AddCandidate page
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // You can choose a different icon if needed
    //     component: <AddCandidateComponent />, // Reference to the AddCandidate component
    //     secondary: true,
    //   },
    //   {
    //     name: 'Allowances', // Add route for Allowances
    //     layout: '/employee',
    //     path: '/salary3/allowances/:id', // Dynamic route for allowances by employee ID
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
    //     component: <Allowances />, // Reference to the Allowances component
    //     secondary: true,
    //   },
    //   {
    //     name: 'Deductions', // Add route for Deductions
    //     layout: '/employee',
    //     path: '/salary3/deductions/:id', // Dynamic route for deductions by employee ID
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
    //     component: <Deductions />, // Reference to the Deductions component
    //     secondary: true,
    //   },
      {
        name: 'Timesheet',
        layout: '/employee',
        path: '/timesheetSorted',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <SortedTimeSheets />,
      },
      {
        name: 'Add Timesheet',
        layout: '/employee',
        path: '/timesheet3',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <Timesheet />,
      },
    
      {
        name: 'Timesheet Report', // Specific Employee Timesheet Report Route
        layout: '/employee',
        path: '/timesheet3-report/:employeeId', // Dynamic employeeId for specific employee report
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        component: <EmployeeTimesheet />, // Using the employee-specific report component
      },
    
      {
        name: 'Leave', // Specific Employee Timesheet Report Route
        layout: '/employee',
        path: '/timesheet3/leave', // Dynamic employeeId for specific employee report
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        component: <LeaveManagement />, // Using the employee-specific report component
      },
      {
        name: 'Leave Request', // Specific Employee Timesheet Report Route
        layout: '/employee',
        path: '/timesheet3/leaveRequest', // Dynamic employeeId for specific employee report
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        component: <LeaveRequest />, // Using the employee-specific report component
      },
      {
        name: 'Performance',
        layout: '/employee',
        path: '/performance3',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <PerformanceOverview />,
      },
    //   {
    //     name: 'Performance Metrics',
    //     layout: '/employee',
    //     path: '/performance3/performanceMetrics',
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //     component: <PerformanceMetrics />,
    //   },
    //   {
    //     name: 'Add Performance',
    //     layout: '/employee',
    //     path: '/performance3/performanceEmployee',
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //     component: <AddPerformance />,
    //   },
      {
        name: 'Exit',
        layout: '/employee',
        path: '/exit3',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <Exit />,
      },
    
    //   {
    //     name: 'Exit Records',
    //     layout: '/employee',
    //     path: '/exit3/records',
    //     icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    //     component: <ExitRecordsTable />,
    //   },
];

export default employeeRoutes;
