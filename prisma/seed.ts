import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function slugify(text: string): Promise<string> {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('🌱 Starting database seed...')

  // ---------------------------------------------------------------------------
  // Wipe all existing data (respecting foreign keys)
  // ---------------------------------------------------------------------------
  console.log('\n-- Clearing existing data --')

  await prisma.pageView.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.employeeTask.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.session.deleteMany()
  await prisma.pageRevision.deleteMany()
  await prisma.page.deleteMany()
  await prisma.newsTagRelation.deleteMany()
  await prisma.newsArticle.deleteMany()
  await prisma.newsTag.deleteMany()
  await prisma.newsCategory.deleteMany()
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.document.deleteMany()
  await prisma.mediaAsset.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.sustainabilityMetric.deleteMany()
  await prisma.navigationItem.deleteMany()
  await prisma.siteSetting.deleteMany()
  await prisma.leadershipProfile.deleteMany()
  await prisma.projectMilestone.deleteMany()
  await prisma.projectImage.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  console.log('Existing data cleared.')

  // ---------------------------------------------------------------------------
  // Users (RBAC)
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating users --')

  const adminHash = await bcrypt.hash('admin123', 10)
  const editorHash = await bcrypt.hash('editor123', 10)

  const _superAdmin = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'admin@enec.gov.ae',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
    },
  })

  const _editor = await prisma.user.create({
    data: {
      name: 'James Mitchell',
      email: 'editor@enec.gov.ae',
      passwordHash: editorHash,
      role: 'EDITOR',
      isActive: true,
      lastLoginAt: new Date(),
    },
  })

  console.log('  ✔️  Super Admin (Sarah Chen)')
  console.log('  ✔️  Editor (James Mitchell)')

  // ---------------------------------------------------------------------------
  // Employees (Employee Portal)
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating employees --')

  const employeeHash = await bcrypt.hash('employee123', 10)
  const employees = [
    {
      name: 'Aisha Al Mansoori',
      employeeId: 'EMP-1001',
      email: 'aisha@enec.gov.ae',
      department: 'Engineering',
      role: 'SR_ENGINEER',
      phone: '+971 50 000 1001',
    },
    {
      name: 'Omar Haddad',
      employeeId: 'EMP-1002',
      email: 'omar@enec.gov.ae',
      department: 'Operations',
      role: 'OPERATIONS_TECH',
      phone: '+971 50 000 1002',
    },
    {
      name: 'Fatima Al Zaabi',
      employeeId: 'EMP-1003',
      email: 'fatima@enec.gov.ae',
      department: 'Safety',
      role: 'SAFETY_OFFICER',
      phone: '+971 50 000 1003',
    },
  ]

  for (const emp of employees) {
    await prisma.employee.create({
      data: { ...emp, passwordHash: employeeHash },
    })
    console.log(`  ✔️  ${emp.name} (${emp.department})`)
  }

  // ---------------------------------------------------------------------------
  // Employee Tasks (assigned to seed employees)
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating employee tasks --')

  const aisha = await prisma.employee.findUnique({ where: { email: 'aisha@enec.gov.ae' } })
  const omar = await prisma.employee.findUnique({ where: { email: 'omar@enec.gov.ae' } })
  const fatima = await prisma.employee.findUnique({ where: { email: 'fatima@enec.gov.ae' } })

  const tasks = [
    {
      employeeId: aisha?.id ?? '',
      title: 'Review advanced reactor turbine specifications',
      description: 'Cross-check the latest turbine hall specifications against project standards.',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: new Date(Date.now() + 7 * 86400000),
    },
    {
      employeeId: aisha?.id ?? '',
      title: 'Prepare monthly engineering progress report',
      description: 'Compile progress metrics for the Meridian and Pacific projects.',
      status: 'PENDING' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 3 * 86400000),
    },
    {
      employeeId: omar?.id ?? '',
      title: 'Verify reactor coolant system log data',
      description: 'Audit the shift logs from the Eastern Seaboard station for the past week.',
      status: 'COMPLETED' as const,
      priority: 'URGENT' as const,
      dueDate: new Date(Date.now() - 2 * 86400000),
    },
    {
      employeeId: omar?.id ?? '',
      title: 'Update outage planning calendar',
      description: 'Reflect the new maintenance window announced this week.',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 10 * 86400000),
    },
    {
      employeeId: fatima?.id ?? '',
      title: 'Complete safety drill documentation',
      description: 'Finalize the records for the Q3 emergency preparedness drill.',
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      dueDate: new Date(Date.now() + 5 * 86400000),
    },
    {
      employeeId: fatima?.id ?? '',
      title: 'Audit PPE inventory for construction sites',
      description: 'Verify PPE stock levels and expiry dates across active sites.',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date(Date.now() + 14 * 86400000),
    },
  ]

  for (const task of tasks) {
    if (!task.employeeId) continue
    await prisma.employeeTask.create({ data: task })
    console.log(`  ✔️  Task: ${task.title}`)
  }

  // ---------------------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating announcements --')

  const announcements = [
    {
      title: 'Company Town Hall — Thursday 3 PM',
      body: 'Join us for a quarterly town hall with leadership. We will cover project milestones, upcoming goals and a Q&A session. Recordings will be available afterwards.',
      audience: 'ALL',
      pinned: true,
    },
    {
      title: 'New Leave Management Workflow',
      body: 'From next Monday, all leave requests will move through the new digital workflow. Please submit requests at least five working days in advance.',
      audience: 'EMPLOYEE',
      pinned: false,
    },
    {
      title: 'Annual Safety Campaign Launch',
      body: 'This quarter we are running a fleet-wide safety campaign focused on situational awareness and hazard reporting. Participate and earn recognition.',
      audience: 'ALL',
      pinned: false,
    },
  ]

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement })
    console.log(`  ✔️  Announcement: ${announcement.title}`)
  }

  // ---------------------------------------------------------------------------
  // Leadership Profiles
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating leadership profiles --')

  const leaders = [
    {
      name: 'Dr. Alexandra Whitfield',
      title: 'Chief Executive Officer',
      biography:
        'Dr. Whitfield has led ENEC since 2018, bringing three decades of experience in nuclear engineering and corporate strategy. Under her leadership, the company has grown from a regional utility to a global clean energy leader with a portfolio spanning advanced reactor development, international partnerships, and a multi-gigawatt project pipeline. She holds a PhD in Nuclear Engineering from the Massachusetts Institute of Technology and is a vocal advocate for the role of nuclear energy in a carbon-neutral future.',
      responsibilities:
        'Sets the corporate vision and strategic direction, oversees executive leadership, and serves as the principal liaison to boards, governments, and international partners.',
      sortOrder: 1,
    },
    {
      name: 'Prof. Raj Krishnamurthy',
      title: 'Chief Technology Officer',
      biography:
        'Prof. Krishnamurthy oversees all technology development and innovation initiatives at ENEC. A former professor of nuclear physics at Imperial College London, he has published more than 120 peer-reviewed papers on reactor design and thermal hydraulics. He leads the company\u2019s advanced reactor research program, including next-generation light water reactors and the adoption of AI-driven digital systems that are redefining plant operations.',
      responsibilities:
        'Leads the technology and engineering R&D agenda, drives innovation partnerships with universities, and guides the deployment of digital and predictive systems across the fleet.',
      sortOrder: 2,
    },
    {
      name: 'Michael Torres',
      title: 'Chief Financial Officer',
      biography:
        'Michael Torres has been instrumental in securing financing for major capital projects throughout his ten-year tenure as CFO. With a background in infrastructure investment banking and a track record of structuring multi-billion dollar project finance, he has built a resilient capital strategy that has funded three concurrent reactor construction programs and the company\u2019s long-term clean energy expansion.',
      responsibilities:
        'Oversees all financial planning, capital markets strategy, investor relations, and large-scale project financing for the development pipeline.',
      sortOrder: 3,
    },
    {
      name: 'Elizabeth Chang',
      title: 'Chief Operating Officer',
      biography:
        'Elizabeth ensures operational excellence across all facilities, drawing on 25 years of experience in power generation operations and regulatory compliance. She has held leadership roles in both conventional and nuclear fleets and has championed a data-driven operational culture that has consistently improved capacity factors and reduced unplanned downtime across the company\u2019s operating assets.',
      responsibilities:
        'Manages fleet-wide operations, maintenance, supply chain, and capital improvement programs to safely maximize the output of operating plants.',
      sortOrder: 4,
    },
    {
      name: 'Dr. Hans Mueller',
      title: 'Vice President of Safety',
      biography:
        'Dr. Mueller is an internationally recognized nuclear safety expert with more than 30 years in the field, including senior roles with international safety bodies and regulatory agencies across Europe and North America. He has authored widely cited guidance on probabilistic safety assessment and human factors, and has driven the adoption of industry-leading safety culture standards throughout ENEC.',
      responsibilities:
        'Provides corporate oversight of nuclear safety programs, sets safety standards, and leads continuous improvement across all operating and construction sites.',
      sortOrder: 5,
    },
    {
      name: 'Dr. Priya Patel',
      title: 'Vice President of Engineering',
      biography:
        'Dr. Patel leads engineering for all new build projects at ENEC, overseeing a team of more than 400 engineers. She joined from a leading international EPC contractor where she managed large-scale power projects across three continents. Her expertise spans civil, mechanical, and electrical engineering, and she is credited with introducing modular construction techniques that have accelerated project schedules while controlling cost.',
      responsibilities:
        'Leads the design, engineering, and delivery of all new construction projects, including the current multi-megawatt expansion portfolio.',
      sortOrder: 6,
    },
  ]

  for (const leader of leaders) {
    await prisma.leadershipProfile.create({
      data: {
        ...leader,
        slug: await slugify(`${leader.name}-${leader.title}`),
        published: true,
      },
    })
    console.log(`  ✔️  ${leader.name} (${leader.title})`)
  }

  // ---------------------------------------------------------------------------
  // News Categories & Tags
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating news categories and tags --')

  const categories = [
    { name: 'Corporate', slug: 'corporate' },
    { name: 'Nuclear Innovation', slug: 'nuclear-innovation' },
    { name: 'Safety', slug: 'safety' },
    { name: 'Sustainability', slug: 'sustainability' },
    { name: 'Careers', slug: 'careers' },
    { name: 'Community', slug: 'community' },
  ]

  const categoryMap: Record<string, { id: string }> = {}
  for (const cat of categories) {
    categoryMap[cat.name] = await prisma.newsCategory.create({ data: cat })
    console.log(`  ✔️  Category: ${cat.name}`)
  }

  const tags = [
    { name: 'Reactor Technology', slug: 'reactor-technology' },
    { name: 'Clean Energy', slug: 'clean-energy' },
    { name: 'Safety Innovation', slug: 'safety-innovation' },
    { name: 'Global Partnership', slug: 'global-partnership' },
    { name: 'Workforce Development', slug: 'workforce-development' },
    { name: 'Digital Transformation', slug: 'digital-transformation' },
  ]

  const tagMap: Record<string, { id: string }> = {}
  for (const tag of tags) {
    tagMap[tag.name] = await prisma.newsTag.create({ data: tag })
    console.log(`  ✔️  Tag: ${tag.name}`)
  }

  // ---------------------------------------------------------------------------
  // News Articles
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating news articles --')

  const articles = [
    {
      title: 'Advancing Next-Generation Reactor Technology',
      subtitle: 'How ENEC is engineerng the reactors of tomorrow',
      excerpt:
        'Our engineers are designing advanced light water reactors with improved fuel efficiency, passive safety systems, and lower construction costs that will shape the next era of clean power.',
      content:
        'ENEC is pushing the boundaries of reactor design with a new generation of light water reactors engineered for higher efficiency and enhanced safety. Building on decades of operational experience, our engineers are incorporating passive safety systems that require no active intervention to shut down safely, modular construction that reduces build times, and digital control systems that improve reliability.\n\n"Our goal is to deliver reactors that are safer, more efficient, and more economical to build and operate," said Prof. Raj Krishnamurthy, Chief Technology Officer. "The next-generation designs we are developing will play a critical role in meeting global clean energy demand."\n\nThe program represents a significant investment in research and development and builds on partnerships with leading universities and national laboratories. ENEC expects the first full-scale demonstration plant to begin construction within the decade, with deployment to follow across the United States and select international markets.',
      categoryId: categoryMap['Nuclear Innovation'].id,
      authorName: 'Corporate Communications',
      readTimeMins: 4,
      isFeatured: true,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-15T09:00:00Z'),
      seoTitle: 'Advancing Next-Generation Reactor Technology | ENEC',
      seoDescription:
        'ENEC is developing advanced light water reactors with passive safety systems and improved efficiency for the next era of clean power.',
      tags: ['Reactor Technology', 'Clean Energy', 'Digital Transformation'],
      viewCount: 1240,
    },
    {
      title: 'Global Partnership for Clean Energy Expansion',
      subtitle: 'International collaboration to deploy advanced nuclear at scale',
      excerpt:
        'ENEC has signed a landmark agreement with international energy partners to accelerate the global deployment of advanced nuclear technologies.',
      content:
        'ENEC has announced a new global partnership aimed at accelerating the deployment of advanced nuclear energy across multiple international markets. The collaboration brings together regulators, developers, and financiers to streamline the path from design to commercial operation.\n\nThe agreement will see ENEC provide technology licensing, engineering expertise, and workforce training to partner utilities, expanding access to clean and reliable baseload power in regions transitioning away from fossil fuels.\n\n"Clean energy is a global challenge that demands global cooperation," said Dr. Alexandra Whitfield, Chief Executive Officer. "This partnership reflects our commitment to sharing our expertise and helping our partners build the energy infrastructure of the future."\n\nThe first projects under the agreement are expected to reach financial close within two years, supporting economic development and emissions reduction targets in partner countries.',
      categoryId: categoryMap['Corporate'].id,
      authorName: 'Corporate Communications',
      readTimeMins: 5,
      isFeatured: false,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-05-02T14:00:00Z'),
      seoTitle: 'Global Partnership for Clean Energy Expansion | ENEC',
      seoDescription:
        'ENEC has signed a landmark international agreement to accelerate global deployment of advanced nuclear technologies.',
      tags: ['Global Partnership', 'Clean Energy'],
      viewCount: 980,
    },
    {
      title: 'New Safety Standards Set Industry Benchmark',
      subtitle: 'Raising the bar for nuclear safety worldwide',
      excerpt:
        'ENEC has introduced a new set of corporate safety standards that exceed current regulatory requirements and set a new benchmark for the industry.',
      content:
        'ENEC has launched an ambitious new set of safety standards designed to go beyond regulatory compliance and establish the company as an industry leader in nuclear safety. The standards cover every phase of the plant lifecycle, from design and construction through operations and eventual decommissioning.\n\nThe framework was developed in consultation with international safety organizations, regulators, and frontline operators, and builds on lessons learned from decades of global experience. Key features include enhanced probabilistic safety assessment requirements, a strengthened safety culture program, and expanded emergency preparedness protocols.\n\n"Safety is not a compliance exercise — it is the foundation of everything we do," said Dr. Hans Mueller, Vice President of Safety. "These standards reflect our unwavering commitment to protecting our people, our communities, and the environment."\n\nThe new standards will be implemented across all current and future ENEC projects and shared with partners to elevate safety performance throughout the industry.',
      categoryId: categoryMap['Safety'].id,
      authorName: 'Safety & Operations Team',
      readTimeMins: 4,
      isFeatured: false,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-04-18T10:30:00Z'),
      seoTitle: 'New Safety Standards Set Industry Benchmark | ENEC',
      seoDescription:
        'ENEC has introduced corporate safety standards that exceed regulatory requirements and set a new industry benchmark.',
      tags: ['Safety Innovation'],
      viewCount: 1505,
    },
    {
      title: "Investing in Tomorrow's Energy Workforce",
      subtitle: 'Building the skilled teams who will power the clean energy era',
      excerpt:
        'ENEC is expanding its workforce development programs, partnering with universities and technical schools to train the next generation of nuclear professionals.',
      content:
        'As the demand for clean energy grows, so too does the need for a skilled and resilient workforce. ENEC is investing in comprehensive workforce development programs designed to attract, train, and retain the nuclear professionals of tomorrow.\n\nThe company has expanded partnerships with more than 20 universities and technical colleges, offering scholarships, apprenticeships, and graduate programs in nuclear engineering, safety, and operations. A new internship initiative places hundreds of students in hands-on roles across the company each year.\n\n"Our people are our greatest asset," said Elizabeth Chang, Chief Operating Officer. "By investing in education and early-career development, we are building the talent pipeline that will sustain safe, reliable clean energy for generations."\n\nENEC expects to add more than 1,500 skilled roles over the next five years as its construction and operating portfolio continues to grow.',
      categoryId: categoryMap['Careers'].id,
      authorName: 'Talent Acquisition Team',
      readTimeMins: 4,
      isFeatured: false,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-04-03T08:00:00Z'),
      seoTitle: "Investing in Tomorrow's Energy Workforce | ENEC",
      seoDescription:
        'ENEC is expanding workforce development programs to train the next generation of nuclear professionals.',
      tags: ['Workforce Development'],
      viewCount: 862,
    },
    {
      title: 'Milestone: 25 GW of Clean Energy Capacity',
      subtitle: 'ENEC reaches a significant clean energy milestone',
      excerpt:
        'Together with our partners, ENEC has reached 25 gigawatts of installed and committed clean energy capacity, a landmark in our mission to power a cleaner future.',
      content:
        'ENEC is proud to announce a significant corporate milestone: 25 gigawatts of clean energy capacity installed, under construction, or in active development across its global portfolio. The achievement reflects years of sustained investment and operational excellence.\n\nThe milestone spans a diverse fleet of operating reactors, next-generation development projects, and international partnerships. Combined, this capacity generates reliable baseload electricity that displaces hundreds of millions of tonnes of carbon dioxide annually.\n\n"This milestone is a testament to the dedication of our people and the strength of our long-term strategy," said Dr. Alexandra Whitfield. "Clean and reliable nuclear energy is central to the global energy transition, and we are just getting started."\n\nThe company has set an ambitious goal of tripling its clean energy capacity by 2040 to support climate targets both at home and abroad.',
      categoryId: categoryMap['Corporate'].id,
      authorName: 'Corporate Communications',
      readTimeMins: 3,
      isFeatured: true,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-03-11T12:00:00Z'),
      seoTitle: 'Milestone: 25 GW of Clean Energy Capacity | ENEC',
      seoDescription:
        'ENEC reaches 25 gigawatts of installed and committed clean energy capacity, a landmark in our mission to power a cleaner future.',
      tags: ['Clean Energy'],
      viewCount: 2110,
    },
    {
      title: 'Pioneering AI-Driven Predictive Maintenance',
      subtitle: 'Using machine learning to keep the fleet running safely and reliably',
      excerpt:
        'ENEC is deploying AI-driven predictive maintenance systems across its fleet, using machine learning to detect issues before they occur and maximize uptime.',
      content:
        'ENEC is at the forefront of the digital transformation of nuclear operations with the rollout of AI-driven predictive maintenance across its operating fleet. The systems analyze thousands of sensor data points in real time to identify anomalies and predict equipment degradation before failures occur.\n\nEarly results show a significant reduction in unplanned downtime and improved capacity factors at pilot plants. The predictive models integrate vibration, temperature, and acoustic data with maintenance histories, enabling engineers to schedule interventions with precision.\n\n"Digital technology is transforming how we operate," said Prof. Raj Krishnamurthy, Chief Technology Officer. "Our AI-driven systems don\u2019t just detect faults — they help us understand the underlying health of our assets so we can act before problems arise."\n\nThe program is expected to be deployed across the entire fleet by the end of the year, delivering measurable gains in safety, reliability, and economic performance.',
      categoryId: categoryMap['Nuclear Innovation'].id,
      authorName: 'Technology & Innovation Team',
      readTimeMins: 4,
      isFeatured: false,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-02-20T09:30:00Z'),
      seoTitle: 'Pioneering AI-Driven Predictive Maintenance | ENEC',
      seoDescription:
        'ENEC deploys AI-driven predictive maintenance across its fleet to detect issues early and maximize safe, reliable uptime.',
      tags: ['Digital Transformation', 'Reactor Technology'],
      viewCount: 1132,
    },
  ]

  const articleMap: Record<string, { id: string }> = {}

  for (const article of articles) {
    const { tags: tagNames, ...articleData } = article
    const created = await prisma.newsArticle.create({
      data: {
        ...articleData,
        slug: await slugify(article.title),
      },
    })
    articleMap[article.title] = created

    await prisma.newsTagRelation.createMany({
      data: tagNames.map((tagName) => ({
        articleId: created.id,
        tagId: tagMap[tagName].id,
      })),
    })

    console.log(`  ✔️  Article: ${article.title}`)
  }

  // ---------------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating projects --')

  const projects = [
    {
      name: 'Meridian Reactor',
      slug: 'meridian-reactor',
      location: 'Atlanta, GA',
      country: 'USA',
      latitude: 33.749,
      longitude: -84.388,
      capacityMw: 1150,
      technology: 'Pressurized Water Reactor (PWR)',
      status: 'CONSTRUCTION' as const,
      summary:
        'A state-of-the-art pressurized water reactor under construction near Atlanta, designed to provide clean, reliable baseload power to the growing Southeastern United States.',
      description:
        'The Meridian Reactor is an advanced generation III+ pressurized water reactor currently under construction outside Atlanta, Georgia. The project represents one of the largest private infrastructure investments in the region and will deliver 1,150 MW of zero-carbon power to the grid.\n\nThe reactor incorporates the latest passive safety systems and digital control technologies, setting new standards for efficiency and reliability. Construction employs thousands of skilled workers and is expected to create lasting economic benefits for the local community through supply chain engagement and long-term operation.',
      startDate: new Date('2023-05-01'),
      featured: true,
      published: true,
      milestones: [
        { date: new Date('2023-05-01'), title: 'Construction Commenced' },
        { date: new Date('2023-11-15'), title: 'First Concrete Pour for Reactor Building' },
        { date: new Date('2024-09-10'), title: 'Reactor Pressure Vessel Installed' },
        { date: new Date('2026-03-01'), title: 'Fuel Loading Scheduled' },
        { date: new Date('2027-01-15'), title: 'Commercial Operation Scheduled' },
      ],
    },
    {
      name: 'Pacific Clean Energy Plant',
      slug: 'pacific-clean-energy-plant',
      location: 'Sacramento, CA',
      country: 'USA',
      latitude: 38.5816,
      longitude: -121.4944,
      capacityMw: 800,
      technology: 'Advanced Boiling Water Reactor (ABWR)',
      status: 'OPERATIONAL' as const,
      summary:
        'An operational advanced boiling water reactor in Northern California providing clean, reliable electricity to the state\u2019s grid.',
      description:
        'The Pacific Clean Energy Plant is an advanced boiling water reactor operating in Northern California that has delivered clean, reliable baseload electricity for more than a decade. With 800 MW of capacity, the plant powers hundreds of thousands of homes and businesses across the region.\n\nThe plant is recognized for its exceptional operational performance and capacity factor, consistently ranking among the best-performing nuclear units in North America. It operates a rigorous safety and environmental stewardship program in close coordination with state regulators.',
      startDate: new Date('2018-02-01'),
      completionDate: new Date('2020-11-20'),
      featured: true,
      published: true,
      milestones: [
        { date: new Date('2018-02-01'), title: 'Construction Commenced' },
        { date: new Date('2019-06-30'), title: 'Cold Hydraulic Testing Completed' },
        { date: new Date('2020-10-10'), title: 'First Criticality' },
        { date: new Date('2020-11-20'), title: 'Commercial Operation Achieved' },
      ],
    },
    {
      name: 'Northern Energy Hub',
      slug: 'northern-energy-hub',
      location: 'Great Lakes region',
      country: 'USA',
      latitude: 42.0,
      longitude: -87.0,
      capacityMw: 2200,
      technology: 'Multi-Unit LWR Expansion',
      status: 'UNDER_DEVELOPMENT' as const,
      summary:
        'A planned multi-unit expansion in the Great Lakes region that will add 2,200 MW of clean energy capacity to transform the regional energy landscape.',
      description:
        'The Northern Energy Hub is an ambitious multi-unit development in the Great Lakes region designed to add 2,200 MW of clean, reliable power to the regional grid. The project is in the early development stage, with site characterization, permitting, and community engagement underway.\n\nThe hub is being designed as a dual-unit advanced light water reactor station, incorporating lessons from the most efficient new-build programs worldwide. It will create thousands of construction jobs over the build period and support the region\u2019s transition to a low-carbon economy.',
      startDate: new Date('2024-01-15'),
      featured: false,
      published: true,
      milestones: [
        { date: new Date('2024-01-15'), title: 'Development Initiated' },
        { date: new Date('2025-06-01'), title: 'Site Characterization Completed' },
        { date: new Date('2026-02-01'), title: 'Early Site Permit Application Expected' },
      ],
    },
    {
      name: 'Eastern Seaboard Station',
      slug: 'eastern-seaboard-station',
      location: 'Charlotte, NC',
      country: 'USA',
      latitude: 35.2271,
      longitude: -80.8431,
      capacityMw: 1400,
      technology: 'Pressurized Water Reactor (PWR)',
      status: 'COMPLETED' as const,
      summary:
        'A fully commissioned pressurized water reactor in the Carolinas delivering 1,400 MW of clean baseload power to the Eastern Seaboard.',
      description:
        'The Eastern Seaboard Station is a fully operational pressurized water reactor in North Carolina that delivers 1,400 MW of clean, dependable power. Completed ahead of schedule, the station has become a model for modern nuclear construction.\n\nThe station supports the growing demand for reliable electricity across the Southeast while contributing meaningful emissions reductions. Its advanced digital control systems and high capacity factor are benchmarked across the industry.',
      startDate: new Date('2016-03-01'),
      completionDate: new Date('2023-08-30'),
      featured: false,
      published: true,
      milestones: [
        { date: new Date('2016-03-01'), title: 'Construction Commenced' },
        { date: new Date('2022-12-15'), title: 'First Criticality' },
        { date: new Date('2023-08-30'), title: 'Commercial Operation Delivered' },
      ],
    },
    {
      name: 'Central Plains Reactor',
      slug: 'central-plains-reactor',
      location: 'Kansas',
      country: 'USA',
      latitude: 38.5,
      longitude: -98.0,
      capacityMw: 950,
      technology: 'SMR-Scale Light Water Reactor',
      status: 'PLANNED' as const,
      summary:
        'A planned 950 MW reactor in Kansas designed to bring clean, affordable baseload power to the American heartland.',
      description:
        'The Central Plains Reactor is a planned advanced light water reactor in Kansas that will deliver 950 MW of reliable, carbon-free electricity to the central United States. The project is in the planning stage, with site evaluation and preliminary licensing activities underway.\n\nThe reactor will incorporate proven technology and modern construction methods to deliver competitive economics and a fast build schedule. It is expected to provide long-term, stable employment and economic opportunity for rural communities across the region.',
      startDate: new Date('2025-09-01'),
      featured: false,
      published: true,
      milestones: [
        { date: new Date('2025-09-01'), title: 'Planning Initiated' },
        { date: new Date('2026-01-01'), title: 'Site Selection Shortlist Confirmed' },
      ],
    },
    {
      name: 'Southern Coastal Project',
      slug: 'southern-coastal-project',
      location: 'Gulf Coast',
      country: 'USA',
      latitude: 29.5,
      longitude: -90.0,
      capacityMw: 1800,
      technology: 'Dual-Unit Advanced PWR',
      status: 'CONSTRUCTION' as const,
      summary:
        'A dual-unit advanced reactor project under construction on the Gulf Coast set to deliver 1,800 MW of clean energy to the Southern United States.',
      description:
        'The Southern Coastal Project is a dual-unit advanced pressurized water reactor under construction along the Gulf Coast. With 1,800 MW of combined capacity, it is one of the largest civilian nuclear projects in the region and a cornerstone of the company\u2019s clean energy expansion.\n\nThe project leverages modular construction and a proven reactor design to deliver on an aggressive schedule. Thousands of workers are currently employed on site, with substantial local and regional supply chain benefits.',
      startDate: new Date('2024-06-01'),
      featured: true,
      published: true,
      milestones: [
        { date: new Date('2024-06-01'), title: 'Construction Commenced' },
        { date: new Date('2025-04-01'), title: 'Site Grading and Foundations Underway' },
        { date: new Date('2027-01-01'), title: 'Major Equipment Installation Scheduled' },
      ],
    },
  ]

  for (const project of projects) {
    const { milestones, ...projectData } = project
    await prisma.project.create({
      data: {
        ...projectData,
        milestones: {
          create: milestones.map((m, _idx) => ({
            date: m.date,
            title: m.title,
            description: m.title + ' milestone for ' + projectData.name,
          })),
        },
      },
    })
    console.log(`  ✔️  Project: ${project.name} (${project.status})`)
  }

  // ---------------------------------------------------------------------------
  // Jobs
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating jobs --')

  const jobs = [
    {
      title: 'Senior Nuclear Engineer',
      slug: 'senior-nuclear-engineer',
      department: 'Engineering',
      location: 'Atlanta, GA',
      employmentType: 'FULL_TIME' as const,
      summary:
        'Lead engineering activities for advanced reactor systems and support the growing fleet of clean energy plants.',
      description:
        'We are seeking a Senior Nuclear Engineer to join our engineering team in Atlanta. In this role, you will provide technical leadership for reactor design, system engineering, and plant modification projects supporting both operating plants and new construction.\n\nYou will collaborate with multidisciplinary teams, regulators, and external partners to deliver safe, reliable, and efficient nuclear systems. The role offers the opportunity to work on next-generation reactor designs and shape the future of clean energy.',
      requirements:
        'Bachelor\u2019s degree in Nuclear, Mechanical, or Electrical Engineering required; Master\u2019s preferred. Minimum 8 years of relevant nuclear experience. Professional Engineering license preferred. Strong knowledge of reactor systems, safety analysis, and regulatory requirements. Excellent communication and leadership skills.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-01T09:00:00Z'),
      expiresAt: new Date('2024-12-01T00:00:00Z'),
      viewCount: 320,
    },
    {
      title: 'Reactor Systems Analyst',
      slug: 'reactor-systems-analyst',
      department: 'Technology',
      location: 'Remote',
      employmentType: 'FULL_TIME' as const,
      summary:
        'Analyze reactor performance data and help optimize plant operations using advanced digital tools.',
      description:
        'ENEC is looking for a Reactor Systems Analyst to support our remote operations and analytics center. You will analyze operational data, develop performance models, and provide insights that drive efficiency and safety across the fleet.\n\nThis fully remote role is ideal for an analytical professional with a strong understanding of power systems and a passion for data-driven decision making.',
      requirements:
        'Bachelor\u2019s degree in Engineering, Physics, or Data Science. Minimum 3 years of experience in power systems analysis. Familiarity with nuclear operations and safety principles preferred. Proficiency in data analysis tools and statistical methods. Strong problem-solving skills and attention to detail.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-10T09:00:00Z'),
      expiresAt: new Date('2024-11-30T00:00:00Z'),
      viewCount: 245,
    },
    {
      title: 'Safety Culture Specialist',
      slug: 'safety-culture-specialist',
      department: 'Safety',
      location: 'Chicago, IL',
      employmentType: 'FULL_TIME' as const,
      summary:
        'Champion safety culture programs and support continuous improvement across our operating and construction sites.',
      description:
        'We are seeking a Safety Culture Specialist to strengthen and sustain a world-class safety culture across ENEC. Working from our Chicago office, you will develop training programs, facilitate safety assessments, and partner with site leadership to embed safety into daily operations.\n\nThis role is central to our commitment to safety as the foundation of everything we do.',
      requirements:
        'Bachelor\u2019s degree in Safety, Engineering, Psychology, or related field. Minimum 5 years of experience in safety culture or human factors, ideally in nuclear or high-reliability industries. Excellent facilitation and communication skills. Certification in safety management (CSP, CHMM) preferred.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-05T09:00:00Z'),
      expiresAt: new Date('2024-10-31T00:00:00Z'),
      viewCount: 189,
    },
    {
      title: 'Graduate Nuclear Science Program',
      slug: 'graduate-nuclear-science-program',
      department: 'Engineering',
      location: 'Multiple',
      employmentType: 'GRADUATE' as const,
      summary:
        'A structured graduate program for recent graduates launching careers in nuclear science and engineering.',
      description:
        'ENEC\u2019s Graduate Nuclear Science Program is a two-year development program designed for recent graduates with degrees in nuclear science, engineering, or related fields. Participants rotate through engineering, operations, safety, and technology functions to build a broad foundation in the nuclear industry.\n\nGraduates of the program move into permanent engineering or technical roles across the company, with mentorship, specialized training, and the opportunity to work on advanced reactor projects.',
      requirements:
        'Recent graduate (within 2 years) with a Bachelor\u2019s or Master\u2019s degree in Nuclear Engineering, Mechanical Engineering, Physics, or related discipline. Strong academic record. Interest in the nuclear energy industry. Excellent analytical and teamwork skills. Willingness to relocate to program locations.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-01T09:00:00Z'),
      expiresAt: new Date('2024-09-30T00:00:00Z'),
      viewCount: 410,
    },
    {
      title: 'Summer Engineering Internship',
      slug: 'summer-engineering-internship',
      department: 'Engineering',
      location: 'Various',
      employmentType: 'INTERNSHIP' as const,
      summary:
        'A hands-on summer internship for engineering students interested in the nuclear and clean energy sector.',
      description:
        'Our Summer Engineering Internship provides current undergraduate and graduate students with hands-on experience in the nuclear energy industry. Interns are placed on teams across engineering, design, safety, and project management, working on real projects alongside experienced professionals.\n\nThe 12-week paid program includes mentoring, technical training, and networking across the company. High-performing interns are often offered roles in our graduate development program.',
      requirements:
        'Enrolled in an accredited Bachelor\u2019s or Master\u2019s engineering program (Nuclear, Mechanical, Electrical, Civil, or Chemical). Completion of at least second-year coursework. Strong academic performance and communication skills. Must be authorized to work in the United States.',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-05-01T09:00:00Z'),
      expiresAt: new Date('2024-08-01T00:00:00Z'),
      viewCount: 512,
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job })
    console.log(`  ✔️  Job: ${job.title} (${job.employmentType})`)
  }

  // ---------------------------------------------------------------------------
  // Sustainability Metrics
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating sustainability metrics --')

  const metrics = [
    { label: 'Clean Energy Capacity', value: 24.8, unit: 'GW', suffix: null, sortOrder: 1 },
    { label: 'Annual Generation', value: 185, unit: 'TWh', suffix: null, sortOrder: 2 },
    { label: 'Homes Powered', value: 55, unit: 'million', suffix: null, sortOrder: 3 },
    { label: 'CO₂ Avoided Annually', value: 92, unit: 'million tonnes', suffix: null, sortOrder: 4 },
    { label: 'Years of Excellence', value: 50, unit: '', suffix: '+', sortOrder: 5 },
    { label: 'Skilled Professionals', value: 12000, unit: '', suffix: '+', sortOrder: 6 },
    { label: 'Countries & Regions', value: 15, unit: '', suffix: null, sortOrder: 7 },
  ]

  for (const metric of metrics) {
    await prisma.sustainabilityMetric.create({
      data: { ...metric, published: true },
    })
    console.log(`  ✔️  Metric: ${metric.label}`)
  }

  // ---------------------------------------------------------------------------
  // Documents
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating documents --')

  const documents = [
    {
      title: 'Annual Report 2024',
      slug: 'annual-report-2024',
      description:
        'ENEC Annual Report 2024 covering financial performance, operational highlights, project portfolio, and strategic outlook.',
      category: 'ANNUAL_REPORT' as const,
      fileUrl: '/documents/annual-report-2024.pdf',
      fileSizeKb: 8400,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2025-03-15T09:00:00Z'),
      downloadCount: 832,
    },
    {
      title: 'Sustainability Report 2024',
      slug: 'sustainability-report-2024',
      description:
        'A comprehensive account of ENEC\u2019s environmental, social, and governance performance during 2024.',
      category: 'SUSTAINABILITY_REPORT' as const,
      fileUrl: '/documents/sustainability-report-2024.pdf',
      fileSizeKb: 6400,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2025-03-22T09:00:00Z'),
      downloadCount: 610,
    },
    {
      title: 'Nuclear Safety Performance Report',
      slug: 'nuclear-safety-performance-report',
      description:
        'Annual technical report detailing safety metrics, event analysis, and continuous improvement initiatives across the fleet.',
      category: 'TECHNICAL_REPORT' as const,
      fileUrl: '/documents/nuclear-safety-performance-report.pdf',
      fileSizeKb: 5200,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2025-04-10T09:00:00Z'),
      downloadCount: 410,
    },
    {
      title: 'Corporate Governance Framework',
      slug: 'corporate-governance-framework',
      description:
        'Defines the governance structure, board responsibilities, risk management, and ethical standards guiding ENEC.',
      category: 'POLICY' as const,
      fileUrl: '/documents/corporate-governance-framework.pdf',
      fileSizeKb: 3100,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2024-07-01T09:00:00Z'),
      downloadCount: 225,
    },
    {
      title: 'Community Impact Report 2024',
      slug: 'community-impact-report-2024',
      description:
        'Highlights ENEC\u2019s community investment, local partnerships, education initiatives, and social contributions in 2024.',
      category: 'PUBLICATION' as const,
      fileUrl: '/documents/community-impact-report-2024.pdf',
      fileSizeKb: 4800,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2025-02-01T09:00:00Z'),
      downloadCount: 320,
    },
    {
      title: 'Environmental Stewardship Summary',
      slug: 'environmental-stewardship-summary',
      description:
        'A summary of environmental performance, emissions avoided, water stewardship, and biodiversity commitments.',
      category: 'SUSTAINABILITY_REPORT' as const,
      fileUrl: '/documents/environmental-stewardship-summary.pdf',
      fileSizeKb: 2100,
      fileType: 'pdf',
      year: 2024,
      publishedAt: new Date('2025-01-15T09:00:00Z'),
      downloadCount: 540,
    },
  ]

  for (const doc of documents) {
    await prisma.document.create({
      data: { ...doc, published: true },
    })
    console.log(`  ✔️  Document: ${doc.title}`)
  }

  // ---------------------------------------------------------------------------
  // Site Settings
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating site settings --')

  const siteSettings = [
    { key: 'site_name', value: 'Emirates Nuclear Energy Corporation', group: 'general' },
    { key: 'site_tagline', value: 'Powering a Cleaner Energy Future', group: 'general' },
    { key: 'contact_email', value: 'info@enec.in', group: 'contact' },
    {
      key: 'headquarters',
      value: 'Abu Dhabi, United Arab Emirates',
      group: 'general',
    },
    // Editable website content (Website Editor / admin/site)
    {
      key: 'heroEyebrow',
      value: 'Emirates Nuclear Energy Corporation',
      group: 'content',
    },
    {
      key: 'heroTitle',
      value: 'Powering a Cleaner Energy Future',
      group: 'content',
    },
    {
      key: 'heroSubtitle',
      value:
        'A global leader in nuclear energy and advanced clean power technologies, delivering reliable baseload electricity for generations.',
      group: 'content',
    },
    { key: 'heroPrimaryCta', value: '', group: 'content' },
    { key: 'heroSecondaryCta', value: '', group: 'content' },
    {
      key: 'footerIntro',
      value: 'Powering a Cleaner Energy Future. Abu Dhabi, United Arab Emirates.',
      group: 'content',
    },
    { key: 'nav.overrides', value: '{}', group: 'navigation' },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
    console.log(`  ✔️  Setting: ${setting.key}`)
  }

  // ---------------------------------------------------------------------------
  // Navigation Items (main nav)
  // ---------------------------------------------------------------------------
  console.log('\n-- Creating navigation items --')

  const nav = [
    { label: 'Home', href: '/', sortOrder: 1 },
    { label: 'About Us', href: '/about', sortOrder: 2 },
    { label: 'Projects', href: '/projects', sortOrder: 3 },
    { label: 'Sustainability', href: '/sustainability', sortOrder: 4 },
    { label: 'Careers', href: '/careers', sortOrder: 5 },
    { label: 'News', href: '/news', sortOrder: 6 },
    { label: 'Documents', href: '/documents', sortOrder: 7 },
    { label: 'Contact', href: '/contact', sortOrder: 8 },
  ]

  const navCreated = await prisma.navigationItem.createMany({
    data: nav,
  })

  console.log(`  ✔️  Created ${navCreated.count} main navigation items`)

  // ---------------------------------------------------------------------------
  // Done
  // ---------------------------------------------------------------------------
  console.log('\n✅ Database seeded successfully!')
  console.log('   Users: 2')
  console.log('   Employees: 3, Tasks: 6, Announcements: 3')
  console.log('   Leadership Profiles: 6')
  console.log('   News Categories: 6, Tags: 6, Articles: 6')
  console.log('   Projects: 6')
  console.log('   Jobs: 5')
  console.log('   Sustainability Metrics: 7')
  console.log('   Documents: 6')
  console.log('   Site Settings: 5')
  console.log('   Navigation Items: 8')
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
