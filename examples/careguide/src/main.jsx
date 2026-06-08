import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Banner,
  Button,
  Card,
  DataTable,
  Fieldset,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Link,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SelectField,
  SegmentedControl,
  Stack,
  TextareaField,
  TextField,
} from "../../../packages/react/src/index.js";
import "./styles.css";

const member = {
  name: "Maya Chen",
  pronouns: "she/her",
  memberId: "CGD-482-19-7741",
  group: "Northstar Robotics",
  plan: "CareGuide Choice PPO",
  tier: "Gold",
  status: "Active",
  effectiveDate: "Jan 1, 2026",
  renewalDate: "Dec 31, 2026",
  pcp: "Dr. Lena Patel",
  pcpPractice: "Harbor Primary Care",
  pcpPhone: "(206) 555-0184",
};

const familyMembers = [
  { name: "Maya Chen", role: "Subscriber", age: 38, pcp: "Dr. Lena Patel", status: "Active" },
  { name: "Noah Chen", role: "Spouse", age: 39, pcp: "Dr. Victor Lee", status: "Active" },
  { name: "Ellis Chen", role: "Dependent", age: 11, pcp: "Dr. Priya Mehta", status: "Active" },
];

const planUsage = [
  { label: "Individual deductible", used: 860, total: 1500, helper: "$640 remaining before coinsurance" },
  { label: "Family deductible", used: 2140, total: 3000, helper: "$860 remaining" },
  { label: "Out-of-pocket max", used: 1380, total: 5000, helper: "$3,620 safety net remaining" },
];

const benefitCards = [
  {
    title: "Primary care visit",
    cost: "$25 copay",
    detail: "In network, deductible does not apply",
    icon: "stethoscope",
    status: "Ready to use",
  },
  {
    title: "Urgent care",
    cost: "$60 copay",
    detail: "No referral required for in-network clinics",
    icon: "local_hospital",
    status: "Ready to use",
  },
  {
    title: "Mental health therapy",
    cost: "$35 copay",
    detail: "Virtual and in-person visits covered",
    icon: "psychology",
    status: "Expanded network",
  },
  {
    title: "Specialist visit",
    cost: "20% coinsurance",
    detail: "After deductible; prior authorization for some services",
    icon: "medical_services",
    status: "Check authorization",
  },
];

const spendingAccounts = [
  { label: "HSA balance", amount: "$1,842.20", note: "Next payroll deposit: Jun 15" },
  { label: "2026 employer contribution", amount: "$750.00", note: "$500 received, $250 pending" },
  { label: "Eligible receipts waiting", amount: "$128.64", note: "2 expenses can be reimbursed" },
];

const initialTasks = [
  {
    id: "upload-eob",
    title: "Upload itemized bill for claim CG-10492",
    due: "Due Jun 12",
    priority: "High",
    detail: "Evergreen Imaging needs the itemized bill before the appeal window closes.",
  },
  {
    id: "choose-dental",
    title: "Choose a pediatric dentist for Ellis",
    due: "Due Jun 18",
    priority: "Medium",
    detail: "Three in-network dentists near Ballard are accepting new patients.",
  },
  {
    id: "rx-review",
    title: "Review a lower-cost pharmacy option",
    due: "Due Jun 20",
    priority: "Medium",
    detail: "Switching Maya's inhaler refill to CareGuide Mail can save about $18.",
  },
  {
    id: "wellness-attestation",
    title: "Complete annual wellness attestation",
    due: "Due Jul 1",
    priority: "Low",
    detail: "Complete this to unlock the $150 wellness reward.",
  },
];

const claims = [
  {
    id: "CG-10541",
    serviceDate: "2026-05-29",
    provider: "Harbor Primary Care",
    category: "Office visit",
    member: "Maya",
    status: "Approved",
    billed: 268,
    planPaid: 218,
    memberOwes: 25,
  },
  {
    id: "CG-10508",
    serviceDate: "2026-05-16",
    provider: "Northwest Labs",
    category: "Lab work",
    member: "Maya",
    status: "Processing",
    billed: 412,
    planPaid: 0,
    memberOwes: 0,
  },
  {
    id: "CG-10492",
    serviceDate: "2026-05-03",
    provider: "Evergreen Imaging",
    category: "MRI",
    member: "Noah",
    status: "Needs info",
    billed: 2140,
    planPaid: 940,
    memberOwes: 620,
  },
  {
    id: "CG-10467",
    serviceDate: "2026-04-22",
    provider: "Ballard Children's Clinic",
    category: "Pediatric visit",
    member: "Ellis",
    status: "Approved",
    billed: 184,
    planPaid: 159,
    memberOwes: 25,
  },
  {
    id: "CG-10398",
    serviceDate: "2026-04-02",
    provider: "Mindwell Therapy",
    category: "Behavioral health",
    member: "Maya",
    status: "Approved",
    billed: 190,
    planPaid: 145,
    memberOwes: 35,
  },
];

