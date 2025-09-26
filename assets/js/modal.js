document.addEventListener('DOMContentLoaded', () => {
    const serviceItems = document.querySelectorAll('.dcp-services-list li');
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.dcp-modal-close-btn');

    // Descriptions para sa VA Services page
    const vaServiceDescriptions = {
        'email-calendar-management': {
            title: 'Email & Calendar Management',
            description: `Stay on top of your day with our organized approach to email and scheduling. We manage your inbox, filter important messages, and keep your calendar updated so you never miss a meeting, deadline, or opportunity.`
        },
        'customer-support': {
            title: 'Customer Support',
            description: `Build stronger relationships with your clients through friendly and professional communication. Whether it’s via phone, email, or chat, we provide prompt support that represents your business with care and reliability.`
        },
        'data-entry': {
            title: 'Data Entry & Record Keeping',
            description: `Accuracy matters. We handle data entry and record management with precision, ensuring your business information is always up to date, well-organized, and easy to access when you need it.`
        },
        'scheduling': {
            title: 'Scheduling & Appointment Setting',
            description: `Save time and reduce stress with seamless appointment coordination. We take care of scheduling meetings, managing cancellations, and sending reminders, so your day runs smoothly.`
        },
        'document-preparation': {
            title: 'Document Preparation',
            description: `From drafting and formatting to proofreading, we deliver professional documents tailored to your business needs. Whether it’s reports, presentations, or contracts, we make sure your files look polished and error-free.`
        },
        'social-media-assistance': {
            title: 'Social Media Assistance',
            description: `Keep your brand active and engaging online. We provide light management of posts, scheduling, and community engagement, helping you maintain a consistent presence across your social media platforms.`
        },
        'customized-admin-tasks': {
            title: 'Customized Admin Tasks',
            description: `We understand that every business is unique. Our team is flexible and can be trained to handle a wide range of administrative tasks, from complex research to project coordination, giving you the tailored support you need.`
        }
    };

    // Descriptions para sa Janitorial Services page
    const janitorialServiceDescriptions = {
        'restroom-cleaning': {
            title: 'Restroom Maintenance Services',
            description: `Your restroom's cleanliness speaks volumes about your entire facility. Our skilled cleaning team ensures your restrooms are spotless and well-maintained, providing a fresh and hygienic experience for your customers and clients.`
        },
        'workstation-cleaning': {
            title: 'Workstation Cleaning Services',
            description: `A clean workspace boosts productivity and focus. Say goodbye to dusty monitors and crumb-filled keyboards—our team ensures a consistently spotless workstation, so you can concentrate on what truly matters: your work.`
        },
        'staff-room-cleaning': {
            title: 'Staff Room Cleaning Services',
            description: `A staff room should be a clean and comfortable retreat for employees. We eliminate unsanitized tables, dirty windowsills, and dust buildup, ensuring a fresh and inviting space. With your preferred cleaning solutions, we create an environment your team will appreciate.`
        },
        'kitchen-cleaning': {
            title: 'Kitchen Area Cleaning Services',
            description: `A clean kitchen is essential for health and safety. Bacteria can linger on food, utensils, and countertops—wiping alone isn’t enough. Our thorough cleaning process, using high-quality disinfectants, ensures all surfaces are sanitized, eliminating harmful germs and keeping your kitchen safe.`
        },
        'dusting-disinfection': {
            title: 'Dusting & Disinfection Services',
            description: `Say goodbye to dust bunnies, cobwebs, and fine particles. With our specialized tools and top-quality disinfectants, we thoroughly clean and sanitize your space, leaving it fresh, spotless, and safe for you to enjoy.`
        },
        'floor-care': {
            title: 'Floor Cleaning Services – Vacuuming, Sweeping & Mopping',
            description: `Floors play a crucial role in both the appearance and air quality of your space. Our expertly trained team uses top-tier equipment to ensure spotless, dust-free floors, creating a healthier and more professional environment. Step into cleanliness every day—stress-free.`
        },
        'carpet-cleaning': {
            title: 'Carpet Cleaning',
            description: `Carpets in commercial spaces do more than just enhance the appearance of a workplace—they play a vital role in maintaining a healthy, professional, and welcoming environment. Let our expert team handle it for you!`
        },
        'trash-disposal': {
            title: 'Trash Disposal Services',
            description: `Maintaining a clean and clutter-free environment is essential for any business. Our trash disposal service ensures efficient and regular waste removal, keeping your space organized, hygienic, and ready for a productive day.`
        },
        'interior-exterior-cleaning': {
            title: 'Interior & Exterior Cleaning',
            description: `From the front door to the back office, we provide comprehensive cleaning services to keep your entire facility spotless. Our professional team is equipped to handle both interior spaces, ensuring a hygienic and organized workspace, and exterior areas, maintaining curb appeal and a professional appearance for all visitors.`
        }
    };

    let serviceDescriptions;

    // Titingnan kung alin sa dalawang page ang kasalukuyang nakabukas
    // Base sa title ng page.
    if (document.title.includes('Janitorial')) {
        serviceDescriptions = janitorialServiceDescriptions;
    } else {
        serviceDescriptions = vaServiceDescriptions;
    }

    // Modal logic - gumagana na para sa alinmang page
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            const serviceId = item.getAttribute('data-service-id');
            const service = serviceDescriptions[serviceId];
            if (service) {
                modalTitle.textContent = service.title;
                modalDescription.textContent = service.description;
                modal.style.display = 'block';
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});