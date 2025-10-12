'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IoMdChatbubbles } from 'react-icons/io';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function DoctorDetailPage({ params }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${params.id}`);
        if (response.ok) {
          const doctorData = await response.json();
          setDoctor(doctorData);
        } else {
          console.error('Failed to fetch doctor:', response.status);
        }
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
      router.push(`/chat?recipientId=${doctor._id}&recipientName=${encodeURIComponent(doctor.name)}`);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatAvailability = (availability) => {
    if (!availability || !Array.isArray(availability) || availability.length === 0) {
      return 'No availability information available';
    }

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const sortedAvailability = availability
      .filter(slot => slot.isAvailable)
      .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    if (sortedAvailability.length === 0) {
      return 'No available time slots';
    }

    return sortedAvailability.map(slot => {
      const dayName = slot.day.charAt(0).toUpperCase() + slot.day.slice(1);
      return `${dayName}: ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;
    }).join(', ');
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
            <p className="text-lg text-blue-600 mb-4">{doctor.specialization || 'Healthcare Professional'}</p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 dark:text-gray-300">{doctor.bio || 'No bio available.'}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <div className="space-y-2">
                {doctor.email && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>{doctor.email}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                )}
                {doctor.location && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{formatAvailability(doctor.availability)}</p>
            </div>

            {doctor.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Experience</h2>
                <p className="text-gray-700 dark:text-gray-300">{doctor.experience}</p>
              </div>
            )}

            {doctor.hospital && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Hospital/Clinic</h2>
                <p className="text-gray-700 dark:text-gray-300">{doctor.hospital}</p>
              </div>
            )}

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