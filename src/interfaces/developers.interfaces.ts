interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

type TDeveloperRequest = Omit<IDeveloper, "id">;

interface IDeveloperInfo {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId?: number;
}

type TDeveloperInfoRequest = Omit<IDeveloperInfo, "id">;

interface IDeveloperList {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

export {
  IDeveloper,
  TDeveloperRequest,
  IDeveloperInfo,
  TDeveloperInfoRequest,
  IDeveloperList,
};
