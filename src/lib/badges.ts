import type { Badge, CourseSummary, Group } from "./types";

/** A group is "limited" when this many seats (or fewer) remain. */
export const LIMITED_SEATS_THRESHOLD = 3;
/** A course "starts soon" when its next group starts within this many days. */
export const STARTING_SOON_DAYS = 14;

const DAY = 86_400_000;

export function upcomingGroups(groups: Group[], now = Date.now()) {
  return groups
    .filter((g) => new Date(g.startDate).getTime() + DAY > now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function openGroups(groups: Group[], now = Date.now()) {
  return upcomingGroups(groups, now).filter((g) => g.seatsLeft > 0);
}

/** Minimum seats left across open groups (undefined if no groups — e.g. recorded only). */
export function minSeatsLeft(course: Pick<CourseSummary, "groups">, now = Date.now()) {
  const open = openGroups(course.groups, now);
  if (!open.length) return undefined;
  return Math.min(...open.map((g) => g.seatsLeft));
}

/**
 * Manual badges (new/bestseller) + computed ones:
 *  - "full": every live group is full and there is no recorded option
 *  - "limited": an open group has ≤ LIMITED_SEATS_THRESHOLD seats
 *  - "starting-soon": the next open group starts within STARTING_SOON_DAYS
 */
export function computeBadges(course: CourseSummary, now = Date.now()): Badge[] {
  const badges: Badge[] = [...course.manualBadges];
  const live = course.groups.length > 0;
  const open = openGroups(course.groups, now);
  if (live && open.length === 0 && !course.modes.includes("recorded")) {
    badges.push("full");
    return badges;
  }
  const min = minSeatsLeft(course, now);
  if (min !== undefined && min <= LIMITED_SEATS_THRESHOLD) badges.push("limited");
  const next = open[0];
  if (next && new Date(next.startDate).getTime() - now < STARTING_SOON_DAYS * DAY) badges.push("starting-soon");
  return badges;
}
