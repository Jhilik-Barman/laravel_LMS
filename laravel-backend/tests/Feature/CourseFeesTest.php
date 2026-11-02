<?php

namespace Tests\Feature;

use Tests\TestCase;

class CourseFeesTest extends TestCase
{
    public function test_courses_include_their_configured_fees(): void
    {
        $response = $this->getJson('/api/courses');

        $response
            ->assertOk()
            ->assertJsonPath('0.slug', 'frontend-development')
            ->assertJsonPath('0.fee', 890)
            ->assertJsonPath('1.slug', 'backend-development')
            ->assertJsonPath('1.fee', 2000)
            ->assertJsonPath('2.slug', 'full-stack-development')
            ->assertJsonPath('2.fee', 5000)
            ->assertJsonPath('3.slug', 'data-science')
            ->assertJsonPath('3.fee', 1199)
            ->assertJsonPath('4.slug', 'ui-ux-design')
            ->assertJsonPath('4.fee', 599)
            ->assertJsonPath('5.slug', 'digital-marketing')
            ->assertJsonPath('5.fee', 1200);
    }

    public function test_courses_include_detailed_content_for_the_details_view(): void
    {
        $courses = $this->getJson('/api/courses')
            ->assertOk()
            ->json();

        foreach ($courses as $course) {
            $this->assertIsArray($course['technologies']);
            $this->assertNotEmpty($course['technologies']);
            $this->assertNotEmpty($course['duration']);
            $this->assertNotEmpty($course['description']);

            foreach (['syllabus', 'key_features', 'learning_outcomes', 'benefits'] as $section) {
                $this->assertIsArray($course[$section], "{$course['slug']} is missing {$section}.");
                $this->assertNotEmpty($course[$section], "{$course['slug']} has no {$section}.");
            }
        }
    }
}
