export const determineUserRole = async (session) => {
    if (!session?.user) return 'user'

    // Check if role is already in session and valid
    if (session.user.role && ['admin', 'doctor', 'user'].includes(session.user.role)) {
        return session.user.role
    }

    // Fallback role determination (should rarely be needed with improved JWT callback)
    try {
        // Check if user is admin first
        const adminEmails = [
            'admin@healthcave.com',
            'admin@example.com',
            'admin@gmail.com'
        ]

        if (adminEmails.includes(session.user.email)) {
            return 'admin'
        }

        // Check if user is a doctor via API
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            const doctors = await response.json()
            const isDoctor = doctors.some(doctor => doctor.email === session.user.email)
            
            if (isDoctor) {
                return 'doctor'
            }
        }

        // Default to user
        return 'user'
    } catch (error) {
        console.error('Error determining user role:', error)
        return session.user.role || 'user' // Use session role or default to user
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

    const userItems = [
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
        case 'user':
            roleItems = userItems
            break
        default:
            roleItems = userItems
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
        case 'user':
            return {
                title: 'User Dashboard',
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