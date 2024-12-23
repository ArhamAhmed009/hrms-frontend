import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdBarChart, MdHome, MdOutlineShoppingCart, MdPerson } from 'react-icons/md';

// Import views for Project Manager
import MainDashboard from 'views/projectManager/default2';
import NFTMarketplace from 'views/projectManager/marketplace2';
import Profile from 'views/projectManager/profile2';
import DataTables from 'views/projectManager/dataTables2';
import Salary from 'views/projectManager/Salary2';

// import AddEmployeeComponent from 'views/projectManager/dataTables/components/addEmployee'; 
// import AddSalaryComponent from 'views/projectManager/marketplace/components/addSalary';
// import AddCandidateComponent from 'views/projectManager/Salary/components/AddCandidate';
import Allowances from 'views/projectManager/marketplace2/components/Allowances'; // Import the Allowances component
import Deductions from 'views/projectManager/marketplace2/components/Deductions'; 
// import Timesheet from 'views/projectManager/TimeSheet'; // Import the Timesheet component
import EmployeeTimesheet from 'views/projectManager/TimeSheet2/components/EmployeeTimesheet';
import LeaveManagement from 'views/projectManager/TimeSheet2/components/Leave'
import PerformanceOverview from 'views/projectManager/Performance2';
import PerformanceMetrics from 'views/projectManager/Performance2/components/PerformanceMetrics';
import AddPerformance from 'views/projectManager/Performance2/components/EmployeePerformance';
import Exit from 'views/projectManager/Exit2';
// import ExitRecordsTable from 'views/projectManager/Exit/components/ExitRecords';
import SortedTimeSheets from 'views/projectManager/TimeSheet2/components/SortedTimesheet';
import LeaveRequest from 'views/projectManager/TimeSheet2/components/LeaveRequest';
import SignInCentered from 'views/auth/signIn';
import LoanManagementHR from 'views/projectManager/loan2/LoanManagement';
import LoanRequest from 'views/projectManager/loan2/LoanRequest';
import TimeSheet from 'views/projectManager/TimeSheet2';

const projectManagerRoutes = [
    {
      name: 'Main Dashboard',
      layout: '/projectManager',
      path: '/default2', // Remove leading slash
      icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
      component: <MainDashboard />,
    },
    {
      name: 'Salary',
      layout: '/projectManager',
      path: '/salary2', // Remove leading slash
      icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
      component: <NFTMarketplace />,
    },
    {
      name: 'Employee',
      layout: '/projectManager',
      path: '/employee2', // Remove leading slash
      icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
      component: <DataTables />,
    },
    // {
    //   name: 'Interview',
    //   layout: '/projectManager',
    //   path: '/interview2', // Remove leading slash
    //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //   component: <Profile />,
    // },
    {
        name: 'Candidate',
        layout: '/projectManager',
        path: '/sal',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <Salary />,
      },
    //   {
    //     name: 'Sign In',
    //     layout: '/auth',
    //     path: '/sign-in',
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    //     component: <SignInCentered />,
    //   },
    //   {
    //     name: 'Add Salary',
    //     layout: '/projectManager',
    //     path: '/salary/add-salary',
    //     component: <AddSalaryComponent />,
    //     secondary: true,
    //   },
    //   {
    //     name: 'Add Candidate', // Add route for AddCandidate
    //     layout: '/projectManager',
    //     path: '/candidate/add-candidate', // The path for the AddCandidate page
    //     icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // You can choose a different icon if needed
    //     component: <AddCandidateComponent />, // Reference to the AddCandidate component
    //     secondary: true,
    //   },
      {
        name: 'Allowances', // Add route for Allowances
        layout: '/projectManager',
        path: '/salary/allowances/:id', // Dynamic route for allowances by employee ID
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
        component: <Allowances />, // Reference to the Allowances component
        secondary: true,
      },
      {
        name: 'Deductions', // Add route for Deductions
        layout: '/projectManager',
        path: '/salary/deductions/:id', // Dynamic route for deductions by employee ID
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
        component: <Deductions />, // Reference to the Deductions component
        secondary: true,
      },
      {
        name: 'Loan',
        layout: '/projectManager',
        path: '/Loan',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <LoanManagementHR />,
      },
      {
        name: 'Loan Request',
        layout: '/projectManager',
        path: '/loanRequest',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <LoanRequest />,
      },
      // {
      //   name: 'Timesheet',
      //   layout: '/projectManager',
      //   path: '/timesheetSorted',
      //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
      //   component: <SortedTimeSheets />,
      // },
      {
        name: 'Add Timesheet',
        layout: '/projectManager',
        path: '/timesheet',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <TimeSheet />,
      },
    
      // {
      //   name: 'Timesheet Report', // Specific Employee Timesheet Report Route
      //   layout: '/projectManager',
      //   path: '/timesheet-report/:employeeId', // Dynamic employeeId for specific employee report
      //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
      //   component: <EmployeeTimesheet />, // Using the employee-specific report component
      // },
    
      {
        name: 'Leave', // Specific Employee Timesheet Report Route
        layout: '/projectManager',
        path: '/timesheet/leave', // Dynamic employeeId for specific employee report
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        component: <LeaveManagement />, // Using the employee-specific report component
      },
      {
        name: 'Request Leave', // Specific Employee Timesheet Report Route
        layout: '/projectManager',
        path: '/timesheet/leave/request', // Dynamic employeeId for specific employee report
        icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
        component: <LeaveRequest />, // Using the employee-specific report component
      },
      {
        name: 'Performance',
        layout: '/projectManager',
        path: '/performance',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <PerformanceOverview />,
      },
      {
        name: 'Performance Metrics',
        layout: '/projectManager',
        path: '/performance/performanceMetrics',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <PerformanceMetrics />,
      },
      {
        name: 'Add Performance',
        layout: '/projectManager',
        path: '/performance/performanceEmployee',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <AddPerformance />,
      },
      {
        name: 'Exit',
        layout: '/projectManager',
        path: '/exit',
        icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
        component: <Exit />,
      },
    
    //   {
    //     name: 'Exit Records',
    //     layout: '/projectManager',
    //     path: '/exit/records',
    //     icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    //     component: <ExitRecordsTable />,
    //   },
  ];
  

export default projectManagerRoutes;
