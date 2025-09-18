'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Shield, Users, Award, Target, Eye, Star, CheckCircle, Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function About() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      experience: "15+ years",
      image: "/images/about.png"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology",
      specialty: "Cardiovascular Surgery",
      experience: "12+ years",
      image: "/images/about2.png"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatric Specialist",
      specialty: "Pediatric Care",
      experience: "10+ years",
      image: "/images/about.png"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We treat every patient with empathy, respect, and genuine concern for their wellbeing."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your health and privacy are our top priorities. We maintain the highest security standards."
    },
    {
      icon: Users,
      title: "Patient-Centered",
      description: "Every decision we make is focused on providing the best possible care for our patients."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from diagnosis to treatment and follow-up care."
    }
  ]

  const stats = [
    { number: "50,000+", label: "Patients Served" },
    { number: "200+", label: "Expert Doctors" },
    { number: "15+", label: "Years Experience" },
    { number: "99%", label: "Patient Satisfaction" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 w-full flex items-center justify-center rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#435ba1] via-[#4c69c6] to-[#43d5cb]"></div>
        
        <div className="relative z-10 max-w-4xl px-6 lg:px-16 text-center">
          <header>
            <h1 className="text-[#43d5cb] text-xl pb-3 tracking-widest font-medium">
              About HealthCave
            </h1>
            <h1 className="text-3xl lg:text-5xl font-light text-white leading-tight mb-6">
              Your Trusted Partner in <br />
              <span className="font-semibold">Healthcare Excellence</span>
            </h1>
          </header>
          
          <p className="text-base lg:text-lg text-[#fafafa] max-w-2xl mx-auto leading-relaxed">
            At HealthCave, we believe that quality healthcare should be accessible, 
            compassionate, and personalized. Our mission is to revolutionize healthcare 
            delivery through innovation and unwavering commitment to patient care.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <article className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                  <Target className="h-8 w-8 text-[#435ba1]" />
                </div>
                <h2 className="text-2xl font-bold text-[#515151] dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                To provide accessible, high-quality healthcare services that empower individuals 
                to lead healthier lives. We are committed to breaking down barriers to healthcare 
                access and delivering personalized, compassionate care to every patient we serve.
              </p>
            </article>

            <article className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-[#43d5cb] bg-opacity-10 mr-4">
                  <Eye className="h-8 w-8 text-[#435ba1]" />
                </div>
                <h2 className="text-2xl font-bold text-[#515151] dark:text-white">Our Vision</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                To be the leading healthcare platform that transforms how people access and 
                experience medical care. We envision a future where quality healthcare is 
                universally accessible, technology-enhanced, and truly patient-centered.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#435ba1] to-[#4c69c6] rounded-xl p-8">
            <header className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
              <p className="text-[#fafafa] text-lg">
                Numbers that reflect our commitment to healthcare excellence
              </p>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[#fafafa] text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#515151] dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at HealthCave
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <article key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-[#43d5cb] bg-opacity-10">
                    <value.icon className="h-8 w-8 text-[#435ba1]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#515151] dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <header className="mb-8">
                <h2 className="text-3xl font-bold text-[#515151] dark:text-white mb-4">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Founded with a vision to transform healthcare delivery
                </p>
              </header>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#43d5cb] rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#515151] dark:text-white mb-2">
                      Founded in 2009
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      HealthCave was established by a team of passionate healthcare professionals 
                      who recognized the need for more accessible and patient-centered care.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#43d5cb] rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#515151] dark:text-white mb-2">
                      Technology Integration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We pioneered the integration of cutting-edge technology with traditional 
                      healthcare practices to improve patient outcomes and experience.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#43d5cb] rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#515151] dark:text-white mb-2">
                      Community Impact
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Today, we serve thousands of patients across multiple communities, 
                      maintaining our commitment to excellence and innovation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-[#435ba1] to-[#43d5cb] rounded-xl p-8 text-white">
                <div className="text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-[#fafafa]" />
                  <h3 className="text-2xl font-bold mb-4">Award-Winning Care</h3>
                  <p className="text-[#fafafa] mb-6">
                    Recognized by the Healthcare Excellence Awards for outstanding 
                    patient care and innovative healthcare solutions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">2023</div>
                      <div className="text-sm text-[#fafafa]">Best Healthcare Platform</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">2022</div>
                      <div className="text-sm text-[#fafafa]">Patient Care Excellence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#515151] dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Our dedicated healthcare professionals are committed to providing you with the best possible care
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <article key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#43d5cb] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {member.experience}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-[#515151] dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-[#435ba1] font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.specialty}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-[#435ba1] via-[#4c69c6] to-[#43d5cb] rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-[#fafafa] text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who trust HealthCave for their healthcare needs. 
              Schedule your appointment today and discover the difference quality care makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-[#515151] hover:bg-[#fafafa] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule Appointment
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#515151] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
