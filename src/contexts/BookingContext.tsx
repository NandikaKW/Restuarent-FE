import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
//what a booking coming from the backend looks like.
interface Booking {
  _id: string;
  userId?: string;
  userEmail: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  createdAt: string;
}
//data sent FROM the form TO the backend.
interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
}

//what bookingContext provides
interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (data: BookingFormData) => Promise<{ success: boolean; message: string }>;
  fetchUserBookings: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<{ success: boolean; message: string }>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
//BookingProvider can wrap other components, and whatever is inside will be rendered as children.
interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const { user } = useAuth(); 
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings when user changes
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    } else {
      setBookings([]); // Clear bookings when user logs out
    }
  }, [user]);

  const createBooking = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/bookings', data);
      // Add the new booking to the beginning of the list
      setBookings(prev => [response.data.booking, ...prev]);
      return { success: true, message: response.data.message };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    if (!user) {
      setBookings([]);
      setError('Please log in to view your bookings');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (err: any) {
      // If unauthorized (401), user might not be logged in properly
      if (err.response?.status === 401) {
        setError('Please log in to view bookings');
        setBookings([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    // Check if token exists in localStorage for admin access
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/bookings/all');
      setBookings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      // Remove the cancelled booking from state
      setBookings(prev => prev.filter(booking => booking._id !== id));
      return { success: true, message: 'Booking cancelled successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      return { success: false, message: errorMessage };
    }
  };

  const refreshBookings = async () => {
    if (user) {
      await fetchUserBookings();
    }
  };

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    fetchAllBookings,
    cancelBooking,
    refreshBookings,
  };

  return (
    //shares the value object with all components inside it (the children).
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};