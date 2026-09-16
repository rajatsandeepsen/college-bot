export const domain = "sjcetpalai.ac.in";
export const name = "St. Joseph's College of Engineering and Technology, Palai";

export const categories = {
	tech: {
		name: "Technology",
		icon: "💻",
	},
	art: {
		name: "Arts & Culture",
		icon: "🎨",
	},
	sports: {
		name: "Sports",
		icon: "⚽",
	},
	academic: {
		name: "Academic",
		icon: "📚",
	},
	social: {
		name: "Social",
		icon: "🎉",
	},
} as const;

export const eventTypes = {
	competition: {
		name: "Competition",
		icon: "🏆",
	},
	workshop: {
		name: "Workshop",
		icon: "🛠️",
	},
	seminar: {
		name: "Seminar / Talk",
		icon: "🎤",
	},
	hackathon: {
		name: "Hackathon",
		icon: "👨‍💻",
	},
	fest: {
		name: "Fest",
		icon: "🎪",
	},
} as const;

export const departments = {
	ai: "Artificial Intelligence & Data Science",
	ad: "Artificial Intelligence & Data Science",
	ec: "Electronics & Communication Engineering",
	cs: "Computer Science & Engineering",
	cy: "Computer Science & Engineering (Cyber Security)",
	cc: "Computer Science & Engineering (Cyber Security)",
	ca: "Computer Science & Engineering (Artificial Intelligence)",
	ct: "Computer Science & Engineering (Artificial Intelligence)",
	ecs: "Electronics & Computer Engineering",
	er: "Electronics & Computer Engineering",
	ee: "Electrical & Electronics Engineering",
	ce: "Civil Engineering",
	me: "Mechanical Engineering",
	mca: "Master of Computer Applications",
	mba: "Master of Business Administration",
	es: "Electronics & Computer Science",
	ei: "Electronic & Instrumentation",
} as const;

export const clubs = {
	nss: {
		name: "National Service Scheme",
		icon: "🫶",
	},
	ncc: {
		name: "National Cadet Corps",
		icon: "🪖",
	},
	iedc: {
		name: "Innovation and Entrepreneurship Development Centre",
		icon: "💡",
	},
	mulearn: {
		name: "MuLearn",
		icon: "📖",
	},
	ieee: {
		name: "Institute of Electrical and Electronics Engineers",
		icon: "🔌",
	},
	foss: {
		name: "Free and Open Source Software",
		icon: "🍀",
	},
	gdsc: {
		name: "Google Developer Student Clubs",
		icon: "🤖",
	},
	tinkerhub: {
		name: "TinkerHub",
		icon: "🛠️",
	},
	csi: {
		name: "Computer Society of India",
		icon: "💾",
	},
} as const;

export const categoryKeys = Object.keys(categories);
export const typeKeys = Object.keys(eventTypes);
export const clubKeys = Object.keys(clubs);
export const departmentKeys = Object.keys(departments);