const providers = [
  {
    id: "p1",
    name: "Harbor Primary Care",
    specialty: "Primary care",
    clinician: "Dr. Lena Patel",
    distance: 1.2,
    rating: 4.9,
    next: "Tomorrow, 9:40 AM",
    cost: "$25 copay",
    network: "Tier 1 preferred",
    languages: ["English", "Mandarin"],
  },
  {
    id: "p2",
    name: "Cascade Orthopedics",
    specialty: "Orthopedics",
    clinician: "Dr. Marcus Hill",
    distance: 3.8,
    rating: 4.7,
    next: "Fri Jun 12, 2:15 PM",
    cost: "20% after deductible",
    network: "In network",
    languages: ["English", "Spanish"],
  },
  {
    id: "p3",
    name: "Mindwell Therapy",
    specialty: "Mental health",
    clinician: "Amara Johnson, LICSW",
    distance: 0.6,
    rating: 4.8,
    next: "Virtual today, 4:30 PM",
    cost: "$35 copay",
    network: "Tier 1 preferred",
    languages: ["English"],
  },
  {
    id: "p4",
    name: "Greenlake Urgent Care",
    specialty: "Urgent care",
    clinician: "Walk-in clinic",
    distance: 2.1,
    rating: 4.5,
    next: "Open until 10 PM",
    cost: "$60 copay",
    network: "In network",
    languages: ["English", "Korean", "Spanish"],
  },
  {
    id: "p5",
    name: "Sound Dermatology",
    specialty: "Dermatology",
    clinician: "Dr. Imani Brooks",
    distance: 5.4,
    rating: 4.6,
    next: "Mon Jun 15, 10:00 AM",
    cost: "20% after deductible",
    network: "In network",
    languages: ["English", "French"],
  },
];

const prescriptions = [
  {
    medication: "Albuterol HFA inhaler",
    member: "Maya",
    nextRefill: "Jun 17",
    pharmacy: "Market Street Pharmacy",
    cost: "$32",
    savings: "Save $18 with CareGuide Mail",
    status: "Refill soon",
  },
  {
    medication: "Atorvastatin 20 mg",
    member: "Noah",
    nextRefill: "Jul 3",
    pharmacy: "CareGuide Mail",
    cost: "$6",
    savings: "Best price selected",
    status: "On track",
  },
  {
    medication: "Cetirizine 10 mg",
    member: "Ellis",
    nextRefill: "As needed",
    pharmacy: "Market Street Pharmacy",
    cost: "$4",
    savings: "OTC eligible with HSA",
    status: "Optional",
  },
];

const authorizationItems = [
  { title: "MRI lumbar spine", provider: "Evergreen Imaging", status: "Approved", detail: "Valid through Jul 31, 2026" },
  { title: "Physical therapy, 8 visits", provider: "Cascade Orthopedics", status: "Review", detail: "Clinical notes requested Jun 6" },
  { title: "GLP-1 medication review", provider: "Harbor Primary Care", status: "Not started", detail: "Ask your PCP to submit prior authorization" },
];

const documents = [
  { name: "Digital member ID card", detail: "Use at appointments or pharmacy pickup", icon: "badge" },
  { name: "2026 Summary of Benefits", detail: "Plan rules, copays, and covered services", icon: "description" },
  { name: "Most recent EOB", detail: "Harbor Primary Care, processed Jun 2", icon: "receipt_long" },
  { name: "Tax forms", detail: "HSA contribution and 1095-B forms", icon: "fact_check" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "coverage", label: "Coverage", icon: "health_and_safety" },
  { id: "care", label: "Find care", icon: "search" },
  { id: "claims", label: "Claims", icon: "receipt_long" },
  { id: "tasks", label: "Tasks", icon: "task_alt" },
  { id: "messages", label: "Messages", icon: "forum" },
];

const specialtyOptions = ["All specialties", ...new Set(providers.map((provider) => provider.specialty))];

function currency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function readCompletedTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("careguide-completed-tasks") ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCompletedTasks(ids) {
  localStorage.setItem("careguide-completed-tasks", JSON.stringify(ids));
}

