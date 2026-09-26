import initSqlJs, { Database, SqlValue } from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbFilePath = path.resolve(dbDir, 'campuscare.sqlite');
let dbInstance: Database | null = null;

function saveDbToDisk() {
  if (dbInstance) {
    try {
      const data = dbInstance.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbFilePath, buffer);
    } catch (err) {
      console.error('Failed to save SQLite database to disk:', err);
    }
  }
}

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  if (fs.existsSync(dbFilePath)) {
    try {
      const fileBuffer = fs.readFileSync(dbFilePath);
      dbInstance = new SQL.Database(fileBuffer);
    } catch {
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }
  return dbInstance;
}

export async function run(sql: string, params: SqlValue[] = []): Promise<void> {
  const db = await getDb();
  db.run(sql, params);
  saveDbToDisk();
}

export async function get<T = any>(sql: string, params: SqlValue[] = []): Promise<T | undefined> {
  const db = await getDb();
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject() as T;
      return row;
    }
    return undefined;
  } finally {
    stmt.free();
  }
}

export async function all<T = any>(sql: string, params: SqlValue[] = []): Promise<T[]> {
  const db = await getDb();
  const stmt = db.prepare(sql);
  const rows: T[] = [];
  try {
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as T);
    }
    return rows;
  } finally {
    stmt.free();
  }
}

