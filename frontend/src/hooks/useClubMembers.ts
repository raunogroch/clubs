import { useState, useEffect } from "react";
import groupsService from "../services/groups.service";
import clubsService from "../services/clubs.service";

type ClubMembers = Record<string, { athletes: number; coaches: number }>;

export const useClubMembers = () => {
  const [clubMembers, setClubMembers] = useState<ClubMembers>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMembers = async () => {
      try {
        const clubsData = await clubsService.getAll();
        const maxRetries = 5;

        for (let attempt = 1; attempt <= maxRetries && mounted; attempt++) {
          const results = await Promise.allSettled(
            clubsData.map((c) => groupsService.getByClub(c._id)),
          );

          if (results.every((r) => r.status === "fulfilled")) {
            const membersData: ClubMembers = {};

            clubsData.forEach((club, i) => {
              const clubGroups =
                (results[i] as PromiseFulfilledResult<any>).value || [];
              const athleteIds = new Set<string>();
              const coachIds = new Set<string>();

              clubGroups.forEach((g: any) => {
                if (Array.isArray(g.athletes)) {
                  g.athletes.forEach((a: any) => {
                    if (a) athleteIds.add(String(a));
                  });
                }

                if (Array.isArray(g.athletes_added)) {
                  g.athletes_added.forEach((entry: any) => {
                    const id =
                      typeof entry?.athlete_id === "string"
                        ? entry.athlete_id
                        : entry?.athlete_id?._id;
                    if (id) athleteIds.add(String(id));
                  });
                }

                if (Array.isArray(g.coaches)) {
                  g.coaches.forEach((c: any) => {
                    if (!c) return;
                    coachIds.add(typeof c === "string" ? c : String(c._id));
                  });
                }

                if (Array.isArray(g.members)) {
                  g.members.forEach((m: any) => {
                    if (m) {
                      coachIds.add(String(m));
                      athleteIds.add(String(m));
                    }
                  });
                }
              });

              membersData[club._id] = {
                athletes: athleteIds.size,
                coaches: coachIds.size,
              };
            });

            if (mounted) {
              setClubMembers(membersData);
              setLoading(false);
            }
            break;
          }

          const delayMs = 1000 * Math.pow(2, attempt - 1);
          await new Promise((res) => setTimeout(res, delayMs));
        }
      } catch (error) {
        if (mounted) {
          setClubMembers({});
          setLoading(false);
        }
      }
    };

    loadMembers();
    return () => {
      mounted = false;
    };
  }, []);

  return { clubMembers, loading };
};
