Build a complete browser-based tool website in pure HTML, CSS, and JavaScript inspired by an online alarm clock tool like vClock, but make it original, polished, production-ready, and launch-ready.

The website must run fully in the browser with no backend required. Everything should work from a single main HTML entry point and should be easy to deploy on static hosting like Vercel, Netlify, or GitHub Pages.

GOAL:
Create a full-featured online time utility website with a primary focus on Alarm Clock, and also include Timer, Stopwatch, Clock, and related useful utilities in the same product. The product should feel like a real launchable SaaS-style utility website, not a toy demo.

TECH STACK:
- HTML5
- CSS3
- Vanilla JavaScript only
- No frameworks
- No backend
- No localStorage if sandbox restrictions matter; use an in-memory store with an abstraction layer, but if normal browser environment is assumed, support localStorage persistence gracefully
- Fully responsive
- Accessible
- Fast and lightweight

CORE PRODUCT NAME:
Create a neutral original brand name, logo text/SVG, favicon, and clean design system.

MAIN PRODUCT IDEA:
A browser-based time tools website that includes:
1. Alarm Clock
2. Countdown Timer
3. Stopwatch
4. Current Digital Clock
5. Fullscreen Clock Mode
6. World Clock
7. Quick Preset Alarms
8. Multi-alarm management
9. Theme and appearance customization
10. Alarm sound selection and testing

IMPORTANT:
Do not create a basic single alarm page only. Build a complete mini-product with all major utility features users expect from a polished online alarm/time tools website.

========================
PRODUCT REQUIREMENTS
========================

1. GLOBAL APP REQUIREMENTS
- Single-page application feel using sections/tabs/hash routing
- Must work on desktop, tablet, and mobile
- Clean modern UI
- Light mode and dark mode
- Theme toggle in header
- Sticky header
- Fast switching between tools
- Keyboard accessible
- Semantic HTML
- Beautiful typography
- No external dependency required for core logic
- Use modular JavaScript structure
- Add comments only where useful
- Code should be clean enough for future scaling

2. HEADER / NAVIGATION
Create a top navigation with:
- Brand logo / SVG mark
- Nav links: Alarm, Timer, Stopwatch, Clock, World Clock, Settings
- Theme toggle
- Fullscreen button
- Mobile menu for small screens

3. LANDING / HERO SECTION
Build a useful homepage hero section with:
- Live current time display
- Current date and day
- Short product tagline
- Quick actions:
  - Set Alarm
  - Start Timer
  - Open Stopwatch
  - Fullscreen Clock
- A clean card-based layout
- Optional small feature highlights

4. ALARM CLOCK MODULE
This is the primary feature and must be the most polished module.

Include all of the following:
- Set alarm by hour and minute
- Support 12-hour and 24-hour format
- AM/PM selection in 12-hour mode
- Alarm label/message input
- Alarm sound dropdown
- Test sound button
- Alarm volume slider
- Set alarm button
- Reset/Clear alarm button
- Show active alarm countdown
- Show exact scheduled alarm time
- Show “next alarm in X hours Y minutes”
- Trigger alarm popup/modal when time is reached
- Visual ringing state
- Audio ringing state
- Stop button
- Snooze button
- Configurable snooze duration options: 5, 10, 15 minutes
- Ability to create multiple alarms
- Alarm list UI
- Enable/disable each alarm
- Delete each alarm
- Edit each alarm
- Repeat options:
  - Once
  - Daily
  - Weekdays
  - Weekends
  - Custom days selection
- Quick preset alarm buttons for common times
- Validation for past time behavior
- If selected time for today has passed, intelligently schedule for next valid occurrence
- Display alarm status clearly:
  - Active
  - Snoozed
  - Ringing
  - Expired / completed
- Add browser notification support if permissions are granted
- Add optional vibration support if available on supported devices
- Add tab title update when alarm is close or ringing
- Make alarm work as reliably as possible while tab is open

