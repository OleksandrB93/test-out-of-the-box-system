import { CrewMemberProps } from "@/hooks/use-crew-animation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const truncateContent = (content: string, maxLength: number = 300) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

// Group crew by department and show key roles
export const keyDepartments = [
  "Directing",
  "Production",
  "Writing",
  "Camera",
  "Sound",
  "Art",
];

export const groupCrewByDepartment = (crew: CrewMemberProps[]) => {
  return crew.reduce(
    (acc: Record<string, CrewMemberProps[]>, member: CrewMemberProps) => {
      if (!acc[member.department]) {
        acc[member.department] = [];
      }
      acc[member.department].push(member);
      return acc;
    },
    {}
  );
};

export const sortDepartmentsByImportance = (departments: string[]) => {
  return departments.sort((a, b) => {
    const aIndex = keyDepartments.indexOf(a);
    const bIndex = keyDepartments.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};
