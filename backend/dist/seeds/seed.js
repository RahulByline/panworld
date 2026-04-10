import bcrypt from "bcryptjs";
import { prisma } from "../prisma/client.js";
function mulberry32(seed) {
    return function () {
        // eslint-disable-next-line no-param-reassign
        seed |= 0;
        // eslint-disable-next-line no-param-reassign
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function pick(r, arr) {
    return arr[Math.floor(r() * arr.length)];
}
function int(r, min, max) {
    return Math.floor(r() * (max - min + 1)) + min;
}
function money(n) {
    return Number(n.toFixed(2));
}
function pad(n, len = 4) {
    return String(n).padStart(len, "0");
}
const DEMO_PASSWORD = "Panworld@123";
async function main() {
    const r = mulberry32(20260409);
    // wipe (safe for local demo)
    await prisma.refreshToken.deleteMany();
    await prisma.download.deleteMany();
    await prisma.webinarRegistration.deleteMany();
    await prisma.pDEnrollment.deleteMany();
    await prisma.userTrainingProgress.deleteMany();
    await prisma.supportMessage.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.rFQItem.deleteMany();
    await prisma.quotation.deleteMany();
    await prisma.rFQ.deleteMany();
    await prisma.delivery.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.sampleRequest.deleteMany();
    await prisma.demoRequest.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.trainingVideo.deleteMany();
    await prisma.trainingSeries.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.webinar.deleteMany();
    await prisma.pDCourse.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.chatbotLog.deleteMany();
    await prisma.recommendationLog.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.nPSSurvey.deleteMany();
    await prisma.languagePreference.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.integrationSyncLog.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
    await prisma.schoolGroup.deleteMany();
    await prisma.publisher.deleteMany();
    const publishers = [
        "McGraw Hill",
        "Kodeit Global",
        "StudySync",
        "Achieve3000",
        "PowerSchool",
        "Oxford",
        "Cambridge",
        "Pearson/Savvas",
        "Collins",
        "Jolly Phonics",
    ];
    const publisherRows = await prisma.publisher.createMany({
        data: publishers.map((name) => ({ name })),
    });
    void publisherRows;
    const publisherList = await prisma.publisher.findMany();
    const group = await prisma.schoolGroup.create({ data: { name: "Al Noor Education Group" } });
    const schoolsSeed = [
        { name: "Dubai American Academy", country: "UAE", curriculumType: "American", purchaseStatus: "REGISTERED_NO_ORDERS" },
        { name: "Abu Dhabi British School", country: "UAE", curriculumType: "British", purchaseStatus: "FIRST_ORDER_CONFIRMED" },
        { name: "Sharjah Mixed Curriculum School", country: "UAE", curriculumType: "Mixed", purchaseStatus: "ACTIVE_REPEAT" },
        { name: "Riyadh American International School", country: "KSA", curriculumType: "American", purchaseStatus: "REGISTERED_NO_ORDERS" },
        { name: "Jeddah NCC Academy", country: "KSA", curriculumType: "Saudi NCC", purchaseStatus: "FIRST_ORDER_CONFIRMED" },
        { name: "Dammam National Curriculum School", country: "KSA", curriculumType: "Saudi NCC", purchaseStatus: "ACTIVE_REPEAT" },
        { name: "Al Noor Campus - Dubai", country: "UAE", curriculumType: "American", purchaseStatus: "ACTIVE_REPEAT", groupId: group.id },
        { name: "Al Noor Campus - Abu Dhabi", country: "UAE", curriculumType: "British", purchaseStatus: "ACTIVE_REPEAT", groupId: group.id },
        { name: "Al Noor Campus - Sharjah", country: "UAE", curriculumType: "IB", purchaseStatus: "FIRST_ORDER_CONFIRMED", groupId: group.id },
        { name: "Ajman Primary School", country: "UAE", curriculumType: "UAE MOE", purchaseStatus: "REGISTERED_NO_ORDERS" },
        { name: "Al Khobar International School", country: "KSA", curriculumType: "British", purchaseStatus: "ACTIVE_REPEAT" },
        { name: "Madinah Learning Center", country: "KSA", curriculumType: "Mixed", purchaseStatus: "REGISTERED_NO_ORDERS" },
    ];
    const schools = await Promise.all(schoolsSeed.map((s) => prisma.school.create({
        data: {
            name: s.name,
            country: s.country,
            curriculumType: s.curriculumType,
            purchaseStatus: s.purchaseStatus,
            preferredLang: s.country === "KSA" ? "ar" : "en",
            enabledModules: {
                phase1: true,
                phase2: s.purchaseStatus !== "REGISTERED_NO_ORDERS",
                phase3: s.purchaseStatus !== "REGISTERED_NO_ORDERS",
                assessment: s.name.includes("NCC") || s.country === "KSA",
                kodeitAcademy: true,
            },
            vatRate: s.country === "KSA" ? 15 : 5,
            groupId: s.groupId ?? null,
            branding: { logoUrl: null, primaryColor: "#0f172a" },
        },
    })));
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    // Core demo accounts (requested)
    const primarySchool = schools[1];
    const publisher = pick(r, publisherList);
    await prisma.user.createMany({
        data: [
            {
                email: "teacher@panworld-demo.com",
                passwordHash,
                firstName: "Aisha",
                lastName: "Teacher",
                role: "TEACHER",
                schoolId: primarySchool.id,
                preferredLang: primarySchool.preferredLang,
                department: "English",
            },
            {
                email: "hod@panworld-demo.com",
                passwordHash,
                firstName: "Omar",
                lastName: "HOD",
                role: "HOD",
                schoolId: primarySchool.id,
                preferredLang: primarySchool.preferredLang,
                department: "Math",
            },
            {
                email: "management@panworld-demo.com",
                passwordHash,
                firstName: "Sara",
                lastName: "Management",
                role: "MANAGEMENT",
                schoolId: primarySchool.id,
                preferredLang: primarySchool.preferredLang,
            },
            {
                email: "ceo@panworld-demo.com",
                passwordHash,
                firstName: "Khalid",
                lastName: "CEO",
                role: "CEO",
                schoolId: primarySchool.id,
                preferredLang: primarySchool.preferredLang,
            },
            {
                email: "procurement@panworld-demo.com",
                passwordHash,
                firstName: "Lina",
                lastName: "Procurement",
                role: "PROCUREMENT",
                schoolId: primarySchool.id,
                preferredLang: primarySchool.preferredLang,
            },
            {
                email: "admin@panworld-demo.com",
                passwordHash,
                firstName: "Panworld",
                lastName: "Admin",
                role: "PANWORLD_ADMIN",
                schoolId: null,
                preferredLang: "en",
            },
            {
                email: "publisher@panworld-demo.com",
                passwordHash,
                firstName: "Publisher",
                lastName: "Partner",
                role: "PUBLISHER",
                publisherId: publisher.id,
                schoolId: null,
                preferredLang: "en",
            },
        ],
    });
    // Bulk users
    const departments = ["English", "Math", "Science", "Arabic", "ICT", "Social Studies"];
    const firstNames = ["Aisha", "Mariam", "Fatima", "Noor", "Reem", "Hessa", "Omar", "Saad", "Khalid", "Yousef", "Ahmed", "Hamad"];
    const lastNames = ["Al Ali", "Al Saeed", "Hassan", "Khan", "Smith", "Patel", "Al Zahrani", "Al Harbi", "Al Nasser"];
    const userRows = [];
    let teacherCount = 0;
    let hodCount = 0;
    let mgmtCount = 0;
    let ceoCount = 0;
    let procurementCount = 0;
    let adminCount = 0;
    let publisherCount = 0;
    for (let i = 0; i < 55; i++) {
        const school = pick(r, schools);
        const rolePool = ["TEACHER", "TEACHER", "TEACHER", "HOD", "MANAGEMENT", "CEO", "PROCUREMENT"];
        const role = pick(r, rolePool);
        if (role === "TEACHER")
            teacherCount++;
        if (role === "HOD")
            hodCount++;
        if (role === "MANAGEMENT")
            mgmtCount++;
        if (role === "CEO")
            ceoCount++;
        if (role === "PROCUREMENT")
            procurementCount++;
        userRows.push({
            email: `user${pad(i + 1)}@school-demo.com`,
            passwordHash,
            firstName: pick(r, firstNames),
            lastName: pick(r, lastNames),
            role,
            schoolId: school.id,
            department: role === "TEACHER" || role === "HOD" ? pick(r, departments) : null,
            preferredLang: school.preferredLang,
        });
    }
    // extra Panworld admins and publisher users to satisfy minimums
    for (let i = 0; i < 3; i++) {
        adminCount++;
        userRows.push({
            email: `pw.admin${i + 1}@panworld-demo.com`,
            passwordHash,
            firstName: "Panworld",
            lastName: `Ops ${i + 1}`,
            role: "PANWORLD_ADMIN",
            schoolId: null,
            preferredLang: "en",
        });
    }
    for (let i = 0; i < 7; i++) {
        publisherCount++;
        const pub = pick(r, publisherList);
        userRows.push({
            email: `pub.user${i + 1}@publisher-demo.com`,
            passwordHash,
            firstName: "Partner",
            lastName: `User ${i + 1}`,
            role: "PUBLISHER",
            publisherId: pub.id,
            schoolId: null,
            preferredLang: "en",
        });
    }
    await prisma.user.createMany({ data: userRows });
    const users = await prisma.user.findMany();
    // Products: 80 textbooks, 30 library, 15 kits, 20 resources (as Product type RESOURCE), 10 uniforms
    const subjects = ["English", "Math", "Science", "Arabic", "ICT", "Social Studies"];
    const formats = ["Print", "Digital", "Print+Digital"];
    const editionsUAE = ["UAE Edition 2025", "GCC Edition 2024"];
    const editionsKSA = ["KSA Edition 2025", "NCC Edition 2024"];
    const curricula = ["American", "British", "IB", "UAE MOE", "Saudi NCC", "Mixed"];
    const productRows = [];
    let skuCounter = 10000;
    function mkProduct(type) {
        const pub = pick(r, publisherList);
        const gradeMin = int(r, 1, 10);
        const gradeMax = Math.min(12, gradeMin + int(r, 0, 3));
        const isKsaFav = r() < 0.45;
        const countryTags = isKsaFav ? ["KSA", "UAE"] : ["UAE", "KSA"];
        const edition = isKsaFav ? pick(r, editionsKSA) : pick(r, editionsUAE);
        const nccApproved = edition.includes("NCC") || (isKsaFav && r() < 0.6);
        const subject = pick(r, subjects);
        skuCounter++;
        const sku = `PW-${type.slice(0, 3).toUpperCase()}-${skuCounter}`;
        return {
            sku,
            name: type === "LIBRARY"
                ? `${pick(r, ["The Hidden Door", "Moonlight Tales", "Desert Stars", "Ocean Secrets", "The Silver Fox"])}`
                : type === "KIT"
                    ? `${subject} Classroom Kit - Grade ${gradeMin}`
                    : type === "UNIFORM"
                        ? `${pick(r, ["PE Uniform", "School Polo", "Winter Jacket", "Sports Kit"])}`
                        : `${pick(r, ["Core", "Mastery", "Foundations", "Excellence", "Skills"])} ${subject} - Grade ${gradeMin}`,
            seriesName: type === "LIBRARY" ? null : `${pick(r, ["Pathways", "Horizon", "NextGen", "BrightStart", "Scholar"])}`,
            type,
            gradeMin: type === "UNIFORM" ? null : gradeMin,
            gradeMax: type === "UNIFORM" ? null : gradeMax,
            subject: type === "UNIFORM" ? null : subject,
            curriculum: pick(r, curricula),
            format: type === "KIT" || type === "UNIFORM" ? "Physical" : pick(r, formats),
            edition,
            countryTags,
            nccApproved,
            price: money(int(r, 35, type === "KIT" ? 950 : 180) + r()),
            coverImageUrl: null,
            metadata: type === "KIT"
                ? { moq: int(r, 1, 20), contents: ["Teacher guide", "Manipulatives", "Student pack"], replenishment: true }
                : type === "LIBRARY"
                    ? { genre: pick(r, ["Adventure", "Mystery", "Non-fiction", "Fantasy"]), language: pick(r, ["English", "Arabic"]) }
                    : type === "UNIFORM"
                        ? { sizes: ["XS", "S", "M", "L", "XL"], moq: 10 }
                        : { demoAvailable: r() < 0.55 },
            publisherId: pub.id,
        };
    }
    for (let i = 0; i < 80; i++)
        productRows.push(mkProduct("TEXTBOOK"));
    for (let i = 0; i < 30; i++)
        productRows.push(mkProduct("LIBRARY"));
    for (let i = 0; i < 15; i++)
        productRows.push(mkProduct("KIT"));
    for (let i = 0; i < 20; i++)
        productRows.push(mkProduct("RESOURCE"));
    for (let i = 0; i < 10; i++)
        productRows.push(mkProduct("UNIFORM"));
    await prisma.product.createMany({ data: productRows });
    const products = await prisma.product.findMany();
    // Announcements (40)
    const annRows = [];
    for (let i = 0; i < 40; i++) {
        const title = pick(r, [
            "New Titles Released",
            "Webinar Registration Open",
            "Assessment Upgrade Available",
            "Publisher Spotlight",
            "Training Week",
            "KSA NCC Updates",
            "UAE Edition Updates",
        ]);
        annRows.push({
            title: `${title} #${i + 1}`,
            body: "This is a realistic mock announcement with actionable details, links, and timelines. Use the CTA to explore the related module.",
            category: pick(r, ["Product", "Training", "Webinar", "Admin", "Support"]),
            pinned: i < 3,
            audience: { roles: ["TEACHER", "HOD", "MANAGEMENT", "CEO", "PROCUREMENT"], countries: ["UAE", "KSA"] },
            createdByUserId: pick(r, users.filter((u) => u.role === "PANWORLD_ADMIN")).id,
        });
    }
    await prisma.announcement.createMany({ data: annRows });
    // Training series (20) + videos (3-6 each)
    const seriesRows = [];
    for (let i = 0; i < 20; i++) {
        const pub = pick(r, publisherList);
        seriesRows.push({
            title: `${pub.name} Implementation Series ${i + 1}`,
            description: "Structured training for onboarding and classroom implementation.",
            publisherId: pub.id,
        });
    }
    const createdSeries = await Promise.all(seriesRows.map((s) => prisma.trainingSeries.create({ data: s })));
    for (const s of createdSeries) {
        const count = int(r, 3, 6);
        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.trainingVideo.create({
                data: {
                    seriesId: s.id,
                    title: `Module ${i + 1}: ${pick(r, ["Getting Started", "Classroom Setup", "Reports & Analytics", "Assessments", "Best Practices"])}`,
                    durationMin: int(r, 6, 22),
                    orderIndex: i + 1,
                    videoUrl: null,
                    chapterMarkers: [{ t: 0, label: "Intro" }, { t: 120, label: "Key steps" }],
                },
            });
        }
    }
    // Webinars (12)
    for (let i = 0; i < 12; i++) {
        const pub = pick(r, publisherList);
        // eslint-disable-next-line no-await-in-loop
        await prisma.webinar.create({
            data: {
                title: `${pub.name} Webinar: ${pick(r, ["Differentiation", "School Rollout", "Leadership Insights", "Assessment Readiness"])} ${i + 1}`,
                description: "Live session with Q&A and practical rollout steps.",
                startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, -30, 60)),
                durationMin: pick(r, [45, 60, 75]),
                publisherId: pub.id,
            },
        });
    }
    // PD courses (6)
    for (let i = 0; i < 6; i++) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.pDCourse.create({
            data: {
                title: `Kodeit Academy Course ${i + 1}: ${pick(r, ["Coaching", "Blended Learning", "Literacy", "Data-Driven Teaching", "AI in School"])}`,
                description: "Mock Kodeit Academy course with enrolment-based access.",
                isPaid: i % 2 === 0,
                price: money(i % 2 === 0 ? int(r, 250, 900) : 0),
            },
        });
    }
    // Resources (20)
    for (let i = 0; i < 20; i++) {
        const pub = pick(r, publisherList);
        // eslint-disable-next-line no-await-in-loop
        await prisma.resource.create({
            data: {
                title: `Resource Pack ${i + 1}: ${pick(r, ["Lesson Plans", "Parent Letter", "Assessment Guide", "Admin Checklist", "Rubrics"])}`,
                description: "Downloadable mock resource with tracking.",
                type: pick(r, ["PDF", "PPT", "DOC", "LINK"]),
                url: null,
                isPremium: r() < 0.3,
                tags: { subject: pick(r, subjects), grades: [int(r, 1, 6), int(r, 7, 12)].sort() },
                publisherId: pub.id,
            },
        });
    }
    // Per-school wishlist + items
    for (const school of schools) {
        // eslint-disable-next-line no-await-in-loop
        const wl = await prisma.wishlist.create({ data: { schoolId: school.id, name: "School Wishlist" } });
        const schoolUsers = users.filter((u) => u.schoolId === school.id);
        for (let i = 0; i < int(r, 6, 16); i++) {
            const p = pick(r, products);
            // eslint-disable-next-line no-await-in-loop
            await prisma.wishlistItem.create({
                data: {
                    wishlistId: wl.id,
                    productId: p.id,
                    addedByUserId: schoolUsers.length ? pick(r, schoolUsers).id : null,
                    tags: { stale: r() < 0.2 },
                },
            });
        }
    }
    // RFQs (25) + items + quotations
    for (let i = 0; i < 25; i++) {
        const school = pick(r, schools);
        const schoolUsers = users.filter((u) => u.schoolId === school.id);
        const creator = schoolUsers.length ? pick(r, schoolUsers) : null;
        const rfq = await prisma.rFQ.create({
            data: {
                rfqNo: `RFQ-${new Date().getFullYear()}-${pad(i + 1, 5)}`,
                status: pick(r, ["SUBMITTED", "REVIEWED", "QUOTED", "APPROVED", "ORDERED", "DELIVERED"]),
                schoolId: school.id,
                createdByUserId: creator?.id ?? null,
                notes: "Mock RFQ notes including delivery preferences and curriculum alignment.",
            },
        });
        const itemCount = int(r, 2, 8);
        let subtotal = 0;
        for (let j = 0; j < itemCount; j++) {
            const p = pick(r, products.filter((x) => x.type !== "UNIFORM"));
            const qty = int(r, 10, 180);
            const unitPrice = Number(p.price);
            subtotal += qty * unitPrice;
            // eslint-disable-next-line no-await-in-loop
            await prisma.rFQItem.create({
                data: { rfqId: rfq.id, productId: p.id, quantity: qty, unitPrice: unitPrice },
            });
        }
        if (["QUOTED", "APPROVED", "ORDERED", "DELIVERED"].includes(rfq.status)) {
            const vatRate = Number(school.vatRate) / 100;
            const vatAmount = subtotal * vatRate;
            const total = subtotal + vatAmount;
            // eslint-disable-next-line no-await-in-loop
            await prisma.quotation.create({
                data: {
                    rfqId: rfq.id,
                    quoteNo: `Q-${new Date().getFullYear()}-${pad(i + 1, 5)}`,
                    subtotal: subtotal,
                    vatAmount: vatAmount,
                    total: total,
                    fileUrl: null,
                },
            });
        }
    }
    // Orders (35) + deliveries, invoices (40)
    for (let i = 0; i < 35; i++) {
        const school = pick(r, schools);
        const order = await prisma.order.create({
            data: {
                orderNo: `SO-${new Date().getFullYear()}-${pad(i + 1, 5)}`,
                status: pick(r, ["CONFIRMED", "PROCESSING", "DISPATCHED", "DELIVERED"]),
                schoolId: school.id,
            },
        });
        const itemCount = int(r, 2, 6);
        let subtotal = 0;
        for (let j = 0; j < itemCount; j++) {
            const p = pick(r, products.filter((x) => x.type === "TEXTBOOK" || x.type === "KIT" || x.type === "LIBRARY"));
            const qty = int(r, 5, 120);
            const unitPrice = Number(p.price);
            subtotal += qty * unitPrice;
            // eslint-disable-next-line no-await-in-loop
            await prisma.orderItem.create({
                data: { orderId: order.id, productId: p.id, quantity: qty, unitPrice: unitPrice },
            });
        }
        // delivery
        // eslint-disable-next-line no-await-in-loop
        await prisma.delivery.create({
            data: {
                orderId: order.id,
                courier: pick(r, ["Aramex", "DHL", "SMSA", "Fetchr"]),
                trackingNo: `TRK-${int(r, 10000000, 99999999)}`,
                eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, 2, 14)),
                deliveredAt: order.status === "DELIVERED" ? new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 20)) : null,
                timeline: [
                    { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), status: "Order confirmed" },
                    { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), status: "Dispatched" },
                ],
            },
        });
        // invoice (some schools will have multiple)
        const vatRate = Number(school.vatRate) / 100;
        const vatAmount = subtotal * vatRate;
        const total = subtotal + vatAmount;
        // eslint-disable-next-line no-await-in-loop
        await prisma.invoice.create({
            data: {
                schoolId: school.id,
                invoiceNo: `INV-${new Date().getFullYear()}-${pad(i + 1, 5)}`,
                status: r() < 0.45 ? "PAID" : "OUTSTANDING",
                subtotal: subtotal,
                vatAmount: vatAmount,
                total: total,
                issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 120)),
                dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, 7, 45)),
                pdfUrl: null,
            },
        });
    }
    // Extra invoices to reach 40
    const existingInvoiceCount = await prisma.invoice.count();
    for (let i = existingInvoiceCount; i < 40; i++) {
        const school = pick(r, schools);
        // eslint-disable-next-line no-await-in-loop
        await prisma.invoice.create({
            data: {
                schoolId: school.id,
                invoiceNo: `INV-${new Date().getFullYear()}-${pad(i + 1, 5)}`,
                status: r() < 0.35 ? "PAID" : "OUTSTANDING",
                subtotal: 25000,
                vatAmount: (25000 * (Number(school.vatRate) / 100)),
                total: (25000 * (1 + Number(school.vatRate) / 100)),
                issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 180)),
                dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * int(r, 10, 60)),
            },
        });
    }
    // Support tickets (30) + messages
    const schoolUsers = users.filter((u) => u.schoolId);
    for (let i = 0; i < 30; i++) {
        const u = pick(r, schoolUsers);
        const ticket = await prisma.supportTicket.create({
            data: {
                schoolId: u.schoolId,
                createdByUserId: u.id,
                subject: `${pick(r, ["Login issue", "Training access", "Demo credentials", "Invoice question", "Assessment launch"])} #${i + 1}`,
                description: "Mock ticket with enough detail to feel real. Includes environment, steps, and expected behavior.",
                status: pick(r, ["OPEN", "IN_PROGRESS", "RESOLVED"]),
                attachments: { screenshots: [] },
            },
        });
        const msgs = int(r, 2, 6);
        for (let j = 0; j < msgs; j++) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.supportMessage.create({
                data: {
                    ticketId: ticket.id,
                    authorUserId: j % 3 === 0 ? pick(r, users.filter((x) => x.role === "PANWORLD_ADMIN")).id : u.id,
                    body: pick(r, [
                        "Thanks—can you confirm the browser/version?",
                        "We reproduced this in the demo environment and are working on a fix.",
                        "Please try again; credentials have been re-sent via email and WhatsApp (mock).",
                        "Resolved: permissions were updated for your role (mock).",
                    ]),
                },
            });
        }
    }
    // Certificates (50)
    const teacherUsers = users.filter((u) => u.role === "TEACHER" || u.role === "HOD");
    for (let i = 0; i < 50; i++) {
        const u = pick(r, teacherUsers);
        // eslint-disable-next-line no-await-in-loop
        await prisma.certificate.create({
            data: {
                certificateNo: `CERT-${new Date().getFullYear()}-${pad(i + 1, 6)}`,
                title: pick(r, ["Product Implementation", "Assessment Readiness", "Data & Reporting", "Leadership Rollout"]),
                schoolId: u.schoolId,
                userId: u.id,
                metadata: { hours: int(r, 1, 6), issuer: "Panworld Education" },
                issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * int(r, 1, 200)),
            },
        });
    }
    // Sample requests (25)
    for (let i = 0; i < 25; i++) {
        const school = pick(r, schools);
        const p = pick(r, products.filter((x) => x.type === "TEXTBOOK" || x.type === "KIT" || x.type === "LIBRARY"));
        // eslint-disable-next-line no-await-in-loop
        await prisma.sampleRequest.create({
            data: {
                schoolId: school.id,
                productId: p.id,
                status: pick(r, ["SUBMITTED", "REVIEWED", "APPROVED", "DISPATCHED", "DELIVERED"]),
                timeline: [
                    { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), status: "Submitted" },
                    { at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), status: "Reviewed" },
                ],
            },
        });
    }
    // Training progress records for many users
    const series = await prisma.trainingSeries.findMany();
    for (const u of teacherUsers.slice(0, 45)) {
        const take = int(r, 2, 5);
        for (let i = 0; i < take; i++) {
            const s = pick(r, series);
            // eslint-disable-next-line no-await-in-loop
            await prisma.userTrainingProgress.upsert({
                where: { userId_seriesId: { userId: u.id, seriesId: s.id } },
                update: {},
                create: {
                    userId: u.id,
                    seriesId: s.id,
                    progressPct: int(r, 0, 100),
                    completedAt: null,
                },
            });
        }
    }
    // Some integration sync logs
    for (let i = 0; i < 20; i++) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.integrationSyncLog.create({
            data: {
                system: "ODOO",
                direction: pick(r, ["PUSH", "PULL"]),
                status: r() < 0.85 ? "OK" : "ERROR",
                message: "Mock sync run for demo readiness.",
                payload: { runId: `sync_${i + 1}`, objects: int(r, 10, 120) },
            },
        });
    }
    // Default language preferences for all users
    for (const u of users) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.languagePreference.create({
            data: {
                userId: u.id,
                lang: u.preferredLang,
                rtl: u.preferredLang === "ar",
            },
        });
    }
    // eslint-disable-next-line no-console
    console.log("Seed complete.");
    // eslint-disable-next-line no-console
    console.log("Demo password:", DEMO_PASSWORD);
}
main()
    .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
