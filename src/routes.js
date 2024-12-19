import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';

import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import Salary from 'views/admin/Salary';
import AddEmployeeComponent from 'views/admin/dataTables/components/addEmployee'; 
import AddSalaryComponent from 'views/admin/marketplace/components/addSalary';
import AddCandidateComponent from 'views/admin/Salary/components/AddCandidate';
import Allowances from 'views/admin/marketplace/components/Allowances'; // Import the Allowances component
import Deductions from 'views/admin/marketplace/components/Deductions'; 
import Timesheet from 'views/admin/TimeSheet'; // Import the Timesheet component
import EmployeeTimesheet from 'views/admin/TimeSheet/components/EmployeeTimesheet';
import LeaveManagement from 'views/admin/TimeSheet/components/Leave'
import PerformanceOverview from 'views/admin/Performance';
import PerformanceMetrics from 'views/admin/Performance/components/PerformanceMetrics';
import AddPerformance from 'views/admin/Performance/components/EmployeePerformance';
import Exit from 'views/admin/Exit';
import ExitRecordsTable from 'views/admin/Exit/components/ExitRecords';
import SortedTimeSheets from 'views/admin/TimeSheet/components/SortedTimesheet';
import EvaluationOverview from 'views/admin/profile/components/EvaluationOverview';
import LoanManagementHR from 'views/admin/loan/LoanManagement';
import LoanRequest from 'views/admin/loan/LoanRequest'
// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Salary',
    layout: '/admin',
    path: '/salary',
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
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/employee',
    component: <DataTables />,
  },
  {
    name: 'Interview',
    layout: '/admin',
    path: '/interview',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Evaluation',
    layout: '/admin',
    path: '/evaluation',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <EvaluationOverview />,
  },
  {
    name: 'Add Employee',
    layout: '/admin',
    path: '/employee/add-employee',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AddEmployeeComponent />,
    secondary: true,
  },
  // {
  //   name: 'Add Employee',
  //   layout: '/admin',
  //   path: '/employee/add-employee',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: <AddEmployeeComponent />,
  //   secondary: true,
  // },
  {
    name: 'Candidate',
    layout: '/admin',
    path: '/sal',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Salary />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Add Salary',
    layout: '/admin',
    path: '/salary/add-salary',
    component: <AddSalaryComponent />,
    secondary: true,
  },
  {
    name: 'Add Candidate', // Add route for AddCandidate
    layout: '/admin',
    path: '/candidate/add-candidate', // The path for the AddCandidate page
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // You can choose a different icon if needed
    component: <AddCandidateComponent />, // Reference to the AddCandidate component
    secondary: true,
  },
  {
    name: 'Allowances', // Add route for Allowances
    layout: '/admin',
    path: '/salary/allowances/:id', // Dynamic route for allowances by employee ID
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
    component: <Allowances />, // Reference to the Allowances component
    secondary: true,
  },
  {
    name: 'Deductions', // Add route for Deductions
    layout: '/admin',
    path: '/salary/deductions/:id', // Dynamic route for deductions by employee ID
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
    component: <Deductions />, // Reference to the Deductions component
    secondary: true,
  },
  {
    name: 'Loan',
    layout: '/admin',
    path: '/Loan',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <LoanManagementHR />,
  },
  {
    name: 'Loan Request',
    layout: '/admin',
    path: '/loanRequest',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <LoanRequest />,
  },
  {
    name: 'Timesheet',
    layout: '/admin',
    path: '/timesheetSorted',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <SortedTimeSheets />,
  },
  {
    name: 'Add Timesheet',
    layout: '/admin',
    path: '/timesheet',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Timesheet />,
  },

  {
    name: 'Timesheet Report', // Specific Employee Timesheet Report Route
    layout: '/admin',
    path: '/timesheet-report/:employeeId', // Dynamic employeeId for specific employee report
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <EmployeeTimesheet />, // Using the employee-specific report component
  },

  {
    name: 'Leave', // Specific Employee Timesheet Report Route
    layout: '/admin',
    path: '/timesheet/leave', // Dynamic employeeId for specific employee report
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <LeaveManagement />, // Using the employee-specific report component
  },

  {
    name: 'Exit',
    layout: '/admin',
    path: '/exit',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Exit />,
  },

  {
    name: 'Exit Records',
    layout: '/admin',
    path: '/exit/records',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <ExitRecordsTable />,
  },
  {
    name: 'Performance',
    layout: '/admin',
    path: '/performance',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <PerformanceOverview />,
  },
  {
    name: 'Performance Metrics',
    layout: '/admin',
    path: '/performance/performanceMetrics',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <PerformanceMetrics />,
  },
  {
    name: 'Add Performance',
    layout: '/admin',
    path: '/performance/performanceEmployee',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AddPerformance />,
  },
  
];

export default routes;