5. TIMER MODULE
Build a full countdown timer tool with:
- Hour / minute / second input
- Preset timer chips:
  - 1 min
  - 5 min
  - 10 min
  - 15 min
  - 25 min
  - 30 min
  - 45 min
  - 1 hour
- Start button
- Pause button
- Resume button
- Reset button
- Circular or linear progress visualization
- Remaining time display
- Completion alert sound
- Completion popup
- Repeat timer option
- Timer label input
- Ability to save multiple quick presets in code
- Timer end timestamp display

6. STOPWATCH MODULE
Build a high-quality stopwatch with:
- Start
- Pause
- Resume
- Reset
- Lap button
- Millisecond precision display
- Laps list
- Fastest lap highlight
- Slowest lap highlight
- Export laps as text or CSV download
- Keyboard shortcut support if possible

7. DIGITAL CLOCK MODULE
Build a current time display module with:
- Large live digital clock
- Day / date display
- 12/24-hour toggle
- Seconds show/hide toggle
- Blinking separator effect
- Fullscreen display mode
- Compact and ambient mode options
- Option to customize:
  - font size
  - text color
  - background style
- Optional soft background gradient or clean minimal style
- Auto refresh every second

8. FULLSCREEN CLOCK MODE
Create a distraction-free fullscreen mode:
- Large clock centered on screen
- Date display
- Minimal controls
- Exit fullscreen button
- Optional floating settings
- Ideal for desk / classroom / focus usage

9. WORLD CLOCK MODULE
Create a world clock utility with:
- Searchable timezone/city list
- Add multiple cities
- Remove city
- Show local time for each city
- Show GMT offset
- Show whether day or night
- Show time difference relative to user
- Include a few default cities:
  - New York
  - London
  - Dubai
  - Kolkata
  - Tokyo
  - Sydney

10. SETTINGS / CUSTOMIZATION PANEL
Create a settings section with:
- Theme mode
- Time format toggle
- Default alarm sound
- Default snooze duration
- Show seconds toggle
- Reduce motion toggle
- Clock text size control
- Accent color selection
- Alarm popup style preference
- Auto fullscreen preference for clock mode
- Save preferences abstraction layer

11. SOUND SYSTEM
Create a robust client-side sound system:
- Include multiple built-in alarm sounds generated via:
  - small audio files OR
  - Web Audio API fallback beeps
- Sound options like:
  - Beep
  - Bell
  - Digital alarm
  - Soft chime
- Test sound feature
- Volume control
- Graceful fallback if autoplay restrictions apply
- Show message guiding user to interact with page if browser blocks sound

12. NOTIFICATIONS
Add optional browser notifications:
- Ask notification permission politely
- Notify when alarm rings or timer finishes
- Handle permission denied gracefully

13. DATA / STATE MANAGEMENT
Use a clean state architecture:
- App state for settings
- Alarm state list
- Timer state
- Stopwatch state
- World clock selected cities
- UI state
Structure JavaScript into modular objects or classes.

14. HASH ROUTING / SECTION NAVIGATION
Use hash-based navigation such as:
- #home
- #alarm
- #timer
- #stopwatch
- #clock
- #world-clock
- #settings
Make nav links switch sections smoothly.

15. UI / UX REQUIREMENTS
The interface must feel polished and launch-ready:
- Responsive cards
- Good spacing
- Clear typography
- Nice buttons and hover/focus states
- Proper empty states
- Helpful inline validation
- Smooth transitions
- No clutter
- Primary CTA emphasis
- Mobile-first usability
- Touch-friendly controls
- Nice alarm list cards
- Modern clean dashboard feel

16. ACCESSIBILITY
Include:
- Proper labels
- ARIA where needed
- Focus styles
- Keyboard navigation
- Sufficient contrast
- Screen-reader friendly alarm status text
- Buttons not just icon-only unless labeled

17. PERFORMANCE
- Efficient intervals
- Avoid memory leaks
- Use requestAnimationFrame where useful
- Avoid heavy unnecessary re-renders
- Keep bundle simple
- No giant dependencies

