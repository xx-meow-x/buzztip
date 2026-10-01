// Sample data the app starts with, so there's something to show right away.
// Times are relative to "now" so the demo always looks current.
// Swap this out for API responses once the backend exists.
import { DATA_VERSION } from '../config'
import { COURSE_CATALOG, courseGroupId, getEnrolledCourses } from '../lib/enrollment'

export const DEMO_EMAIL = 'user@tip.edu.ph'
export const DEMO_PASSWORD = 'buzztip123'
const DEMO_HASH = 'ce01bceb425a52b214fe213100812e3b05bb046432cf5e1bbc91f965ee233855'

export const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#DB2777', '#D97706', '#0891B2', '#DC2626']

// Other students in the demo. They can't log in; they post, reply and sell things.
export const PEOPLE = [
  { id: 'p_maria', name: 'Maria Santos', color: '#DB2777' },
  { id: 'p_liam', name: 'Liam Reyes', color: '#2563EB' },
  { id: 'p_ana', name: 'Ana Reyes', color: '#7C3AED' },
  { id: 'p_carlo', name: 'Carlo Mendoza', color: '#0891B2' },
  { id: 'p_pia', name: 'Pia Torres', color: '#D97706' },
  { id: 'p_mark', name: 'Mark Lim', color: '#059669' },
  { id: 'p_james', name: 'James Aquino', color: '#2563EB' },
  { id: 'p_sofia', name: 'Sofia Garcia', color: '#DB2777' },
  { id: 'p_juan', name: 'Juan Dela Cruz', color: '#7C3AED' },
  { id: 'p_bea', name: 'Bea Lopez', color: '#DC2626' },
  { id: 'p_rico', name: 'Rico Dizon', color: '#059669' },
  { id: 'p_carl', name: 'Carl Alvarez', color: '#D97706' },
]

const DAY = 86_400_000
const at = (now, { d = 0, h = 0, m = 0 } = {}) => now - d * DAY - h * 3_600_000 - m * 60_000
// A date `days` from today at a given clock time
const onDay = (days, hh, mm = 0) => {
  const t = new Date()
  t.setDate(t.getDate() + days)
  t.setHours(hh, mm, 0, 0)
  return t.getTime()
}

