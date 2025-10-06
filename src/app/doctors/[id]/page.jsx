'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IoMdChatbubbles } from 'react-icons/io';
import { getDoctorById } from '@/lib/doctors';

export default function DoctorDetailPage({ params }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorData = await getDoctorById(params.id);
        setDoctor(doctorData);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDoctor();
    }
  }, [params.id]);

  const startChat = () => {
    if (doctor) {
      router.push(`/chat?recipientId=${doctor.id}&recipientName=${encodeURIComponent(doctor.name)}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Doctor Not Found</h2>
          <p className="mb-4">The doctor you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push('/doctors')}>
            Back to Doctors
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              {doctor.image ? (
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-4xl font-bold text-gray-400">
                  {doctor.name?.charAt(0).toUpperCase() || 'D'}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
            <p className="text-lg text-blue-600 mb-4">{doctor.specialty}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{doctor.bio || 'No bio available.'}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-gray-700">{doctor.email || 'No email available.'}</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={startChat} className="flex items-center gap-2">
                <IoMdChatbubbles />
                Chat with Doctor
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}