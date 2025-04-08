
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Patient, Doctor, Admin } from '@/types';
import { users, patients, doctors, admins } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  patientData: Patient | null;
  doctorData: Doctor | null;
  adminData: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('healwise_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserData(parsedUser);
    }
    setLoading(false);
  }, []);

  const loadUserData = (userData: User) => {
    if (userData.role === 'patient') {
      const patientData = patients.find(p => p.id === userData.id);
      if (patientData) setPatientData(patientData);
    } else if (userData.role === 'doctor') {
      const doctorData = doctors.find(d => d.id === userData.id);
      if (doctorData) setDoctorData(doctorData);
    } else if (userData.role === 'admin') {
      const adminData = admins.find(a => a.id === userData.id);
      if (adminData) setAdminData(adminData);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const matchedUser = users.find(u => u.email === email);
      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, you would verify the password here
      // For demo, we'll just assume password is correct if email exists
      
      setUser(matchedUser);
      loadUserData(matchedUser);
      
      // Store user in localStorage for session persistence
      localStorage.setItem('healwise_user', JSON.stringify(matchedUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${matchedUser.name}!`,
      });

      // Navigate based on user role
      if (matchedUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (matchedUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (matchedUser.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, you would create a new user in your database
      // For demo, we'll just simulate a successful registration
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPatientData(null);
    setDoctorData(null);
    setAdminData(null);
    localStorage.removeItem('healwise_user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      patientData,
      doctorData,
      adminData,
      login, 
      register, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
