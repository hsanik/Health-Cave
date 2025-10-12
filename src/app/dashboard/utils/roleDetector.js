import axios from 'axios'

export const determineUserRole = async (session) => {
    if (!session?.user) return 'patient'

    // Check if role is already in session
    if (session.user.role && session.user.role !== 'user') {
        return session.user.role
    }

    try {
        // Check if user is a doctor
        const doctorResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        )
        const isDoctor = doctorResponse.data.some(
            doctor => doctor.email === session.user.email
        )

        if (isDoctor) {
            return 'doctor'
        }

        // Check if user is admin (you can define admin emails or use a separate API)
        const adminEmails = [
            'admin@healthcave.com',
            'admin@example.com',
            'admin@gmail.com' // Add your admin emails here
        ]

        if (adminEmails.includes(session.user.email)) {
            return 'admin'
        }

        // Default to patient
        return 'patient'
    } catch (error) {
        console.error('Error determining user role:', error)
        return 'patient' // Default fallback
    }
}

export const getRoleBasedSidebarItems = (userRole) => {
    const commonItems = [
        { icon: 'Home', label: "Dashboard", href: "/dashboard" },
    ]

    const adminItems = [
        { icon: 'BookText', label: 'Doctor Applications', href: '/dashboard/makeDoctor' },
        { icon: 'SquareUserRound', label: 'Doctors', href: '/dashboard/doctorList' },
        { icon: 'UserSearch', label: 'All Users', href: '/dashboard/allUsers' },
        { icon: 'Users', label: "Patients", href: "/dashboard/patients" },
        { icon: 'Calendar', label: "All Appointments", href: "/dashboard/appointments" },
        { icon: 'BarChart3', label: "System Analytics", href: "/dashboard/analytics" },
    ]

    const doctorItems = [
        { icon: 'Calendar', label: "My Appointments", href: "/dashboard/appointments" },
        { icon: 'Clock', label: "Availability", href: "/dashboard/availability" },
        { icon: 'Users', label: "My Patients", href: "/dashboard/patients" },
        { icon: 'FileText', label: "Medical Records", href: "/dashboard/records" },
        { icon: 'MessageSquare', label: "Messages", href: "/dashboard/messages" },
        { icon: 'BarChart3', label: "Practice Analytics", href: "/dashboard/analytics" },
    ]

    const patientItems = [
        { icon: 'Calendar', label: "My Appointments", href: "/dashboard/appointments" },
        { icon: 'FileText', label: "Medical Records", href: "/dashboard/records" },
        { icon: 'MessageSquare', label: "Messages", href: "/dashboard/messages" },
    ]

    const profileItems = [
        { icon: 'Settings', label: "Profile", href: "/dashboard/profile" },
        { icon: 'House', label: "Back To Home", href: "/" },
    ]

    let roleItems = []
    switch (userRole) {
        case 'admin':
            roleItems = adminItems
            break
        case 'doctor':
            roleItems = doctorItems
            break
        case 'patient':
            roleItems = patientItems
            break
        default:
            roleItems = patientItems
    }

    return [...commonItems, ...roleItems, ...profileItems]
}

export const getRoleInfo = (userRole) => {
    switch (userRole) {
        case 'admin':
            return {
                title: 'Admin Dashboard',
                subtitle: 'Manage the entire HealthCave platform',
                icon: 'Shield',
                color: 'text-red-600',
                bgColor: 'bg-red-100'
            }
        case 'doctor':
            return {
                title: 'Doctor Dashboard',
                subtitle: 'Manage your practice and patients',
                icon: 'Stethoscope',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
            }
        case 'patient':
            return {
                title: 'Patient Dashboard',
                subtitle: 'Manage your health and appointments',
                icon: 'Heart',
                color: 'text-green-600',
                bgColor: 'bg-green-100'
            }
        default:
            return {
                title: 'Dashboard',
                subtitle: 'Welcome to HealthCave',
                icon: 'Home',
                color: 'text-gray-600',
                bgColor: 'bg-gray-100'
            }
    }
}