export async function initDb() {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      block TEXT NOT NULL,
      room TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      imageCaption TEXT,
      reportedByName TEXT NOT NULL,
      reportedByRole TEXT NOT NULL,
      reportedByEnrollment TEXT,
      reportedByAvatar TEXT,
      reportedAt TEXT NOT NULL,
      relativeTime TEXT NOT NULL,
      supportCount INTEGER DEFAULT 0,
      commentCount INTEGER DEFAULT 0,
      techAssigned TEXT,
      workOrderNumber TEXT,
      auditNote TEXT,
      slaTargetHours INTEGER DEFAULT 48,
      slaElapsedHours INTEGER DEFAULT 0,
      equipment TEXT,
      departmentScope TEXT,
      officialUpdateJson TEXT,
      resolutionTrailJson TEXT,
      custodiansJson TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      issueId TEXT NOT NULL,
      authorName TEXT NOT NULL,
      authorRole TEXT NOT NULL,
      authorAvatar TEXT,
      timeAgo TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      enrollment TEXT NOT NULL,
      department TEXT NOT NULL,
      semester TEXT NOT NULL,
      rollNo TEXT NOT NULL,
      avatar TEXT NOT NULL,
      level INTEGER DEFAULT 4,
      currentXp INTEGER DEFAULT 680,
      nextLevelXp INTEGER DEFAULT 800,
      trustScore REAL DEFAULT 98.4,
      activeCitizenTitle TEXT,
      recentHonor TEXT,
      issuesReportedCount INTEGER DEFAULT 14,
      issuesResolvedCount INTEGER DEFAULT 11,
      upvotesCastCount INTEGER DEFAULT 47
    );

    CREATE TABLE IF NOT EXISTS lost_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      locationFound TEXT NOT NULL,
      foundDate TEXT NOT NULL,
      status TEXT NOT NULL,
      custodyOffice TEXT NOT NULL,
      image TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_upvotes (
      userId TEXT NOT NULL,
      issueId TEXT NOT NULL,
      PRIMARY KEY (userId, issueId)
    );
  `);

  saveDbToDisk();

  // Seed default user if not exists
  const existingUser = await get('SELECT * FROM user_profile WHERE id = ?', ['user-narayan']);
  if (!existingUser) {
    await run(
      `INSERT INTO user_profile (
        id, name, enrollment, department, semester, rollNo, avatar,
        level, currentXp, nextLevelXp, trustScore, activeCitizenTitle,
        recentHonor, issuesReportedCount, issuesResolvedCount, upvotesCastCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'user-narayan',
        'Narayan Patel',
        '210170116012',
        'Computer Engineering',
        'Semester 6',
        '48',
        '/images/student_narayan_1790359900780.jpg',
        4,
        680,
        800,
        98.4,
        'Campus Steward Candidate',
        '"Quick Reporter" Badge · Awarded for high-accuracy reports',
        14,
        11,
        47,
      ]
    );
  }

  // Seed default issues if empty
  const countIssues = await get<{ count: number }>('SELECT count(*) as count FROM issues');
  if (!countIssues || countIssues.count === 0) {
    const seedIssues = [
      {
        id: 'VGEC-EC-104',
        title: 'Projector not working in Room 204',
        category: 'Infrastructure',
        subcategory: 'AV Systems',
        status: 'In Progress',
        priority: 'Medium-High',
        block: 'Block A',
        room: 'Room 204',
        description: "During today's 10:30 AM Operating Systems lecture, the main ceiling-mounted projector in Room 204 failed to turn on. Faculty tried rebooting multiple times but only the red warning light is flashing. Classes for Semester 6 CE/IT are heavily dependent on this for code demonstrations and architecture slides.",
        image: '/images/classroom_projector_1790359863098.jpg',
        imageCaption: 'Epson Ceiling Projector not powering on, power LED blinking red, cable intact. IMG_0891.JPG',
        reportedByName: 'Rahul Sharma',
        reportedByRole: 'Sem 6 Rep',
        reportedByEnrollment: '210170116012',
        reportedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        reportedAt: 'Oct 14, 10:45 AM',
        relativeTime: '2 hours ago',
        supportCount: 52,
        commentCount: 14,
        techAssigned: 'Raman K. / Rajesh M.',
        workOrderNumber: 'WO-891',
        auditNote: 'Vendor technician scheduled for ballast replacement',
        slaTargetHours: 48,
        slaElapsedHours: 32,
        equipment: 'Epson EMP-X5 (Asset #VGEC-AV-884)',
        departmentScope: 'Computer Eng. (Admin Zone 1)',
        officialUpdate: {
          title: 'Ballast Unit Replacement Initiated',
          timestamp: 'Today • 11:45 AM',
          body: 'Admin Update from Estate Maintenance Dept: Vendor technician visited at 11:30 AM. Replacement ballast unit has been requested from supplier. Scheduled installation: Tomorrow before 11:00 AM.',
          assignedTech: 'Rajesh M. (Ext 402)',
          workOrder: 'Work Order #WO-891',
        },
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Raised',
            timestamp: 'Oct 14 • 10:45 AM',
            desc: 'Submitted with diagnostic photo by student Rahul Sharma.',
            status: 'completed',
          },
          {
            stepNumber: 2,
            title: 'Community Supported',
            timestamp: 'Oct 14 • 02:15 PM',
            desc: '50+ students affirmed this issue, triggering priority dispatch to department council.',
            status: 'completed',
          },
          {
            stepNumber: 3,
            title: 'Verified by Faculty',
            timestamp: 'Oct 15 • 09:30 AM',
            desc: 'Physical check approved by Prof. Patel, HOD Infrastructure Committee.',
            status: 'completed',
          },
          {
            stepNumber: 4,
            title: 'In Progress ACTIVE',
            timestamp: 'Oct 15 • 02:00 PM',
            desc: 'Campus electrician & vendor technician assigned, replacement lamp and ballast unit dispatched from local warehouse.',
            status: 'active',
          },
          {
            stepNumber: 5,
            title: 'Resolved & Closed',
            timestamp: 'Target: Oct 16',
            desc: 'Pending post-installation hardware test and class representative sign-off.',
            status: 'pending',
          },
        ],
        custodians: [
          {
            name: 'Prof. R. K. Patel',
            role: 'Faculty Chair, Infrastructure',
            contactType: 'email',
            contactVal: 'rkpatel@vgec.ac.in',
          },
          {
            name: 'Estate Maintenance Cell',
            role: 'Central Workshop Depot',
            contactType: 'phone',
            contactVal: '+91 79 2329 3866 (Ext 402)',
          },
        ],
        comments: [
          {
            id: 'c-1',
            authorName: 'Dhruv Trivedi',
            authorRole: 'CE • Sem 6',
            timeAgo: 'Yesterday at 04:30 PM',
            content: 'Can confirm, had our database lab lecture rescheduled because of this. Glad maintenance is on it!',
          },
          {
            id: 'c-2',
            authorName: 'Ananya Shah',
            authorRole: 'IT • Sem 6',
            timeAgo: 'Today at 09:15 AM',
            content: "Added my upvote! Hope it's fixed before Friday's project presentations. We have our mini-project evaluation scheduled in Room 204.",
          },
        ],
      },
      {
        id: 'VGEC-WT-089',
        title: 'Water cooler not working near Block B',
        category: 'Water Supply',
        subcategory: 'Amenities',
        status: 'Verified',
        priority: 'High',
        block: 'Block B',
        room: 'Ground Floor',
        description: 'The RO compressor is continuously buzzing without cooling. Leaking overflow pipe creating puddles near the ground floor stairway. Students on ground floor and Block B laboratories have no drinking water access during peak afternoon hours.',
        image: '/images/water_cooler_1790359875140.jpg',
        imageCaption: 'Ground floor Block B RO unit overflow tray and power junction box',
        reportedByName: 'Harsh P.',
        reportedByRole: 'Sem 4 Mech',
        reportedByEnrollment: '210170119024',
        reportedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        reportedAt: 'Oct 14, 02:20 PM',
        relativeTime: 'Yesterday',
        supportCount: 41,
        commentCount: 8,
        techAssigned: 'Estate Office Notified',
        workOrderNumber: 'WO-877',
        slaTargetHours: 24,
        slaElapsedHours: 18,
        equipment: 'BlueStar 80L Water Chiller',
        departmentScope: 'Campus Amenities Division',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Raised',
            timestamp: 'Oct 14 • 02:20 PM',
            desc: 'Reported with photo of dripping drainage pipe.',
            status: 'completed',
          },
          {
            stepNumber: 2,
            title: 'Community Supported',
            timestamp: 'Oct 14 • 04:00 PM',
            desc: '40+ student upvotes recorded.',
            status: 'completed',
          },
          {
            stepNumber: 3,
            title: 'Verified by Caretaker',
            timestamp: 'Oct 14 • 05:30 PM',
            desc: 'Supervisor visited site and shut off supply valve to prevent slippery corridor floor.',
            status: 'completed',
          },
          {
            stepNumber: 4,
            title: 'Technician Dispatched',
            timestamp: 'Oct 15 • 10:00 AM',
            desc: 'Plumbing contractor replacing internal diaphragm pump and sealing inlet.',
            status: 'active',
          },
          {
            stepNumber: 5,
            title: 'Water Quality Audit',
            timestamp: 'Pending',
            desc: 'TDS testing and final clearance.',
            status: 'pending',
          },
        ],
        comments: [
          {
            id: 'c-3',
            authorName: 'Riddhi S.',
            authorRole: 'EC • Sem 6',
            timeAgo: 'Yesterday at 06:10 PM',
            content: 'Thanks for shutting the valve, the tile was getting dangerously slippery near the staircase.',
          },
        ],
      },
      {
        id: 'VGEC-CL-042',
        title: 'Cleanliness issue near canteen courtyard',
        category: 'Cleanliness',
        subcategory: 'Health Dept',
        status: 'Under Review',
        priority: 'Medium',
        block: 'Canteen',
        room: 'East Entrance',
        description: 'Waste bins overflowing past 4 PM during inter-college workshop break. Stray animals gathering around the cafeteria perimeter and paper cups scattered over grass borders.',
        image: '/images/canteen_waste_1790359887347.jpg',
        imageCaption: 'East canteen garden lawn recycle cans at maximum capacity',
        reportedByName: 'Aayushi S.',
        reportedByRole: 'Sem 6 CE',
        reportedAt: 'Oct 13, 05:15 PM',
        relativeTime: '2 days ago',
        supportCount: 34,
        commentCount: 5,
        techAssigned: 'Priority Score: High',
        slaTargetHours: 24,
        slaElapsedHours: 22,
        departmentScope: 'Sanitation & Hygiene Cell',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Raised',
            timestamp: 'Oct 13 • 05:15 PM',
            desc: 'Logged by student representative after evening rush.',
            status: 'completed',
          },
          {
            stepNumber: 2,
            title: 'Under Review',
            timestamp: 'Oct 14 • 08:30 AM',
            desc: 'Reviewing schedule for midday additional waste pickup rounds.',
            status: 'active',
          },
        ],
        comments: [
          {
            id: 'c-4',
            authorName: 'Manan D.',
            authorRole: 'Civil • Sem 4',
            timeAgo: '2 days ago',
            content: 'We need segregated recycling bins here especially during events.',
          },
        ],
      },
      {
        id: 'VGEC-IN-112',
        title: 'Broken bench in classroom corridor',
        category: 'Infrastructure',
        subcategory: 'Civil Estate',
        status: 'Verified',
        priority: 'Medium',
        block: 'Block C',
        room: '2nd Floor Corridor',
        description: 'Wooden slat splintered causing potential hazard during pass-through between lectures. Seating bench outside Lecture Hall C-202 has cracked support plank and exposed nails, presenting safety hazard.',
        image: '/images/broken_bench_1790359913393.jpg',
        imageCaption: 'Corridor 302 heavy oak student seating bench splinter damage',
        reportedByName: 'Rohan D.',
        reportedByRole: 'Sem 4 IT',
        reportedAt: 'Oct 12, 11:30 AM',
        relativeTime: '3 days ago',
        supportCount: 28,
        commentCount: 3,
        techAssigned: 'Carpentry Order Queued',
        workOrderNumber: 'WO-852',
        slaTargetHours: 72,
        slaElapsedHours: 46,
        departmentScope: 'Civil Estate Works',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Raised',
            timestamp: 'Oct 12 • 11:30 AM',
            desc: 'Corridor hazard logged with photo evidence.',
            status: 'completed',
          },
        ],
        comments: [
          {
            id: 'c-5',
            authorName: 'Pooja J.',
            authorRole: 'Chemical • Sem 6',
            timeAgo: '3 days ago',
            content: 'A student tore their bag strap on the loose nail yesterday, good that caution tape is put up.',
          },
        ],
      },
      {
        id: 'VGEC-IT-055',
        title: 'Wi-Fi connection weak and dropping in Lab 3',
        category: 'Wi-Fi & IT',
        subcategory: 'IT Dept',
        status: 'In Progress',
        priority: 'High',
        block: 'ICT Department',
        room: 'Lab 3',
        description: 'Access Point \'VGEC_CAMPUS_5G_N\' authentication drops every 5 minutes. High packet loss affects practical database examination uploads and git repository syncs during afternoon labs.',
        image: '/images/computer_lab_1790359933859.jpg',
        imageCaption: 'ICT Lab 3 desktop terminals failing gateway handshake',
        reportedByName: 'Sem 8 Student',
        reportedByRole: 'Sem 8 IT',
        reportedAt: 'Oct 11, 03:40 PM',
        relativeTime: '4 days ago',
        supportCount: 23,
        commentCount: 9,
        techAssigned: 'Network Cell Inspecting',
        workOrderNumber: 'WO-830',
        slaTargetHours: 48,
        slaElapsedHours: 36,
        departmentScope: 'Campus IT & Network Cell',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Logged',
            timestamp: 'Oct 11 • 03:40 PM',
            desc: 'Ticket opened with traceroute logs.',
            status: 'completed',
          },
        ],
        comments: [
          {
            id: 'c-6',
            authorName: 'Aaditya M.',
            authorRole: 'IT • Sem 8',
            timeAgo: '4 days ago',
            content: 'SSID 5G disconnects right in the middle of code pushes. 2.4G is saturated too.',
          },
        ],
      },
      {
        id: 'VGEC-ELE-105',
        title: 'Tube light flickering in Central Library',
        category: 'Electricity',
        subcategory: 'Maintenance',
        status: 'Verified',
        priority: 'Medium',
        block: 'Central Library',
        room: 'Quiet Study Hall',
        description: 'Row 4 fluorescent bulb chattering and flashing in the central reading hall. Severe distraction for students preparing for GATE exam.',
        image: '/images/library_lighting_1790359945392.jpg',
        imageCaption: 'Reading hall bay 4 fluorescent ballast flashing',
        reportedByName: 'Tanvi B.',
        reportedByRole: 'Sem 8 Civil',
        reportedAt: 'Oct 10, 09:20 AM',
        relativeTime: '5 days ago',
        supportCount: 19,
        commentCount: 4,
        techAssigned: 'Electrical Wing Dispatched',
        workOrderNumber: 'WO-812',
        slaTargetHours: 24,
        slaElapsedHours: 12,
        departmentScope: 'Electrical Maintenance',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Logged',
            timestamp: 'Oct 10 • 09:20 AM',
            desc: 'Reported by library regular study group.',
            status: 'completed',
          },
        ],
        comments: [
          {
            id: 'c-7',
            authorName: 'Kavita M.',
            authorRole: 'EC • Sem 6',
            timeAgo: '4 days ago',
            content: 'The buzzing sound was unbearable yesterday, thanks for reporting!',
          },
        ],
      },
      {
        id: 'VGEC-WSH-031',
        title: 'Washroom door latch broken in Mech Block',
        category: 'Washroom',
        subcategory: 'Carpentry',
        status: 'Under Review',
        priority: 'Medium-High',
        block: 'Mechanical Block',
        room: '1st Floor Washroom',
        description: 'Second cubicle door latch is broken off entirely. Privacy issue for students and staff on first floor mechanical workshop wing.',
        image: '/images/washroom_latch_1790359958293.jpg',
        imageCaption: 'Cubicle 2 door latch mount ripped from metal door frame',
        reportedByName: 'Devam K.',
        reportedByRole: 'Sem 4 Mech',
        reportedAt: 'Oct 09, 04:15 PM',
        relativeTime: '6 days ago',
        supportCount: 16,
        commentCount: 2,
        techAssigned: 'Estate Workshop Requisition',
        departmentScope: 'Sanitary & Facilities',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Logged',
            timestamp: 'Oct 09 • 04:15 PM',
            desc: 'Requisition submitted for new slide latch barrel.',
            status: 'completed',
          },
        ],
        comments: [],
      },
      {
        id: 'VGEC-HVAC-018',
        title: 'Air conditioner coolant leak in Admin Block',
        category: 'Infrastructure',
        subcategory: 'HVAC',
        status: 'Resolved',
        priority: 'Low',
        block: 'Admin Block',
        room: 'Student Registrar Hall',
        description: 'Estate section technicians replaced the expansion valve and recharged eco-friendly R32 refrigerant. Cooling efficiency restored to 21°C baseline.',
        image: '/images/air_conditioner_1790359969873.jpg',
        imageCaption: 'Post-service audit: indoor unit evaporator coil clean and functioning',
        reportedByName: 'Sanket P.',
        reportedByRole: 'Admin Staff',
        reportedAt: 'Oct 08, 10:00 AM',
        relativeTime: '1 week ago',
        supportCount: 12,
        commentCount: 6,
        techAssigned: 'Resolved & Signed Off',
        workOrderNumber: 'WO-799',
        auditNote: 'Audit signed by Chief Engineer on Oct 11',
        departmentScope: 'Estate Section',
        resolutionTrail: [
          {
            stepNumber: 1,
            title: 'Issue Logged',
            timestamp: 'Oct 08 • 10:00 AM',
            desc: 'Inadequate cooling and water spitting noted.',
            status: 'completed',
          },
          {
            stepNumber: 2,
            title: 'Resolved & Closed',
            timestamp: 'Oct 11 • 05:00 PM',
            desc: 'Verified by Office Superintendent and student clerk.',
            status: 'completed',
          },
        ],
        comments: [],
      },
    ];

    for (const issue of seedIssues) {
      await run(
        `INSERT INTO issues (
          id, title, category, subcategory, status, priority, block, room,
          description, image, imageCaption, reportedByName, reportedByRole,
          reportedByEnrollment, reportedByAvatar, reportedAt, relativeTime,
          supportCount, commentCount, techAssigned, workOrderNumber, auditNote,
          slaTargetHours, slaElapsedHours, equipment, departmentScope,
          officialUpdateJson, resolutionTrailJson, custodiansJson
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          issue.id,
          issue.title,
          issue.category,
          issue.subcategory || null,
          issue.status,
          issue.priority,
          issue.block,
          issue.room,
          issue.description,
          issue.image,
          issue.imageCaption || null,
          issue.reportedByName,
          issue.reportedByRole,
          issue.reportedByEnrollment || null,
          issue.reportedByAvatar || null,
          issue.reportedAt,
          issue.relativeTime,
          issue.supportCount,
          issue.commentCount,
          issue.techAssigned || null,
          issue.workOrderNumber || null,
          issue.auditNote || null,
          issue.slaTargetHours || 48,
          issue.slaElapsedHours || 0,
          issue.equipment || null,
          issue.departmentScope || null,
          issue.officialUpdate ? JSON.stringify(issue.officialUpdate) : null,
          JSON.stringify(issue.resolutionTrail || []),
          (issue as any).custodians ? JSON.stringify((issue as any).custodians) : null,
        ]
      );

      // Insert comments
      if (issue.comments && issue.comments.length > 0) {
        for (const c of issue.comments) {
          await run(
            `INSERT INTO comments (id, issueId, authorName, authorRole, timeAgo, content)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [c.id, issue.id, c.authorName, c.authorRole, c.timeAgo, c.content]
          );
        }
      }
    }
  }

  // Seed lost items if empty
  const countLost = await get<{ count: number }>('SELECT count(*) as count FROM lost_items');
  if (!countLost || countLost.count === 0) {
    const seedLost = [
      {
        id: 'LF-2024-031',
        title: 'Scientific Calculator Casio fx-991EX',
        category: 'Electronics',
        locationFound: 'Block A, Room 204 desk 14',
        foundDate: 'Yesterday, 04:30 PM',
        status: 'Open',
        custodyOffice: 'Department HOD Office, Block A',
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'LF-2024-029',
        title: 'Student ID Card (EC Dept, Sem 4)',
        category: 'ID Cards',
        locationFound: 'Canteen Cash Counter',
        foundDate: 'Oct 14, 01:15 PM',
        status: 'Claimed',
        custodyOffice: 'Security Main Gate',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'LF-2024-028',
        title: 'Boat Wireless Earbuds Case (Black)',
        category: 'Electronics',
        locationFound: 'Central Library Row 6',
        foundDate: 'Oct 13, 05:00 PM',
        status: 'In Custody',
        custodyOffice: 'Library Issue Counter',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'LF-2024-026',
        title: 'Spiral Engineering Drawing Journal',
        category: 'Stationery',
        locationFound: 'Mechanical Drawing Hall 1',
        foundDate: 'Oct 12, 12:45 PM',
        status: 'Claimed',
        custodyOffice: 'Drawing Hall Attendant',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      },
    ];

    for (const item of seedLost) {
      await run(
        `INSERT INTO lost_items (id, title, category, locationFound, foundDate, status, custodyOffice, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.title, item.category, item.locationFound, item.foundDate, item.status, item.custodyOffice, item.image]
      );
    }
  }

  saveDbToDisk();
}