18. EDGE CASES TO HANDLE
- Alarm set for a time already passed today
- Browser audio autoplay restriction
- Notification permission blocked
- Fullscreen not supported
- Multiple alarms ringing together
- Editing active alarm
- Snoozed alarm overlap
- Timer set to zero
- Stopwatch reset after laps
- App reload persistence fallback
- Timezone formatting differences
- Browser tab inactive behavior
- Reduced motion preference
- Very small mobile screens

19. FILE STRUCTURE
Create a simple project like:
- smart-time-tools.html
- optional assets/
  - sounds/
  - icons/
If possible keep everything in one HTML file with embedded CSS and JS for easy deployment, but organize code clearly.

20. DESIGN DIRECTION
Use a premium utility-app style design:
- Neutral, elegant surfaces
- Strong readable clock typography
- Minimal but not boring
- Dark/light modes
- Original SVG logo
- Responsive layout
- Clean cards
- Refined spacing system
- Accessible color contrast
- Optional subtle glass or soft elevated surfaces, but do not overdo effects

21. HOME PAGE CONTENT BLOCKS
Add these sections:
- Hero with live time
- Tool cards grid
- Why use this tool
- Main features
- Tips / usage notes
- Footer with links
This should make the app feel like a real launchable product website, not just a utility panel.

22. FOOTER
Include:
- Brand
- Quick links
- Tools links
- Privacy note
- “Runs fully in your browser” type trust message

23. SEO / META
Include:
- Proper title
- Meta description
- Open graph basic tags
- Theme color
- Favicon support
- Good heading hierarchy

24. JAVASCRIPT IMPLEMENTATION DETAILS
Implement:
- Clock update loop
- Alarm scheduler
- Timer engine
- Stopwatch engine
- Notification helpers
- Sound helpers
- Fullscreen helper
- Formatting helpers
- Router
- UI rendering helpers

25. ALARM LOGIC DETAILS
Alarm logic should:
- Compare current time every second
- Support repeat day matching
- Track unique alarm IDs
- Prevent duplicate triggers in same minute
- Support snooze by creating temporary next ring time
- Preserve disabled alarms without deleting them
- Allow one-time alarms to auto-complete after ringing
- Correctly compute next trigger timestamp

26. TIMER LOGIC DETAILS
Timer logic should:
- Store target end time
- Work correctly after pause/resume
- Display remaining time precisely
- Fire completion only once
- Support restart

27. STOPWATCH LOGIC DETAILS
Stopwatch logic should:
- Use high precision timing
- Track elapsed time correctly across pause/resume
- Render lap times efficiently
- Compute lap deltas

28. WORLD CLOCK DETAILS
World clock should:
- Use Intl.DateTimeFormat where possible
- Avoid external APIs if possible
- Use browser-supported timezones
- Offer searchable timezone picker

29. SETTINGS PERSISTENCE
If browser environment allows:
- Persist settings and alarms using localStorage
If storage is unavailable:
- Fail gracefully without breaking the app

30. VISUAL FEEDBACK
Include:
- Toasts or inline notices
- Ringing modal
- Empty states
- Active chips
- Status badges
- Progress indicators

31. SECURITY / ROBUSTNESS
- No unsafe HTML injection
- Sanitize user-entered labels
- Avoid eval
- Keep logic defensive

32. DELIVERABLES
Output complete code for:
- One final HTML file
- Embedded CSS
- Embedded JavaScript
The result should be directly runnable by opening the file in a browser.

33. IMPORTANT OUTPUT FORMAT
Return the answer in this exact structure:
1. Project overview
2. Feature list
3. File structure
4. Full final HTML code
5. Notes for future improvements

34. CODE QUALITY EXPECTATION
The final code must be:
- Real working code
- Not pseudo-code
- Not partial
- Not a skeleton
- Not TODO-based
- Ready to run
- Clean enough to extend later

35. DO NOT
- Do not use React, Vue, Angular, or backend code
- Do not leave fake buttons
- Do not leave unimplemented placeholder sections
- Do not rely on server APIs for core features
- Do not generate generic ugly UI
- Do not output only a plan; output real code

Now generate the complete final result.