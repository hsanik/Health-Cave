import React from 'react';
import { User, UserCheck, Stethoscope } from 'lucide-react';

const UserRoleBadge = ({ role, className = "" }) => {
  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case 'patient':
        return {
          icon: UserCheck,
          label: 'Patient',
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-700'
        };
      case 'doctor':
        return {
          icon: Stethoscope,
          label: 'Doctor',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-700'
        };
      default:
        return {
          icon: User,
          label: 'User',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  const config = getRoleConfig(role);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}>
      <IconComponent className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};

export default UserRoleBadge;