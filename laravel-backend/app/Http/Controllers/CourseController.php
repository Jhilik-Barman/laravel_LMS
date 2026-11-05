<?php

namespace App\Http\Controllers;

use App\Support\CourseCatalog;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(CourseCatalog::all());
    }
}
