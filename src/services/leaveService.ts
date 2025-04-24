
import axiosInstance from '@/lib/axios';
import { saveAs } from 'file-saver';

export type LeaveType = 'ANNUAL' | 'SICK' | 'PERSONAL' | 'UNPAID' | 'OTHER';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason: string;
  status: LeaveStatus;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  adminComment?: string;
  department?: string;
}

export interface LeaveFormData {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason: string;
  document?: File;
}

export interface LeaveFilters {
  department?: string;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
}

export interface LeaveStatistics {
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
}

// Submit a new leave request
export const createLeaveRequest = async (data: LeaveFormData): Promise<LeaveRequest> => {
  // Handle file upload with FormData
  const formData = new FormData();
  formData.append('leaveType', data.leaveType);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('halfDay', data.halfDay.toString());
  formData.append('reason', data.reason);
  
  if (data.document) {
    formData.append('document', data.document);
  }
  
  const response = await axiosInstance.post('/leave', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get leave requests for the logged-in user
export const getUserLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await axiosInstance.get('/leave/user');
  return response.data;
};

// Get all leave requests (admin only)
export const getAllLeaveRequests = async (filters?: LeaveFilters): Promise<LeaveRequest[]> => {
  const response = await axiosInstance.get('/leave', { params: filters });
  return response.data;
};

// Get leave request details by ID
export const getLeaveRequestById = async (id: string): Promise<LeaveRequest> => {
  const response = await axiosInstance.get(`/leave/${id}`);
  return response.data;
};

// Update leave request status (admin only)
export const updateLeaveStatus = async (
  id: string,
  status: LeaveStatus,
  adminComment?: string
): Promise<LeaveRequest> => {
  const response = await axiosInstance.patch(`/leave/${id}/status`, {
    status,
    adminComment,
  });
  return response.data;
};

// Download leave document
export const downloadLeaveDocument = async (id: string, filename: string): Promise<void> => {
  const response = await axiosInstance.get(`/leave/${id}/document`, {
    responseType: 'blob',
  });
  saveAs(response.data, filename);
};

// Get leave statistics for the user
export const getLeaveStatistics = async (): Promise<LeaveStatistics> => {
  const response = await axiosInstance.get('/leave/statistics');
  return response.data;
};

// Export leave requests to CSV (admin only)
export const exportLeavesToCsv = async (filters?: LeaveFilters): Promise<void> => {
  const response = await axiosInstance.get('/reports/leave', {
    params: filters,
    responseType: 'blob',
  });
  
  const date = new Date().toISOString().split('T')[0];
  saveAs(response.data, `leave-report-${date}.csv`);
};
