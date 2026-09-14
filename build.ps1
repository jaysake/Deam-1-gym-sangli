$html = Get-Content -Raw -Path 'public/main.html' -Encoding UTF8

# Extract parts using regex
$headerPattern = '(?s)^(.*?)<main[^>]*>'
$footerPattern = '(?s)(</main>.*)$'

$header = [regex]::Match($html, $headerPattern).Groups[1].Value + '<main class="w-full pt-28 bg-surface min-h-screen"><div class="flex flex-col w-full">'
$footer = "</div>" + [regex]::Match($html, $footerPattern).Groups[1].Value

# Extract sections
# 1. Hero
$hero = [regex]::Match($html, '(?s)<!-- HERO SECTION -->(.*?)<!-- BRAND RECOGNITION BANNER -->').Groups[0].Value
# 2. Brand
$brand = [regex]::Match($html, '(?s)<!-- BRAND RECOGNITION BANNER -->(.*?)<!-- FACILITY & ARENA SHOWCASE SECTION -->').Groups[0].Value
# 3. Zones
$zones = [regex]::Match($html, '(?s)<!-- FACILITY & ARENA SHOWCASE SECTION -->(.*?)<!-- PROGRAMS & TRAINING DISCIPLINES -->').Groups[0].Value
# 4. Programs
$programs = [regex]::Match($html, '(?s)<!-- PROGRAMS & TRAINING DISCIPLINES -->(.*?)<!-- MEMBERSHIP & PRICING PLANS -->').Groups[0].Value
# 5. Pricing
$pricing = [regex]::Match($html, '(?s)<!-- MEMBERSHIP & PRICING PLANS -->(.*?)<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->').Groups[0].Value
# 6. Contact
$contact = [regex]::Match($html, '(?s)<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->(.*?)</div></main>').Groups[1].Value

# Modify Contact Section to point to backend
$contact = $contact -replace '<form class="space-y-space-md" id="trial-form"[^>]*>', '<form class="space-y-space-md" id="trial-form" method="POST" action="/api/contact" onsubmit="event.preventDefault(); fetch(''/api/contact'', { method: ''POST'', body: JSON.stringify({ fullName: this.elements[0].value, phone: this.elements[1].value, goal: this.elements[2].value, timeSlot: this.elements[3].value }), headers: { ''Content-Type'': ''application/json'' } }).then(() => document.getElementById(''success-message'').classList.remove(''hidden''));">'

# Create Schedule block
$schedule = @"
<!-- SCHEDULE & TIME INCLUSIVE -->
<section class="w-full bg-surface-container-lowest py-space-2xl">
    <div class="w-full px-gutter lg:px-space-xl">
        <div class="text-center max-w-3xl mx-auto mb-space-2xl">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary-container mb-space-xs block">Operational Schedule</span>
            <h2 class="font-headline-xl text-headline-xl text-on-surface uppercase">Class Timetable & Floor Hours</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant">Train on your time. Over 30+ instructor-led sessions a week.</p>
        </div>
        
        <div class="overflow-x-auto rounded-xl shadow-lg border border-surface-container-high bg-surface-container">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-surface-container-high text-on-surface uppercase font-label-lg tracking-wider">
                        <th class="p-4 border-b border-surface-variant">Time</th>
                        <th class="p-4 border-b border-surface-variant">Monday</th>
                        <th class="p-4 border-b border-surface-variant">Wednesday</th>
                        <th class="p-4 border-b border-surface-variant">Friday</th>
                        <th class="p-4 border-b border-surface-variant">Weekend</th>
                    </tr>
                </thead>
                <tbody class="text-body-md text-on-surface-variant">
                    <tr class="hover:bg-surface-container-low transition-colors">
                        <td class="p-4 border-b border-surface-variant font-bold text-primary">06:00 AM</td>
                        <td class="p-4 border-b border-surface-variant">CrossFit WOD</td>
                        <td class="p-4 border-b border-surface-variant">CrossFit WOD</td>
                        <td class="p-4 border-b border-surface-variant">HIIT Cardio</td>
                        <td class="p-4 border-b border-surface-variant text-secondary-container">Open Turf</td>
                    </tr>
                    <tr class="hover:bg-surface-container-low transition-colors">
                        <td class="p-4 border-b border-surface-variant font-bold text-primary">10:00 AM</td>
                        <td class="p-4 border-b border-surface-variant">Powerlifting Base</td>
                        <td class="p-4 border-b border-surface-variant">Olympic Lifts</td>
                        <td class="p-4 border-b border-surface-variant">Active Recovery</td>
                        <td class="p-4 border-b border-surface-variant text-secondary-container">Open Turf</td>
                    </tr>
                    <tr class="hover:bg-surface-container-low transition-colors">
                        <td class="p-4 border-b border-surface-variant font-bold text-primary">05:00 PM</td>
                        <td class="p-4 border-b border-surface-variant">Hypertrophy Chest/Back</td>
                        <td class="p-4 border-b border-surface-variant">Hypertrophy Legs</td>
                        <td class="p-4 border-b border-surface-variant">Hypertrophy Arms</td>
                        <td class="p-4 border-b border-surface-variant text-secondary-container">Closed</td>
                    </tr>
                    <tr class="hover:bg-surface-container-low transition-colors">
                        <td class="p-4 border-b border-surface-variant font-bold text-primary">07:30 PM</td>
                        <td class="p-4 border-b border-surface-variant">CrossFit WOD</td>
                        <td class="p-4 border-b border-surface-variant">CrossFit WOD</td>
                        <td class="p-4 border-b border-surface-variant">Metabolic Engine</td>
                        <td class="p-4 border-b border-surface-variant text-secondary-container">Closed</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
"@

# Update main.html (keep all but contact maybe? Or keep all for a landing page feel, but let's replace contact form action too)
$mainContent = $header + $hero + $brand + $zones + $programs + $pricing + "<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->" + $contact + $footer
Set-Content -Path 'public/main.html' -Value $mainContent -Encoding UTF8

# membership.html (pricing + programs + contact)
$membershipContent = $header + $pricing + $programs + "<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->" + $contact + $footer
Set-Content -Path 'public/membership.html' -Value $membershipContent -Encoding UTF8

# schedule.html (schedule + contact)
$scheduleContent = $header + $schedule + "<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->" + $contact + $footer
Set-Content -Path 'public/schedule.html' -Value $scheduleContent -Encoding UTF8

# contact.html (contact only)
$contactContent = $header + "<!-- SANGLI LOCATION, CONTACT & TRIAL FORM -->" + $contact + $footer
Set-Content -Path 'public/contact.html' -Value $contactContent -Encoding UTF8

Write-Output "Pages built successfully."
