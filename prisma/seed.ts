import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing database
  await prisma.userAchievement.deleteMany();
  await prisma.distractionLog.deleteMany();
  await prisma.dailyAnalytics.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.task.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.blockedWebsite.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();

  // Create primary student user
  const user = await prisma.user.create({
    data: {
      id: "student-user-id", // static ID for simplicity in mock operations
      email: "student@focusforge.ai",
      name: "ILHAM FAROOQUE",
      xp: 3450,
      level: 4,
      currentStreak: 12,
      longestStreak: 21,
      lastActive: new Date(),
      monkModeEnabled: false,
      whitelistOnly: false,
      examModeEnabled: false,
      ambientSoundType: "rain",
      ambientVolume: 0.4,
    },
  });

  console.log(`Created user: ${user.name}`);

  // Create default Blocked Websites
  const blockedSites = [
    { domain: "youtube.com", isActive: true },
    { domain: "instagram.com", isActive: true },
    { domain: "reddit.com", isActive: true },
    { domain: "facebook.com", isActive: false },
    { domain: "twitter.com", isActive: true },
    { domain: "discord.com", isActive: true },
  ];

  for (const site of blockedSites) {
    await prisma.blockedWebsite.create({
      data: {
        userId: user.id,
        domain: site.domain,
        isActive: site.isActive,
      },
    });
  }

  // Create Default Tasks (JEE Syllabus Items)
  const defaultTasks = [
    { title: "Solve Physics PYQs on Electrostatics (2020-2024)", subject: "Physics", chapter: "Electrostatics", type: "PYQ", status: "Todo", priority: "High" },
    { title: "Watch Chemistry lecture on Chemical Bonding", subject: "Chemistry", chapter: "Chemical Bonding", type: "Lecture", status: "Todo", priority: "Medium" },
    { title: "Revise Mathematics Trigonometry Formulas", subject: "Maths", chapter: "Trigonometry", type: "Revision", status: "Done", priority: "Low" },
    { title: "Attempt Electrostatics Mock Test 1", subject: "Physics", chapter: "Electrostatics", type: "Test", status: "InProgress", priority: "High" },
    { title: "Complete Coordination Compounds notes", subject: "Chemistry", chapter: "Coordination Compounds", type: "Lecture", status: "Todo", priority: "Medium" },
    { title: "Solve Integration PYQs (50 Qs)", subject: "Maths", chapter: "Integration", type: "PYQ", status: "Todo", priority: "High" },
  ];

  for (const task of defaultTasks) {
    await prisma.task.create({
      data: {
        userId: user.id,
        ...task,
      },
    });
  }

  // Log mock Study Sessions for the past 7 days to populate charts/heatmap
  const subjects = ["Physics", "Chemistry", "Maths"];
  const chapters = {
    Physics: "Electrostatics",
    Chemistry: "Chemical Bonding",
    Maths: "Integration",
  };
  const taskTypes = ["Lecture", "PYQ", "Revision", "Test"];

  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const sessionDate = new Date(now);
    sessionDate.setDate(now.getDate() - i);

    // Number of sessions on this day
    const numSessions = i === 0 ? 2 : Math.floor(Math.random() * 3) + 1;

    for (let s = 0; s < numSessions; s++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const chapter = chapters[subject as keyof typeof chapters];
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const mode = Math.random() > 0.5 ? "DeepWork" : "Pomodoro";

      const duration = mode === "DeepWork" ? 90 : 50;
      
      const startTime = new Date(sessionDate);
      startTime.setHours(9 + s * 3, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + duration);

      const focusScore = Math.floor(Math.random() * 21) + 80; // 80 - 100

      const session = await prisma.studySession.create({
        data: {
          userId: user.id,
          subject,
          chapter,
          taskType,
          mode,
          startTime,
          endTime,
          durationMinutes: duration,
          focusScore,
          notes: `Completed ${taskType} of ${chapter} successfully. Maintain focus!`,
        },
      });

      // Log some distractions during this session
      if (focusScore < 95) {
        await prisma.distractionLog.create({
          data: {
            userId: user.id,
            studySessionId: session.id,
            domain: Math.random() > 0.5 ? "youtube.com" : "instagram.com",
            durationMinutes: Math.floor(Math.random() * 8) + 2,
            timestamp: startTime,
          },
        });
      }
    }

    // Daily Analytics aggregation
    const dailyStudy = numSessions * 60; // rough representation
    const dailyDistract = Math.floor(Math.random() * 20) + 5;
    const score = Math.floor(Math.random() * 15) + 82;

    await prisma.dailyAnalytics.create({
      data: {
        userId: user.id,
        date: new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate()),
        totalStudyMinutes: dailyStudy,
        deepWorkMinutes: Math.floor(dailyStudy * 0.8),
        distractedMinutes: dailyDistract,
        focusScore: score,
      },
    });
  }

  // Create Mock Mistakes
  const mockMistakes = [
    {
      subject: "Physics",
      chapter: "Electrostatics",
      errorType: "Calculation Error",
      description: "Messed up integration limit while calculating electric field of a charged rod.",
      explanation: "Limits should be from -L/2 to +L/2, but I integrated from 0 to L. Remember that coordinate origin is at midpoint of rod.",
      timesRevised: 1,
    },
    {
      subject: "Chemistry",
      chapter: "Chemical Bonding",
      errorType: "Conceptual Gap",
      description: "Misidentified hybridization of XeF4 as sp3d instead of sp3d2.",
      explanation: "Xenon has 8 valence electrons. Four bonding pairs with Fluorine, plus 2 lone pairs. Total steric number = 6. Hence, hybridization is sp3d2 (square planar geometry).",
      timesRevised: 0,
    },
    {
      subject: "Maths",
      chapter: "Integration",
      errorType: "Silly Mistake",
      description: "Forgot to add constant of integration in the indefinite integral section of Mock Test.",
      explanation: "Lost 4 marks on an easy question just because of neglecting '+ C'. Must double check all indefinite integrals during revision.",
      timesRevised: 2,
    },
  ];

  for (const mistake of mockMistakes) {
    const dbMistake = await prisma.mistake.create({
      data: {
        userId: user.id,
        ...mistake,
        nextRevisionAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // due tomorrow
      },
    });

    // Create Revision instances
    await prisma.revision.create({
      data: {
        userId: user.id,
        mistakeId: dbMistake.id,
        subject: dbMistake.subject,
        chapter: dbMistake.chapter,
        scheduledDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // scheduled yesterday
        completedAt: new Date(),
        status: "Completed",
        revisionCycle: 1,
      },
    });

    await prisma.revision.create({
      data: {
        userId: user.id,
        mistakeId: dbMistake.id,
        subject: dbMistake.subject,
        chapter: dbMistake.chapter,
        scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // scheduled tomorrow
        status: "Pending",
        revisionCycle: 3,
      },
    });
  }

  // Create User Goals
  const mockGoals = [
    { title: "Complete Physics Syllabus (Class 12th)", subject: "Physics", targetDate: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()), currentProgress: 68.0 },
    { title: "Solve all PYQs of Organic Chemistry", subject: "Chemistry", targetDate: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()), currentProgress: 45.0 },
    { title: "Complete Calculus Chapter Tests", subject: "Maths", targetDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()), currentProgress: 90.0 },
  ];

  for (const goal of mockGoals) {
    await prisma.goal.create({
      data: {
        userId: user.id,
        ...goal,
      },
    });
  }

  // Create Achievements
  const achievements = [
    { badgeId: "DEEP_WORK_10" },
    { badgeId: "STREAK_7" },
    { badgeId: "MISTAKE_MASTER" },
  ];

  for (const ach of achievements) {
    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        badgeId: ach.badgeId,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
