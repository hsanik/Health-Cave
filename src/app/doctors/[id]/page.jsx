'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageSpinner } from '@/components/ui/loading-spinner';
import { formatDoctorName } from '@/utils/doctorUtils';
import { 
  processDoctorAvailability, 
  getWeeklySchedule,
  getTodayWorkingHours 
} from '@/utils/availabilityUtils';
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Users,
  Calendar,
  Award,
  BookOpen,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

export default function DoctorDetailPage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params Promise for Next.js 15+
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${id}`
        );

        // Process and validate doctor data
        const baseDoctor = {
          ...response.data,
          // Ensure all fields have proper types and fallbacks
          name: String(response.data.name || ''),
          specialization: String(response.data.specialization || ''),
          hospital: String(response.data.hospital || ''),
          rating: Number(response.data.rating) || 4.5,
          consultationFee: Number(response.data.consultationFee) || 100,
          patients: Number(response.data.patients) || 0,
          email: String(response.data.email || ''),
          phone: String(response.data.phone || ''),
          experience: String(response.data.experience || ''),
          qualification: String(response.data.qualification || ''),
          bio: String(response.data.bio || ''),
          languages: Array.isArray(response.data.languages) ? response.data.languages : []
        };

        // Add computed availability
        const doctorData = processDoctorAvailability(baseDoctor);
        setDoctor(doctorData);
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setError('Failed to load doctor information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const startChat = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (doctor) {
      router.push(`/chat?recipientId=${doctor._id}&recipientName=${encodeURIComponent(doctor.name)}`);
    }
  };

  const bookAppointment = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    router.push(`/book-appointment/${doctor._id}`);
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
      return 'Available for appointments';
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
    return <PageSpinner text="Loading doctor information..." />;
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error ? 'Error Loading Doctor' : 'Doctor Not Found'}
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'The doctor you are looking for does not exist or has been removed.'}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => router.push('/doctors')}
                className="bg-[#435ba1] hover:bg-[#4c69c6]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Doctors
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/doctors')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Doctors</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Image and Quick Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              {/* Doctor Image */}
              <div className="relative w-full h-64 mb-6 bg-gray-200 rounded-lg overflow-hidden">
                {doctor.image && doctor.image.trim() !== '' && !doctor.image.includes("imgbox.com") ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <Users className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${doctor.availabilityStatus === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {doctor.availabilityStatus}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{doctor.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">Rating</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">${doctor.consultationFee}</span>
                  </div>
                  <span className="text-sm text-gray-600">Consultation</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{doctor.patients}+</span>
                  </div>
                  <span className="text-sm text-gray-600">Patients</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{doctor.nextAvailable}</span>
                  </div>
                  <span className="text-sm text-gray-600">Next Available</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={bookAppointment}
                  className="w-full bg-[#435ba1] hover:bg-[#4c69c6] text-white"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>

                <Button
                  onClick={startChat}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Doctor
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {formatDoctorName(doctor.name)}
                  </h1>
                  <p className="text-xl text-[#435ba1] font-medium mb-2">
                    {doctor.specialization}
                  </p>
                  {doctor.hospital && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.hospital}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {doctor.bio && (
                <div className="border-t pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              )}
            </Card>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Qualifications & Experience */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#435ba1]" />
                  <span>Qualifications & Experience</span>
                </h3>
                <div className="space-y-3">
                  {doctor.qualification && (
                    <div>
                      <p className="text-sm text-gray-600">Qualification</p>
                      <p className="font-medium">{doctor.qualification}</p>
                    </div>
                  )}
                  {doctor.experience && (
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium">{doctor.experience}</p>
                    </div>
                  )}
                  {doctor.languages && doctor.languages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Languages</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {doctor.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-[#435ba1]" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-3">
                  {doctor.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{doctor.email}</p>
                      </div>
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{doctor.phone}</p>
                      </div>
                    </div>
                  )}
                  {doctor.hospital && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital/Clinic</p>
                        <p className="font-medium">{doctor.hospital}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Availability Schedule */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#435ba1]" />
                <span>Weekly Schedule</span>
              </h3>
              
              {/* Today's Hours */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Today's Hours</p>
                    <p className="text-lg font-semibold text-blue-900">{getTodayWorkingHours(doctor)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.availabilityStatus === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.availabilityStatus}
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="space-y-2">
                {getWeeklySchedule(doctor).map((schedule, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      schedule.isAvailable 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span className={`text-sm ${
                      schedule.isAvailable ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {schedule.hours || schedule.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next Available */}
              {doctor.nextAvailable && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      Next available: <span className="font-medium text-green-600">{doctor.nextAvailable}</span>
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Additional Information */}
            {(doctor.specialization || doctor.consultationFee) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#435ba1]" />
                  <span>Additional Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Specialization</span>
                    </div>
                    <p className="text-blue-800">{doctor.specialization}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Consultation Fee</span>
                    </div>
                    <p className="text-green-800 text-lg font-semibold">${doctor.consultationFee}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}