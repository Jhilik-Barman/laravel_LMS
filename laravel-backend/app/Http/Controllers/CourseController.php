<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'slug' => 'frontend-development',
                'title' => 'Frontend Development',
                'description' => 'Learn modern frontend development with HTML, CSS, JavaScript, React, and component-driven UI design.',
                'duration' => '3 Months',
                'certificate' => true,
                'placement_support' => true,
                'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'slug' => 'backend-development',
                'title' => 'Backend Development',
                'description' => 'Build scalable APIs, work with databases, and develop server-side logic with Laravel and PHP.',
                'duration' => '4 Months',
                'certificate' => true,
                'placement_support' => true,
                'image' => 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'slug' => 'full-stack-development',
                'title' => 'Full Stack Development',
                'description' => 'Master both frontend and backend engineering and ship end-to-end products with confidence.',
                'duration' => '6 Months',
                'certificate' => true,
                'placement_support' => true,
                'image' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'slug' => 'data-science',
                'title' => 'Data Science Bootcamp',
                'description' => 'Explore data analysis, Python, dashboards, and decision-making through practical projects.',
                'duration' => '3 Months',
                'certificate' => true,
                'placement_support' => true,
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'slug' => 'ui-ux-design',
                'title' => 'UI/UX Design',
                'description' => 'Design interfaces that look beautiful, feel intuitive, and work seamlessly across devices.',
                'duration' => '2 Months',
                'certificate' => true,
                'placement_support' => false,
                'image' => 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'slug' => 'digital-marketing',
                'title' => 'Digital Marketing',
                'description' => 'Grow brands online with marketing funnels, analytics, SEO, and customer engagement strategies.',
                'duration' => '2 Months',
                'certificate' => true,
                'placement_support' => false,
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            ],
        ]);
    }
}
