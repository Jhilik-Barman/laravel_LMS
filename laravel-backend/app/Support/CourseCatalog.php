<?php

namespace App\Support;

final class CourseCatalog
{
    public static function all(): array
    {
        return [
            [
                'slug' => 'frontend-development',
                'title' => 'Frontend Development',
                'fee' => 890,
                'technologies' => ['HTML', 'CSS', 'JavaScript', 'React'],
                'description' => 'Learn modern frontend development with HTML, CSS, JavaScript, React, and component-driven UI design.',
                'duration' => '3 Months',
                'syllabus' => [
                    'HTML structure, semantic markup, and accessible forms',
                    'CSS fundamentals, responsive layouts, and modern styling',
                    'JavaScript syntax, DOM interaction, and asynchronous code',
                    'React components, props, state, and hooks',
                    'Routing, API integration, and deployment of a frontend project',
                ],
                'key_features' => [
                    'Hands-on interface-building exercises',
                    'Responsive design practice for mobile and desktop',
                    'Portfolio-ready frontend project',
                ],
                'learning_outcomes' => [
                    'Build responsive pages with semantic HTML and CSS',
                    'Add interactive behavior using JavaScript',
                    'Create reusable React components and connect to APIs',
                ],
                'benefits' => [
                    'Develop practical skills for frontend development roles',
                    'Build projects to demonstrate your work',
                    'Certificate awarded by Corporates Guide',
                    'Placement support',
                ],
                'certificate' => true,
                'placement_support' => true,
                'image' => '/images/frontend-course-banner.png',
            ],
            [
                'slug' => 'backend-development',
                'title' => 'Backend Development',
                'fee' => 2000,
                'technologies' => ['PHP', 'Laravel', 'REST APIs', 'Databases'],
                'description' => 'Build scalable APIs, work with databases, and develop server-side logic with Laravel and PHP.',
                'duration' => '4 Months',
                'syllabus' => [
                    'PHP fundamentals, control flow, and object-oriented programming',
                    'Relational database concepts and SQL',
                    'Laravel routing, controllers, validation, and middleware',
                    'Eloquent models, relationships, and database migrations',
                    'REST API design, authentication, testing, and deployment',
                ],
                'key_features' => [
                    'Practical server-side application exercises',
                    'Database-backed API development',
                    'Portfolio-ready backend project',
                ],
                'learning_outcomes' => [
                    'Write structured PHP application code',
                    'Build Laravel APIs connected to a relational database',
                    'Apply validation, authentication, and testing fundamentals',
                ],
                'benefits' => [
                    'Develop practical skills for backend development roles',
                    'Learn a complete workflow from database to API',
                    'Certificate awarded by Corporates Guide',
                    'Placement support',
                ],
                'certificate' => true,
                'placement_support' => true,
                'image' => '/images/backend-course-banner.png',
            ],
            [
                'slug' => 'full-stack-development',
                'title' => 'Full Stack Development',
                'fee' => 5000,
                'technologies' => ['HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Laravel', 'Databases'],
                'description' => 'Master both frontend and backend engineering and ship end-to-end products with confidence.',
                'duration' => '6 Months',
                'syllabus' => [
                    'Semantic HTML, CSS, responsive layouts, and accessibility',
                    'JavaScript fundamentals and asynchronous programming',
                    'React components, hooks, routing, and API integration',
                    'PHP fundamentals and Laravel application structure',
                    'Relational databases, SQL, migrations, and Eloquent',
                    'Full-stack authentication, testing, integration, and deployment',
                ],
                'key_features' => [
                    'End-to-end frontend and backend project practice',
                    'Integration between React interfaces and Laravel APIs',
                    'Portfolio-ready full-stack application',
                ],
                'learning_outcomes' => [
                    'Build responsive user interfaces with React',
                    'Create backend services and APIs using Laravel',
                    'Connect application layers to a relational database',
                    'Test and deploy a complete web application',
                ],
                'benefits' => [
                    'Build a broad foundation across web development',
                    'Create an end-to-end project for your portfolio',
                    'Certificate awarded by Corporates Guide',
                    'Placement support',
                ],
                'certificate' => true,
                'placement_support' => true,
                'image' => '/images/fullstack-course.png',
            ],
            [
                'slug' => 'data-science',
                'title' => 'Data Science Bootcamp',
                'fee' => 1199,
                'technologies' => ['Python', 'Data Analysis', 'Dashboards'],
                'description' => 'Explore data analysis, Python, dashboards, and decision-making through practical projects.',
                'duration' => '3 Months',
                'syllabus' => [
                    'Python fundamentals and working with data',
                    'Data cleaning and preparation',
                    'Exploratory analysis and descriptive statistics',
                    'Data visualization and dashboard fundamentals',
                    'Practical analysis project and communicating findings',
                ],
                'key_features' => [
                    'Practice with real-world-style datasets',
                    'Hands-on analysis and visualization exercises',
                    'Portfolio-ready data project',
                ],
                'learning_outcomes' => [
                    'Use Python to load and prepare datasets',
                    'Summarize data to identify trends and patterns',
                    'Present findings with clear visualizations and dashboards',
                ],
                'benefits' => [
                    'Build a practical foundation in data analysis',
                    'Learn to communicate evidence-based findings',
                    'Certificate awarded by Corporates Guide',
                    'Placement support',
                ],
                'certificate' => true,
                'placement_support' => true,
                'image' => '/images/data-science-course.png',
            ],
            [
                'slug' => 'ui-ux-design',
                'title' => 'UI/UX Design',
                'fee' => 599,
                'technologies' => ['UI Design', 'UX Design', 'Wireframing', 'Prototyping'],
                'description' => 'Design interfaces that look beautiful, feel intuitive, and work seamlessly across devices.',
                'duration' => '2 Months',
                'syllabus' => [
                    'Design principles, layout, color, and typography',
                    'User research methods and audience needs',
                    'Information architecture and user flows',
                    'Wireframes and interactive prototypes',
                    'Usability testing, iteration, and design handoff',
                ],
                'key_features' => [
                    'User-centered design exercises',
                    'Wireframe and prototype practice',
                    'Portfolio-ready interface case study',
                ],
                'learning_outcomes' => [
                    'Translate user needs into clear interface flows',
                    'Create wireframes and interactive prototypes',
                    'Evaluate designs and improve them using feedback',
                ],
                'benefits' => [
                    'Build foundational skills for UI/UX design work',
                    'Practice communicating design decisions',
                    'Certificate awarded by Corporates Guide',
                ],
                'certificate' => true,
                'placement_support' => false,
                'image' => '/images/ui-ux-course.png',
            ],
            [
                'slug' => 'digital-marketing',
                'title' => 'Digital Marketing',
                'fee' => 1200,
                'technologies' => ['SEO', 'Marketing Funnels', 'Analytics', 'Customer Engagement'],
                'description' => 'Grow brands online with marketing funnels, analytics, SEO, and customer engagement strategies.',
                'duration' => '2 Months',
                'syllabus' => [
                    'Digital marketing fundamentals and audience research',
                    'Search engine optimization and keyword planning',
                    'Content strategy and campaign planning',
                    'Marketing funnels and customer engagement',
                    'Analytics fundamentals and campaign measurement',
                ],
                'key_features' => [
                    'Practical campaign planning exercises',
                    'Search and analytics fundamentals',
                    'Portfolio-ready marketing plan',
                ],
                'learning_outcomes' => [
                    'Plan campaigns around audience and business goals',
                    'Apply introductory SEO and content principles',
                    'Use analytics concepts to evaluate campaign performance',
                ],
                'benefits' => [
                    'Build a foundation for digital marketing roles',
                    'Learn to plan and measure online campaigns',
                    'Certificate awarded by Corporates Guide',
                ],
                'certificate' => true,
                'placement_support' => false,
                'image' => '/images/digital-marketing-course.png',
            ],
        ];
    }

    public static function find(string $slug): ?array
    {
        foreach (self::all() as $course) {
            if ($course['slug'] === $slug) {
                return $course;
            }
        }

        return null;
    }
}