export function createSeed() {
  const now = Date.now()
  const me = 'u_demo'
  const year = new Date().getFullYear()

  const users = [
    {
      id: me,
      name: 'User01234',
      email: DEMO_EMAIL,
      passHash: DEMO_HASH,
      label: 'Student',
      program: 'BS Computer Science',
      courses: getEnrolledCourses(),
      color: '#E2B93B',
      createdAt: at(now, { d: 30 }),
    },
  ]

  const groups = [
    { id: 'g_pt', name: 'Project Team', category: 'Academic', color: '#7C3AED', baseMembers: 4, memberIds: [me, 'p_maria', 'p_liam', 'p_juan'], description: 'CS 305 capstone group.' },
    { id: 'g_ah', name: 'Allied Health Society', category: 'Organization', color: '#059669', baseMembers: 121, memberIds: [me, 'p_maria', 'p_sofia'], description: 'Org for allied health students.' },
    { id: 'g_dt', name: 'Dance Troupe', category: 'Culture', color: '#D97706', baseMembers: 44, memberIds: ['p_pia', 'p_bea'], description: 'The official TIP dance troupe.' },
    { id: 'g_cs', name: 'Computer Society', category: 'Tech', color: '#2563EB', baseMembers: 207, memberIds: ['p_james', 'p_rico', 'p_carl'], description: 'Workshops, hackathons and tech talks.' },
    { id: 'g_cr', name: 'Campus Runners', category: 'Sports', color: '#DC2626', baseMembers: 66, memberIds: ['p_mark'], description: 'Weekend runs around the campus.' },
    { id: 'g_sc', name: 'Student Council', category: 'Governance', color: '#0891B2', baseMembers: 28, memberIds: [me, 'p_carlo'], description: 'Student government updates.' },
    // Course groups: membership comes from enrollment, not memberIds (see store/selectors.js)
    ...Object.entries(COURSE_CATALOG).map(([code, title], i) => ({
      id: courseGroupId(code),
      name: `${code} · ${title}`,
      shortName: code,
      category: 'Course',
      course: code,
      color: AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length],
      baseMembers: 38 + i * 7,
      memberIds: [],
      description: `Class group chat for ${code} ${title}. Created automatically for enrolled students.`,
    })),
  ]

  const msg = (from, text, when) => ({ id: Math.random().toString(36).slice(2, 9), from, text, at: when })

  const conversations = [
    { id: 'c_pt', type: 'group', groupId: 'g_pt', unread: 3, messages: [
      msg('p_maria', 'Hey, what time does the meeting start?', at(now, { h: 2, m: 30 })),
      msg(me, 'Starts at noon I think', at(now, { h: 2, m: 29 })),
      msg('p_liam', 'Yep, 12PM in Room 301', at(now, { h: 2, m: 28 })),
      msg(me, 'Cool! Thanks for confirming. See you there!', at(now, { h: 2, m: 27 })),
      msg('p_maria', 'Our meeting is moved to tomorrow at 10AM to address the current problems.', at(now, { m: 40 })),
      msg('p_juan', 'Can someone send the updated slides?', at(now, { m: 2 })),
    ] },
    { id: 'c_ah', type: 'group', groupId: 'g_ah', unread: 1, messages: [
      msg('p_sofia', 'Reminder: bring your membership forms.', at(now, { h: 1 })),
      msg('p_maria', 'Meeting moved to Thursday 4PM', at(now, { m: 15 })),
    ] },
    { id: 'dm_p_maria_u_demo', type: 'dm', memberIds: [me, 'p_maria'], unread: 0, messages: [
      msg(me, 'Here are my notes from Discrete Math', at(now, { h: 1, m: 10 })),
      msg('p_maria', 'Thanks for the notes!', at(now, { h: 1 })),
    ] },
    { id: 'c_course_cs301', type: 'group', groupId: courseGroupId('CS 301'), unread: 2, messages: [
      msg('p_james', 'Is the linked list lab due Friday or Monday?', at(now, { h: 3 })),
      msg('p_rico', 'Friday 11:59 PM according to the syllabus', at(now, { h: 2, m: 50 })),
    ] },
    { id: 'c_course_cs305', type: 'group', groupId: courseGroupId('CS 305'), unread: 0, messages: [
      msg('p_liam', 'Sir posted the SRS template in our class drive.', at(now, { d: 1, h: 2 })),
    ] },
    { id: 'c_course_math201', type: 'group', groupId: courseGroupId('MATH 201'), unread: 0, messages: [
      msg('p_bea', 'Anyone have a reviewer for proofs by induction?', at(now, { d: 1, h: 5 })),
    ] },
    { id: 'c_course_ge104', type: 'group', groupId: courseGroupId('GE 104'), unread: 0, messages: [
      msg('p_pia', 'Speech outlines are due next week.', at(now, { d: 2 })),
    ] },
    { id: 'c_sc', type: 'group', groupId: 'g_sc', unread: 0, messages: [
      msg('p_carlo', 'Minutes from last session are up.', at(now, { d: 1, h: 4 })),
    ] },
    { id: 'c_dt', type: 'group', groupId: 'g_dt', unread: 0, messages: [
      msg('p_pia', 'Rehearsal tomorrow at 6PM sharp', at(now, { h: 3 })),
    ] },
    { id: 'c_cs', type: 'group', groupId: 'g_cs', unread: 0, messages: [
      msg('p_james', 'The hackathon registration is now open', at(now, { h: 5 })),
    ] },
    { id: 'c_cr', type: 'group', groupId: 'g_cr', unread: 0, messages: [
      msg('p_mark', 'Sunday run: meet at the main gate, 5:30 AM.', at(now, { d: 1 })),
    ] },
  ]

  const midterm = onDay(13, 8)
  const fmt = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const announcements = [
    { id: 'a1', urgent: true, category: 'Academic', title: 'Midterm Examination Schedule', body: `Midterm exams run for one week starting ${fmt(midterm)}. Please check your department's schedule posted on the bulletin board and in your course group chats. Bring your validated registration form and school ID to every exam.`, by: 'Office of the Registrar', at: at(now, { h: 3 }), savedBy: [] },
    { id: 'a2', category: 'Finance', title: 'Investment Summit', body: 'The school investment summit is happening at the main auditorium. Registration is open to all year levels. Seats are limited to 300, so register early through the Student Affairs desk.', by: 'Finance Society', at: at(now, { h: 5 }), savedBy: [] },
    { id: 'a3', category: 'Academic', title: 'Adding and Dropping of Subjects', body: `The adding and dropping period closes on ${fmt(onDay(4, 17))}. Submit your request through your program chair. Late requests will not be processed.`, by: 'Office of the Registrar', at: at(now, { d: 1 }), savedBy: [] },
    { id: 'a4', category: 'Events', title: 'Org Fair Booth Applications', body: 'Recognized student organizations can now apply for a booth at the Org Fair. Each org gets one table and two chairs.', by: 'Student Affairs', at: at(now, { d: 2 }), savedBy: [] },
    { id: 'a5', category: 'Facilities', title: 'Library Hours Extended', body: 'The library will stay open until 9 PM on weekdays during midterms. Bring your school ID for entry after 6 PM.', by: 'Library Services', at: at(now, { d: 3 }), savedBy: [] },
  ]

  const events = [
    { id: 'e1', title: 'Intro to Git Workshop', category: 'Tech', at: onDay(2, 13), venue: 'Computer Lab 4', host: 'Computer Society', goingIds: ['p_james', 'p_rico'] },
    { id: 'e2', title: 'Investment Summit', category: 'Finance', at: onDay(8, 9), venue: 'Main Auditorium', host: 'Finance Society', goingIds: [me, 'p_sofia'] },
    { id: 'e3', title: 'Dance Troupe Showcase', category: 'Culture', at: onDay(10, 18), venue: 'Gymnasium', host: 'Dance Troupe', goingIds: ['p_pia'] },
    { id: 'e4', title: 'Organization Fair', category: 'Social', at: onDay(23, 8), venue: 'Campus Grounds', host: 'Student Affairs', goingIds: [me, 'p_carlo'] },
    { id: 'e5', title: "All Saints' Day: No Classes", category: 'Holiday', at: new Date(year, 10, 1, 0, 0).getTime(), venue: 'Campus-wide', holiday: true, goingIds: [] },
    { id: 'e6', title: 'Freshman Orientation', category: 'Academic', at: onDay(-11, 8), venue: 'Main Auditorium', host: 'Student Council', goingIds: [me] },
    { id: 'e7', title: 'Hackathon Kickoff', category: 'Tech', at: onDay(-19, 17), venue: 'Innovation Hub', host: 'Computer Society', goingIds: [] },
    { id: 'e8', title: 'Ninoy Aquino Day: No Classes', category: 'Holiday', at: new Date(year, 7, 21, 0, 0).getTime(), venue: 'Campus-wide', holiday: true, goingIds: [] },
  ]

  const lostFound = [
    { id: 'lf1', kind: 'lost', category: 'Electronics', title: 'Black Casio Scientific Calculator', body: 'Lost near the library or canteen area. Has a sticker on the back.', where: 'Library / Canteen', by: 'p_ana', at: at(now, { d: 1 }) },
    { id: 'lf2', kind: 'found', category: 'ID / Card', title: 'TIP ID: Maria Santos', body: 'Found on the 3rd floor hallway near Room 312. Surrendered to the guard on duty.', where: '3rd Floor, Bldg A', by: 'p_carlo', at: at(now, { d: 1, h: 3 }) },
    { id: 'lf3', kind: 'lost', category: 'Accessories', title: 'Blue Umbrella with Floral Handle', body: 'Left in Room 204 last Thursday afternoon. Has my name written on the strap.', where: 'Room 204, Bldg B', by: 'p_pia', at: at(now, { d: 3 }) },
    { id: 'lf4', kind: 'found', category: 'Personal Item', title: 'Water Tumbler (Gray, 40oz)', body: 'Found near the gym entrance. Has a sticker on it. Turned in at the guard house.', where: 'Gym Entrance', by: 'p_mark', at: at(now, { d: 4 }), resolved: true },
    { id: 'lf5', kind: 'lost', category: 'Electronics', title: 'USB Drive (Kingston, 32GB)', body: 'May contain important files and thesis drafts. Lost somewhere in the computer lab.', where: 'Computer Lab 3', by: 'p_james', at: at(now, { d: 5 }) },
    { id: 'lf6', kind: 'found', category: 'Accessories', title: 'Prescription Eyeglasses', body: 'Black frame with a thin silver detail. Found on a cafeteria bench.', where: 'Cafeteria', by: 'p_sofia', at: at(now, { d: 6 }) },
  ]

  const reminders = [
    { id: 'r1', ownerId: me, title: 'CS399 Assignment', at: onDay(-1, 23, 59) },
    { id: 'r2', ownerId: me, title: 'Organization Meeting', at: onDay(5, 15) },
    { id: 'r3', ownerId: me, title: 'Midterm Examination', at: midterm },
    { id: 'r4', ownerId: me, title: 'NSTP Attendance', at: onDay(-5, 7, 30), done: true },
  ]

  const listings = [
    { id: 'm1', title: 'Calculus Textbook (Stewart, 8th ed.)', price: 350, by: 'p_ana', condition: 'Good', icon: '📘', body: 'Some highlighting in chapters 2–4, otherwise clean. Meet-up at the library lobby.', at: at(now, { d: 1 }) },
    { id: 'm2', title: 'Scientific Calculator (Casio fx-991ES)', price: 600, by: 'p_mark', condition: 'Like New', icon: '🧮', body: 'Used for one semester. Comes with the original cover.', at: at(now, { d: 2 }) },
    { id: 'm3', title: 'Lab Gown (Medium)', price: 200, by: 'p_pia', condition: 'Fair', icon: '🥼', body: 'Small stain on the left sleeve, washed. Good for chem lab.', at: at(now, { d: 2 }) },
    { id: 'm4', title: 'USB Hub 4-Port', price: 450, by: 'p_carl', condition: 'Like New', icon: '🔌', body: 'USB 3.0, works with laptops and the lab PCs. Barely used.', at: at(now, { d: 3 }) },
    { id: 'm5', title: 'Engineering Drawing Set', price: 280, by: 'p_bea', condition: 'Good', icon: '📐', body: 'Complete set with T-square and triangles. Missing one compass lead.', at: at(now, { d: 4 }) },
    { id: 'm6', title: 'Arduino Uno Starter Kit', price: 900, by: 'p_rico', condition: 'Good', icon: '🔧', body: 'Board, breadboard, jumper wires and sensors. Used for one CpE project.', at: at(now, { d: 5 }) },
  ]

  const wall = [
    { id: 'w1', alias: 'Anonymous Bee', body: 'Midterms are coming, stay strong everyone! 💪 You got this!', at: at(now, { h: 2 }), buzzedBy: [], baseBuzz: 42 },
    { id: 'w2', alias: 'A student', body: 'The new canteen menu is actually pretty good ngl. Recommend the silog!', at: at(now, { h: 4 }), buzzedBy: [], baseBuzz: 18 },
    { id: 'w3', alias: 'Anonymous Bee', body: 'Shoutout to the professors who extend deadlines 🙏', at: at(now, { h: 6 }), buzzedBy: [], baseBuzz: 87 },
    { id: 'w4', alias: 'Helpful Bee', body: 'Anyone lost a Casio calculator near the library? I found one! Posted it in Lost & Found too.', at: at(now, { h: 8 }), buzzedBy: [], baseBuzz: 6 },
  ]

  const posts = [
    { id: 'po1', authorId: 'p_james', category: 'Tech', body: 'Computer Society is looking for mentors for the Git workshop. Message me if you know your way around branches and pull requests.', at: at(now, { h: 1 }), likedBy: ['p_rico'] },
    { id: 'po2', authorId: me, category: 'Academic', body: 'Study group for Discrete Math this Saturday at the library, 2PM. Everyone is welcome.', at: at(now, { h: 6 }), likedBy: ['p_maria', 'p_bea', 'p_liam'] },
    { id: 'po3', authorId: 'p_sofia', category: 'General', body: 'The garden behind Bldg B looks so good after the rain. Perfect spot to review between classes.', at: at(now, { d: 1 }), likedBy: [] },
  ]

  return {
    version: DATA_VERSION,
    session: null,
    users,
    groups,
    conversations,
    announcements,
    events,
    lostFound,
    reminders,
    listings,
    wall,
    posts,
  }
}
