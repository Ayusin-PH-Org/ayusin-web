import type mongoose from "mongoose";
import { Report } from "@/db";

export async function generateMockReports(count = 50) {
	const reports = [];

	for (let i = 0; i < count; i++) {
		// Random chance for description to be null/undefined
		const hasDescription = Math.random() > 0.2;

		// Random chance for dateClosed (30% chance it's closed)
		const isClosed = Math.random() > 0.7;
		const dateClosed = isClosed
			? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
			: undefined;

		const reportData = {
			version: Math.floor(Math.random() * 5) + 1,
			title: randomChoice(titles),
			description: hasDescription ? randomChoice(descriptions) : undefined,
			labels: randomChoices(labelOptions, 1, 4),
			location: randomCoordinates(),
			logs: [], // Empty for now, would need ReportLog ObjectIds
			upvotes: 0,
			downvotes: 0,
			metadata: {
				mediaLinks: randomChoices(mediaLinks, 0, 3),
				scope: randomChoice([...scopes]),
				category: randomChoice(categories),
				report_status: randomChoice([...statuses]),
				dateClosed,
				assignedDepartmentIDs: [], // Empty for now, would need Department ObjectIds
				assignedPersonnelIDs: [], // Empty for now, would need User ObjectIds
			},
		};

		reports.push(reportData);
	}

	try {
		const createdReports = await Report.insertMany(reports);
		console.log(`Successfully created ${createdReports.length} mock reports`);
		return createdReports;
	} catch (error) {
		console.error("Error creating mock reports:", error);
		throw error;
	}
}

export async function generateMockReportsOneByOne(count = 50) {
	const createdReports: mongoose.HydratedDocument<Report>[] = [];

	for (let i = 0; i < count; i++) {
		try {
			const hasDescription = Math.random() > 0.2;
			const isClosed = Math.random() > 0.7;
			const dateClosed = isClosed
				? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
				: undefined;

			const report = new Report({
				version: Math.floor(Math.random() * 5) + 1,
				title: randomChoice(titles),
				description: hasDescription ? randomChoice(descriptions) : undefined,
				labels: randomChoices(labelOptions, 1, 4),
				location: randomCoordinates(),
				logs: [],
				upvotes: 0,
				downvotes: 0,
				metadata: {
					mediaLinks: randomChoices(mediaLinks, 0, 3),
					scope: randomChoice([...scopes]),
					category: randomChoice(categories),
					dateClosed,
					report_status: randomChoice([...statuses]),
					assignedDepartmentIDs: [],
					assignedPersonnelIDs: [],
				},
			});

			const savedReport = await report.save();
			createdReports.push(savedReport);

			if ((i + 1) % 10 === 0) {
				console.log(`Created ${i + 1}/${count} reports...`);
			}
		} catch (error) {
			console.error(`Error creating report ${i + 1}:`, error);
		}
	}

	console.log(`Successfully created ${createdReports.length} mock reports`);
	return createdReports;
}

// Helper function to clean up all mock reports
export async function clearAllReports(): Promise<void> {
	try {
		const result = await Report.deleteMany({});
		console.log(`Deleted ${result.deletedCount} reports`);
	} catch (error) {
		console.error("Error clearing reports:", error);
		throw error;
	}
}

// Sample data arrays
const titles = [
	"Road Damage on Main Street",
	"Illegal Parking Near School",
	"Broken Streetlight",
	"Pothole on Highway",
	"Traffic Light Malfunction",
	"Garbage Collection Issue",
	"Water Pipe Leak",
	"Sidewalk Obstruction",
	"Noise Complaint",
	"Public Safety Concern",
	"Bridge Structural Issue",
	"Flooding in Residential Area",
	"Power Outage Report",
	"Internet Connectivity Problem",
	"Bus Stop Vandalism",
];

const descriptions = [
	"Urgent repair needed for public safety",
	"Multiple complaints from residents",
	"Affecting daily commute and traffic flow",
	"Requires immediate attention from authorities",
	"Safety hazard for pedestrians and vehicles",
	"Community members requesting swift action",
	"Infrastructure maintenance required",
	"Environmental concern raised by citizens",
	"Public health implications noted",
	"Economic impact on local businesses",
];

const labelOptions = [
	"urgent",
	"infrastructure",
	"traffic",
	"safety",
	"maintenance",
	"public-health",
	"environment",
	"utilities",
	"transportation",
	"emergency",
	"community",
	"accessibility",
	"compliance",
];

const scopes = [
	"Barangay",
	"City",
	"Province",
	"Regional",
	"National",
] as const;

const categories = [
	"Infrastructure",
	"Traffic",
	"Public Safety",
	"Environment",
	"Health",
	"Utilities",
	"Transportation",
	"Public Services",
	"Emergency Services",
	"Community Development",
];

const mediaLinks = [
	"https://example.com/image1.jpg",
	"https://example.com/image2.jpg",
	"https://example.com/video1.mp4",
	"https://example.com/document1.pdf",
	"https://example.com/photo_evidence.png",
	"https://example.com/site_survey.pdf",
];

const statuses = [
	"NEW",
	"TRIAGED",
	"IN_PROGRESS",
	"RESOLVED",
	"REJECTED",
] as const;

// Helper function to generate random coordinates (Philippines bounds)
function randomCoordinates() {
	return {
		type: "Point" as const,
		coordinates: [
			// Longitude: 116.0 to 126.6 (Philippines)
			116.0 + Math.random() * 10.6,
			// Latitude: 4.6 to 21.1 (Philippines)
			4.6 + Math.random() * 16.5,
		],
	};
}

// Helper function to get random array element
function randomChoice<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to get random number of array elements
function randomChoices<T>(arr: T[], min = 1, max = 3): T[] {
	const count = Math.floor(Math.random() * (max - min + 1)) + min;
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}