function getInitialPage() {
  const hashPage = window.location.hash.replace("#", "");
  return navItems.some((item) => item.id === hashPage) ? hashPage : "dashboard";
}

function ProgressBar({ label, value, total, helper }) {
  const percent = Math.min(100, Math.round((value / total) * 100));

  return (
    <div className="careguide-progress">
      <div className="careguide-progress__header">
        <span>{label}</span>
        <strong>{currency(value)} of {currency(total)}</strong>
      </div>
      <div className="careguide-progress__track" aria-label={`${label}: ${percent}% used`}>
        <span style={{ inlineSize: `${percent}%` }} />
      </div>
      <p>{helper}</p>
    </div>
  );
}

function StatCard({ label, value, detail, status, icon }) {
  return (
    <Card className="careguide-stat-card" icon={icon} iconDisplay="default">
      <span className="careguide-kicker">{label}</span>
      <strong>{value}</strong>
      <span>{detail}</span>
      {status && <MessageBadge status={status.kind} subtle>{status.label}</MessageBadge>}
    </Card>
  );
}

function MemberIdCard() {
  return (
    <Card className="careguide-id-card">
      <div className="careguide-id-card__top">
        <div>
          <span className="careguide-kicker">Digital ID card</span>
          <Heading as="h3" size="sm">CareGuide</Heading>
        </div>
        <MessageBadge status="success" subtle>{member.status}</MessageBadge>
      </div>
      <dl>
        <div>
          <dt>Member</dt>
          <dd>{member.name}</dd>
        </div>
        <div>
          <dt>Member ID</dt>
          <dd>{member.memberId}</dd>
        </div>
        <div>
          <dt>Group</dt>
          <dd>{member.group}</dd>
        </div>
        <div>
          <dt>Plan</dt>
          <dd>{member.plan}</dd>
        </div>
      </dl>
      <div className="careguide-id-card__actions">
        <Button variant="secondary" size="sm" icon="download">Download PDF</Button>
        <Button variant="tertiary" size="sm" icon="ios_share">Share</Button>
      </div>
    </Card>
  );
}

function PortalHeader({ activePage, onNavigate, completedCount, openTaskCount }) {
  return (
    <div className="careguide-header">
      <a
        className="careguide-logo"
        href="#dashboard"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("dashboard");
        }}
      >
        <span className="careguide-logo__mark" aria-hidden="true">CG</span>
        <span>
          <strong>CareGuide</strong>
          <small>Member portal</small>
        </span>
      </a>

      <nav className="careguide-nav" aria-label="Primary">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activePage === item.id ? "careguide-nav__link careguide-nav__link--active" : "careguide-nav__link"}
            aria-current={activePage === item.id ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(item.id);
            }}
          >
            <Icon name={item.icon} aria-hidden="true" />
            {item.label}
            {item.id === "tasks" && openTaskCount > 0 ? <span>{openTaskCount}</span> : null}
          </a>
        ))}
      </nav>

      <div className="careguide-header__member" aria-label="Logged in member">
        <div>
          <strong>{member.name}</strong>
          <span>{completedCount} of {initialTasks.length} tasks done</span>
        </div>
        <IconButton icon="account_circle" label="Member profile" />
      </div>
    </div>
  );
}

