import { makeRule } from "./_factory";

const mountText: Array<[string, string, string, string]> = [
  ["jupiter", "Leadership and ambition", "Guru parvat balwan ho to gaurav, netritva aur unnat ichha badhti hai.", "Strong Jupiter supports ambition, leadership, mentorship and principled growth."],
  ["saturn", "Discipline and maturity", "Shani parvat santulit ho to dhairya, zimmedari aur anubhav ka yog hota hai.", "Saturn supports discipline, patience, duty and seriousness."],
  ["sun", "Creativity and recognition", "Surya parvat balwan ho to kala, pratishtha aur lokpriyata ka sanket milta hai.", "Sun/Apollo supports creativity, visibility and recognition."],
  ["mercury", "Communication and business", "Budh parvat vyapar, vani aur buddhi se sambandhit hai.", "Mercury supports communication, commerce and negotiation."],
  ["venus", "Vitality and warmth", "Shukra parvat urja, prem, ras aur jeevan shakti ka pramukh sanket hai.", "Venus supports vitality, affection and relational warmth."],
  ["moon", "Imagination and movement", "Chandra parvat kalpana, yatra, sapne aur antar drishti ko darshata hai.", "Moon supports imagination, travel, intuition and inner life."],
  ["mars", "Courage and resilience", "Mangal kshetra sahas, sangharsh shakti aur raksha pravritti ka sanket hai.", "Mars supports courage, stamina and boundary strength."],
];

export const MOUNT_RULES = mountText.flatMap(([mount, title, classical, scientific]) => [
  makeRule({ id: `mount_${mount}_strong`, title: `${title} strong`, category: "mounts", path: `mounts.${mount}.prominence`, value: "strong", sourceIds: ["SAMUDRIK_SHASTRA", "DAYANAND_SECRETS"], classical, scientific, luxury: `${title} is amplified in your palm map. This becomes a premium strength when used with discipline and timing.`, confidenceBase: 70 }),
  makeRule({ id: `mount_${mount}_weak`, title: `${title} needs cultivation`, category: "mounts", path: `mounts.${mount}.prominence`, value: "weak", sourceIds: ["SAMUDRIK_SHASTRA", "DAYANAND_SECRETS"], classical: `${classical} Yahan kamjori ho to is tattva ko sadhana aur acharan se santulit karna chahiye.`, scientific: `${scientific} A weak reading means this trait needs deliberate practice rather than fear.`, luxury: `${title} is quieter in this scan. The growth path is to train this trait through daily behavior, not superstition.`, confidenceBase: 61, severity: "growth" }),
]);