function DashboardPage({ completedTaskIds, onNavigate, onToggleTask }) {
  const openTasks = initialTasks.filter((task) => !completedTaskIds.includes(task.id));
  const urgentTask = openTasks[0];

  return (
    <>
      <Section className="careguide-hero" padding="lg" contentWidth="2xl" gradient="info" gradientPosition="top-right">
        <Grid columns={{ md: 2 }} gap="xl">
          <div className="careguide-hero__content">
            <MessageBadge status="success" subtle>{member.status} coverage</MessageBadge>
            <Heading as="h1" type="display" size={{ xs: "md", md: "lg" }} textWrap="balance">
              Good evening, Maya. Your coverage is ready when life gets complicated.
            </Heading>
            <Paragraph size="lg" textWrap="balance">
              Review your benefits, compare in-network care, track claims, and complete health-plan tasks from one secure place.
            </Paragraph>
            <div className="careguide-actions">
              <Button icon="search" onClick={() => onNavigate("care")}>Find care near me</Button>
              <Button variant="secondary" icon="receipt_long" onClick={() => onNavigate("claims")}>Review claims</Button>
            </div>
          </div>
          <MemberIdCard />
        </Grid>
      </Section>

      <Section padding="md" contentWidth="2xl">
        <Grid columns={{ md: 3 }} gap="lg">
          <StatCard
            label="Next recommended step"
            value={urgentTask ? urgentTask.title : "All tasks complete"}
            detail={urgentTask ? urgentTask.due : "No open tasks right now"}
            icon="assignment_turned_in"
            status={urgentTask ? { kind: "warn", label: urgentTask.priority } : { kind: "success", label: "Done" }}
          />
          <StatCard
            label="PCP"
            value={member.pcp}
            detail={`${member.pcpPractice} - ${member.pcpPhone}`}
            icon="clinical_notes"
            status={{ kind: "info", label: "In network" }}
          />
          <StatCard
            label="Claims needing review"
            value="1 claim"
            detail="Evergreen Imaging requested an itemized bill"
            icon="priority_high"
            status={{ kind: "warn", label: "Action needed" }}
          />
        </Grid>
      </Section>

      <Section padding="md" surface="panel" contentWidth="2xl">
        <Grid columns={{ lg: 3 }} gap="lg">
          <GridItem span={{ lg: 2 }}>
            <Card className="careguide-card-section">
              <div className="careguide-section-heading">
                <div>
                  <span className="careguide-kicker">Plan usage</span>
                  <Heading as="h2" size="md">Where you stand today</Heading>
                </div>
                <Button variant="tertiary" icon="open_in_new" onClick={() => onNavigate("coverage")}>Full coverage</Button>
              </div>
              <Stack gap="md">
                {planUsage.map((item) => (
                  <ProgressBar key={item.label} {...item} />
                ))}
              </Stack>
            </Card>
          </GridItem>
          <Card className="careguide-card-section">
            <div className="careguide-section-heading">
              <div>
                <span className="careguide-kicker">Open tasks</span>
                <Heading as="h2" size="md">{openTasks.length} things to finish</Heading>
              </div>
            </div>
            <div className="careguide-task-list">
              {openTasks.slice(0, 3).map((task) => (
                <label key={task.id} className="careguide-task-item">
                  <input type="checkbox" checked={false} onChange={() => onToggleTask(task.id)} />
                  <span>
                    <strong>{task.title}</strong>
                    <small>{task.due}</small>
                  </span>
                </label>
              ))}
            </div>
            <Button variant="secondary" icon="task_alt" onClick={() => onNavigate("tasks")}>Manage tasks</Button>
          </Card>
        </Grid>
      </Section>

      <Section padding="md" contentWidth="2xl">
        <Grid columns={{ md: 2, lg: 4 }} gap="lg">
          {benefitCards.map((benefit) => (
            <Card key={benefit.title} icon={benefit.icon} iconDisplay="hero" heroColor="info" className="careguide-benefit-card">
              <MessageBadge status={benefit.status === "Check authorization" ? "warn" : "success"} subtle size="sm">
                {benefit.status}
              </MessageBadge>
              <Heading as="h3" size="xs">{benefit.title}</Heading>
              <strong>{benefit.cost}</strong>
              <Paragraph size="sm" color="muted">{benefit.detail}</Paragraph>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  );
}

function CoveragePage() {
  return (
    <Section padding="lg" contentWidth="2xl" className="careguide-page">
      <div className="careguide-page-title">
        <span className="careguide-kicker">Coverage</span>
        <Heading as="h1" type="display" size="md">Understand your plan before you get care.</Heading>
        <Paragraph size="lg" color="muted">CareGuide explains the rules that affect real appointments, prescriptions, and bills.</Paragraph>
      </div>

      <Grid columns={{ lg: 3 }} gap="lg">
        <GridItem span={{ lg: 2 }}>
          <Card className="careguide-card-section">
            <div className="careguide-section-heading">
              <div>
                <span className="careguide-kicker">Plan snapshot</span>
                <Heading as="h2" size="md">{member.plan}</Heading>
              </div>
              <MessageBadge status="success" subtle>{member.tier}</MessageBadge>
            </div>
            <Grid columns={{ md: 2 }} gap="md" className="careguide-definition-grid">
              <div><span>Effective</span><strong>{member.effectiveDate}</strong></div>
              <div><span>Renews</span><strong>{member.renewalDate}</strong></div>
              <div><span>Network</span><strong>CareGuide Preferred PPO</strong></div>
              <div><span>Referral rules</span><strong>No PCP referral required</strong></div>
            </Grid>
            <div className="careguide-divider" />
            <Stack gap="md">
              {planUsage.map((item) => (
                <ProgressBar key={item.label} {...item} />
              ))}
            </Stack>
          </Card>
        </GridItem>

        <Card className="careguide-card-section">
          <span className="careguide-kicker">Household</span>
          <Heading as="h2" size="md">Covered members</Heading>
          <div className="careguide-member-list">
            {familyMembers.map((person) => (
              <div key={person.name} className="careguide-member-row">
                <span aria-hidden="true">{person.name.split(" ").map((part) => part[0]).join("")}</span>
                <div>
                  <strong>{person.name}</strong>
                  <small>{person.role} - age {person.age}</small>
                  <small>{person.pcp}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <Grid columns={{ md: 3 }} gap="lg">
        {spendingAccounts.map((account) => (
          <Card key={account.label} className="careguide-account-card">
            <span className="careguide-kicker">{account.label}</span>
            <strong>{account.amount}</strong>
            <span>{account.note}</span>
          </Card>
        ))}
      </Grid>

      <Card className="careguide-card-section">
        <div className="careguide-section-heading">
          <div>
            <span className="careguide-kicker">Care rules</span>
            <Heading as="h2" size="md">Authorizations and next steps</Heading>
          </div>
          <Button variant="tertiary" icon="help">Explain prior authorization</Button>
        </div>
        <Grid columns={{ md: 3 }} gap="md">
          {authorizationItems.map((item) => (
            <div key={item.title} className="careguide-auth-card">
              <MessageBadge
                status={item.status === "Approved" ? "success" : item.status === "Review" ? "warn" : "neutral"}
                subtle
              >
                {item.status}
              </MessageBadge>
              <strong>{item.title}</strong>
              <span>{item.provider}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </Grid>
      </Card>
    </Section>
  );
}

function FindCarePage({ favoriteProviders, onToggleFavorite }) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [request, setRequest] = useState(null);

  const filteredProviders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return providers.filter((provider) => {
      const matchesSpecialty = specialty === "All specialties" || provider.specialty === specialty;
      const searchable = [
        provider.name,
        provider.specialty,
        provider.clinician,
        provider.network,
        ...provider.languages,
      ].join(" ").toLowerCase();
      return matchesSpecialty && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, specialty]);

  return (
    <Section padding="lg" contentWidth="2xl" className="careguide-page">
      <div className="careguide-page-title">
        <span className="careguide-kicker">Find care</span>
        <Heading as="h1" type="display" size="md">Compare care by cost, availability, and network.</Heading>
        <Paragraph size="lg" color="muted">Search across in-network providers, urgent care, behavioral health, and virtual options.</Paragraph>
      </div>

      {request && (
        <Banner
          status="success"
          title="Appointment request sent"
          onDismiss={() => setRequest(null)}
          action={<Button variant="tertiary" size="sm">View request</Button>}
        >
          We sent your preferred time to {request}. You will receive a response in Messages.
        </Banner>
      )}

      <Card className="careguide-search-panel">
        <Grid columns={{ md: 3 }} gap="md">
          <GridItem span={{ md: 2 }}>
            <TextField
              label="Search providers, services, or languages"
              hint="Example: therapy, Mandarin, urgent care"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              inputOverlay={<Icon name="search" aria-hidden="true" />}
            />
          </GridItem>
          <SelectField label="Specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
            {specialtyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </SelectField>
        </Grid>
      </Card>

      <Grid columns={{ lg: 3 }} gap="lg">
        <GridItem span={{ lg: 2 }}>
          <Stack gap="md">
            {filteredProviders.map((provider) => {
              const favorite = favoriteProviders.includes(provider.id);
              return (
                <Card key={provider.id} className="careguide-provider-card">
                  <div className="careguide-provider-card__main">
                    <div>
                      <div className="careguide-provider-card__eyebrow">
                        <MessageBadge status={provider.network.includes("Tier 1") ? "success" : "info"} subtle size="sm">
                          {provider.network}
                        </MessageBadge>
                        <span>{provider.distance} mi away</span>
                      </div>
                      <Heading as="h2" size="sm">{provider.name}</Heading>
                      <Paragraph color="muted">{provider.clinician} - {provider.specialty}</Paragraph>
                      <div className="careguide-provider-card__facts">
                        <span><Icon name="star" aria-hidden="true" /> {provider.rating}</span>
                        <span><Icon name="event_available" aria-hidden="true" /> {provider.next}</span>
                        <span><Icon name="payments" aria-hidden="true" /> {provider.cost}</span>
                      </div>
                      <Paragraph size="sm" color="muted">Languages: {provider.languages.join(", ")}</Paragraph>
                    </div>
                    <div className="careguide-provider-card__actions">
                      <IconButton
                        icon={favorite ? "favorite" : "favorite_border"}
                        label={favorite ? "Remove from favorites" : "Save provider"}
                        onClick={() => onToggleFavorite(provider.id)}
                      />
                      <Button size="sm" icon="event" onClick={() => setRequest(provider.name)}>Request visit</Button>
                      <Button variant="secondary" size="sm" icon="call">Call</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </Stack>
        </GridItem>
        <Card className="careguide-card-section careguide-map-card">
          <span className="careguide-kicker">Care guidance</span>
          <Heading as="h2" size="md">Where should I go?</Heading>
          <div className="careguide-route-list">
            <div>
              <Icon name="video_call" aria-hidden="true" />
              <strong>Virtual primary care</strong>
              <span>Best for routine questions, refills, and mild symptoms.</span>
            </div>
            <div>
              <Icon name="local_hospital" aria-hidden="true" />
              <strong>Urgent care</strong>
              <span>Best for same-day needs that are not emergencies.</span>
            </div>
            <div>
              <Icon name="emergency" aria-hidden="true" />
              <strong>Emergency room</strong>
              <span>Use for severe symptoms or life-threatening conditions.</span>
            </div>
          </div>
        </Card>
      </Grid>
    </Section>
  );
}

function ClaimsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClaim, setSelectedClaim] = useState(claims[2]);

  const rows = useMemo(() => {
    return claims
      .filter((claim) => statusFilter === "all" || claim.status === statusFilter)
      .map((claim) => ({
        ...claim,
        billed: claim.billed,
        planPaid: claim.planPaid,
        memberOwes: claim.memberOwes,
        actions: [{ label: "Details", icon: "visibility", onClick: () => setSelectedClaim(claim) }],
      }));
  }, [statusFilter]);

  const columns = [
    { key: "id", label: "Claim", sortable: true },
    { key: "serviceDate", label: "Date", type: "date", sortable: true },
    { key: "provider", label: "Provider", sortable: true },
    { key: "category", label: "Service" },
    { key: "member", label: "Member" },
    {
      key: "status",
      label: "Status",
      type: "badge",
      statusMap: {
        Approved: "success",
        Processing: "info",
        "Needs info": "warn",
        Denied: "error",
      },
    },
    { key: "billed", label: "Billed", type: "currency" },
    { key: "memberOwes", label: "You owe", type: "currency" },
    { key: "actions", label: "Actions", type: "actions" },
  ];

  return (
    <Section padding="lg" contentWidth="2xl" className="careguide-page">
      <div className="careguide-page-title">
        <span className="careguide-kicker">Claims</span>
        <Heading as="h1" type="display" size="md">Track bills from service to payment.</Heading>
        <Paragraph size="lg" color="muted">See what was billed, what CareGuide paid, and what you may owe after discounts.</Paragraph>
      </div>

      <Grid columns={{ lg: 3 }} gap="lg">
        <GridItem span={{ lg: 2 }}>
          <Card className="careguide-card-section">
            <div className="careguide-section-heading">
              <div>
                <span className="careguide-kicker">Recent activity</span>
                <Heading as="h2" size="md">Claims and explanations of benefits</Heading>
              </div>
              <SegmentedControl
                aria-label="Filter claims by status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All" },
                  { value: "Approved", label: "Approved" },
                  { value: "Processing", label: "Processing" },
                  { value: "Needs info", label: "Needs info" },
                ]}
              />
            </div>
            <DataTable
              columns={columns}
              rows={rows}
              density="auto"
              zebra
              scrollable
              caption="Recent CareGuide claims"
              defaultSort={{ key: "serviceDate", direction: "desc" }}
            />
          </Card>
        </GridItem>

        <Card className="careguide-claim-detail">
          <span className="careguide-kicker">Selected claim</span>
          <Heading as="h2" size="md">{selectedClaim.id}</Heading>
          <MessageBadge
            status={selectedClaim.status === "Approved" ? "success" : selectedClaim.status === "Needs info" ? "warn" : "info"}
            subtle
          >
            {selectedClaim.status}
          </MessageBadge>
          <dl>
            <div><dt>Provider</dt><dd>{selectedClaim.provider}</dd></div>
            <div><dt>Service</dt><dd>{selectedClaim.category}</dd></div>
            <div><dt>Billed charges</dt><dd>{currency(selectedClaim.billed)}</dd></div>
            <div><dt>Plan paid</dt><dd>{currency(selectedClaim.planPaid)}</dd></div>
            <div><dt>You may owe</dt><dd>{currency(selectedClaim.memberOwes)}</dd></div>
          </dl>
          {selectedClaim.status === "Needs info" ? (
            <Banner status="warn" title="Action needed">
              Upload the itemized bill to keep this claim moving.
            </Banner>
          ) : (
            <Paragraph color="muted">This claim does not require action right now.</Paragraph>
          )}
          <div className="careguide-actions careguide-actions--stack">
            <Button icon="upload_file">Upload document</Button>
            <Button variant="secondary" icon="download">Download EOB</Button>
          </div>
        </Card>
      </Grid>
    </Section>
  );
}

function TasksPage({ completedTaskIds, onToggleTask }) {
  const completed = initialTasks.filter((task) => completedTaskIds.includes(task.id));
  const open = initialTasks.filter((task) => !completedTaskIds.includes(task.id));

  return (
    <Section padding="lg" contentWidth="2xl" className="careguide-page">
      <div className="careguide-page-title">
        <span className="careguide-kicker">Tasks</span>
        <Heading as="h1" type="display" size="md">Finish the work that keeps coverage moving.</Heading>
        <Paragraph size="lg" color="muted">CareGuide turns claim requests, care reminders, and savings opportunities into clear next steps.</Paragraph>
      </div>

      <Grid columns={{ lg: 3 }} gap="lg">
        <GridItem span={{ lg: 2 }}>
          <Card className="careguide-card-section">
            <div className="careguide-section-heading">
              <div>
                <span className="careguide-kicker">Open</span>
                <Heading as="h2" size="md">{open.length} tasks need attention</Heading>
              </div>
              <MessageBadge status={open.length ? "warn" : "success"} subtle>
                {open.length ? "In progress" : "All clear"}
              </MessageBadge>
            </div>
            <div className="careguide-task-board">
              {initialTasks.map((task) => {
                const done = completedTaskIds.includes(task.id);
                return (
                  <label key={task.id} className={done ? "careguide-task-card careguide-task-card--done" : "careguide-task-card"}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggleTask(task.id)}
                    />
                    <span className="careguide-task-card__content">
                      <span>
                        <strong>{task.title}</strong>
                        <MessageBadge
                          status={task.priority === "High" ? "error" : task.priority === "Medium" ? "warn" : "neutral"}
                          subtle
                          size="sm"
                        >
                          {task.priority}
                        </MessageBadge>
                      </span>
                      <small>{task.due}</small>
                      <p>{task.detail}</p>
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>
        </GridItem>

        <Card className="careguide-card-section">
          <span className="careguide-kicker">Progress</span>
          <Heading as="h2" size="md">{completed.length} completed</Heading>
          <ProgressBar
            label="Task completion"
            value={completed.length}
            total={initialTasks.length}
            helper={`${open.length} open tasks remaining`}
          />
          <div className="careguide-divider" />
          <Heading as="h3" size="xs">Completed recently</Heading>
          {completed.length ? (
            <div className="careguide-completed-list">
              {completed.map((task) => (
                <span key={task.id}><Icon name="check_circle" aria-hidden="true" /> {task.title}</span>
              ))}
            </div>
          ) : (
            <Paragraph color="muted">Completed tasks will appear here.</Paragraph>
          )}
        </Card>
      </Grid>
    </Section>
  );
}

function MessagesPage() {
  const [topic, setTopic] = useState("Claims");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
  }

  return (
    <Section padding="lg" contentWidth="2xl" className="careguide-page">
      <div className="careguide-page-title">
        <span className="careguide-kicker">Messages</span>
        <Heading as="h1" type="display" size="md">Ask a benefits advocate for help.</Heading>
        <Paragraph size="lg" color="muted">Get secure help understanding a bill, finding care, or completing plan paperwork.</Paragraph>
      </div>

      {sent && (
        <Banner status="success" title="Message sent" onDismiss={() => setSent(false)}>
          A CareGuide advocate will respond in your secure inbox within one business day.
        </Banner>
      )}

      <Grid columns={{ lg: 3 }} gap="lg">
        <GridItem span={{ lg: 2 }}>
          <Card className="careguide-card-section">
            <Fieldset legend="New secure message">
              <Paragraph size="sm" color="muted">
                Do not use secure messages for emergencies. Call 911 for urgent or life-threatening symptoms.
              </Paragraph>
              <form className="careguide-message-form" onSubmit={handleSubmit}>
                <SelectField label="What do you need help with?" value={topic} onChange={(event) => setTopic(event.target.value)}>
                  <option>Claims</option>
                  <option>Finding care</option>
                  <option>Coverage question</option>
                  <option>Prescription cost</option>
                  <option>Technical support</option>
                </SelectField>
                <TextareaField
                  label="Message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  rows={6}
                  hint={`Topic: ${topic}. Include dates of service, provider names, or claim IDs when available.`}
                />
                <div className="careguide-actions">
                  <Button type="submit" icon="send">Send secure message</Button>
                  <Button type="button" variant="secondary" icon="attach_file">Attach file</Button>
                </div>
              </form>
            </Fieldset>
          </Card>
        </GridItem>

        <Stack gap="lg">
          <Card className="careguide-card-section">
            <span className="careguide-kicker">Recent threads</span>
            <div className="careguide-thread-list">
              <div>
                <strong>Claim CG-10492 itemized bill</strong>
                <span>Advocate Nora replied 2 hours ago</span>
              </div>
              <div>
                <strong>Therapy network question</strong>
                <span>Resolved Jun 4</span>
              </div>
              <div>
                <strong>HSA eligible receipt</strong>
                <span>Waiting for your document</span>
              </div>
            </div>
          </Card>
          <Card className="careguide-card-section">
            <span className="careguide-kicker">Documents</span>
            <div className="careguide-document-list">
              {documents.map((document) => (
                <Link key={document.name} href="#" icon={document.icon} iconPosition="start">
                  <span>
                    <strong>{document.name}</strong>
                    <small>{document.detail}</small>
                  </span>
                </Link>
              ))}
            </div>
          </Card>
        </Stack>
      </Grid>
    </Section>
  );
}

function PrescriptionsPanel() {
  return (
    <Card className="careguide-card-section">
      <div className="careguide-section-heading">
        <div>
          <span className="careguide-kicker">Pharmacy</span>
          <Heading as="h2" size="md">Prescription watchlist</Heading>
        </div>
        <Button variant="tertiary" icon="local_pharmacy">Manage pharmacy</Button>
      </div>
      <div className="careguide-rx-list">
        {prescriptions.map((rx) => (
          <div key={`${rx.member}-${rx.medication}`} className="careguide-rx-row">
            <div>
              <strong>{rx.medication}</strong>
              <span>{rx.member} - refill {rx.nextRefill} at {rx.pharmacy}</span>
            </div>
            <div>
              <MessageBadge status={rx.status === "Refill soon" ? "warn" : "success"} subtle size="sm">{rx.status}</MessageBadge>
              <strong>{rx.cost}</strong>
              <small>{rx.savings}</small>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function App() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [completedTaskIds, setCompletedTaskIds] = useState(readCompletedTasks);
  const [favoriteProviders, setFavoriteProviders] = useState(["p1", "p3"]);

  const openTaskCount = initialTasks.length - completedTaskIds.length;

  useEffect(() => {
    const onHashChange = () => setActivePage(getInitialPage());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const pageTitle = navItems.find((item) => item.id === activePage)?.label ?? "Dashboard";
    document.title = `${pageTitle} | CareGuide Member Portal`;
  }, [activePage]);

  function navigate(page) {
    setActivePage(page);
    if (window.location.hash !== `#${page}`) window.location.hash = page;
    document.querySelector(".a1-page-layout__main-scroll")?.scrollTo({ top: 0, behavior: "auto" });
  }

  function toggleTask(taskId) {
    setCompletedTaskIds((current) => {
      const next = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];
      saveCompletedTasks(next);
      return next;
    });
  }

  function toggleFavoriteProvider(providerId) {
    setFavoriteProviders((current) =>
      current.includes(providerId)
        ? current.filter((id) => id !== providerId)
        : [...current, providerId]
    );
  }

  const header = (
    <PortalHeader
      activePage={activePage}
      onNavigate={navigate}
      completedCount={completedTaskIds.length}
      openTaskCount={openTaskCount}
    />
  );

  return (
    <PageLayout stickyHeader viewportHeight header={header} className="careguide-shell">
      {activePage === "dashboard" && (
        <>
          <DashboardPage completedTaskIds={completedTaskIds} onNavigate={navigate} onToggleTask={toggleTask} />
          <Section padding="md" contentWidth="2xl">
            <PrescriptionsPanel />
          </Section>
        </>
      )}
      {activePage === "coverage" && <CoveragePage />}
      {activePage === "care" && (
        <FindCarePage favoriteProviders={favoriteProviders} onToggleFavorite={toggleFavoriteProvider} />
      )}
      {activePage === "claims" && <ClaimsPage />}
      {activePage === "tasks" && <TasksPage completedTaskIds={completedTaskIds} onToggleTask={toggleTask} />}
      {activePage === "messages" && <MessagesPage />}
    </PageLayout>
  );
}

createRoot(document.getElementById("root")).render(<App />);
