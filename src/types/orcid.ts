declare module OrcidPerson {

  export interface ValueObject {
      value: number | string
  }  

  export interface OrcidIdentifier {
      uri: string;
      path: string;
      host: string;
  }

  export interface History {
      "creation-method": string;
      "completion-date"?: any;
      "submission-date": ValueObject;
      "last-modified-date": ValueObject;
      claimed: boolean;
      source?: any;
      "deactivation-date"?: any;
      "verified-email": boolean;
      "verified-primary-email": boolean;
  }

  export interface CreatedDate {
      value: number;
  }

  export interface GivenNames {
      value: string;
  }

  export interface FamilyName {
      value: string;
  }

  export interface Name {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      "given-names": GivenNames;
      "family-name": FamilyName;
      "credit-name"?: any;
      source?: any;
      visibility: string;
      path: string;
  }

  export interface SourceOrcid {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName {
      value: string;
  }

  export interface Source {
      "source-orcid": SourceOrcid;
      "source-client-id"?: any;
      "source-name": SourceName;
  }

  export interface OtherName {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      source: Source;
      content: string;
      visibility: string;
      path: string;
      "put-code": number;
      "display-index": number;
  }

  export interface OtherNames {
      "last-modified-date": ValueObject;
      "other-name": OtherName[];
      path: string;
  }

  export interface Biography {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      content: string;
      visibility: string;
      path: string;
  }


  export interface SourceOrcid2 {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName2 {
      value: string;
  }

  export interface Source2 {
      "source-orcid": SourceOrcid2;
      "source-client-id"?: any;
      "source-name": SourceName2;
  }

  export interface Url {
      value: string;
  }

  export interface ResearcherUrl {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      source: Source2;
      "url-name": string;
      url: Url;
      visibility: string;
      path: string;
      "put-code": number;
      "display-index": number;
  }

  export interface ResearcherUrls {
      "last-modified-date": ValueObject;
      "researcher-url": ResearcherUrl[];
      path: string;
  }

  export interface Emails {
      "last-modified-date"?: any;
      email: any[];
      path: string;
  }

  export interface SourceOrcid3 {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName3 {
      value: string;
  }

  export interface Source3 {
      "source-orcid": SourceOrcid3;
      "source-client-id"?: any;
      "source-name": SourceName3;
  }

  export interface Country {
      value: string;
  }

  export interface Address {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      source: Source3;
      country: Country;
      visibility: string;
      path: string;
      "put-code": number;
      "display-index": number;
  }

  export interface Addresses {
      "last-modified-date": ValueObject;
      address: Address[];
      path: string;
  }


  export interface SourceOrcid4 {
      uri: string;
      path: string;
      host: string;
  }

  export interface Source4 {
      "source-orcid": SourceOrcid4;
      "source-client-id"?: any;
      "source-name": SourceName;
  }

  export interface Keyword {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      source: Source4;
      content: string;
      visibility: string;
      path: string;
      "put-code": number;
      "display-index": number;
  }

  export interface Keywords {
      "last-modified-date": ValueObject;
      "keyword": Keyword[];
      path: string;
  }

  export interface ExternalIdentifiers {
      "last-modified-date"?: any;
      "external-identifier": any[];
      path: string;
  }

  export interface Person {
      "last-modified-date": ValueObject;
      name: Name;
      "other-names": OtherNames;
      biography: Biography;
      "researcher-urls": ResearcherUrls;
      emails: Emails;
      addresses: Addresses;
      keywords: Keywords;
      "external-identifiers": ExternalIdentifiers;
      path: string;
  }

  export interface SourceOrcid5 {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName5 {
      value: string;
  }

  export interface Source5 {
      "source-orcid": SourceOrcid5;
      "source-client-id"?: any;
      "source-name": SourceName5;
  }

  export interface Year {
      value: string;
  }

  export interface Month {
      value: string;
  }

  export interface Day {
      value: string;
  }

  export interface StartDate {
      year: Year;
      month: Month;
      day: Day;
  }

  export interface Year2 {
      value: string;
  }

  export interface Month2 {
      value: string;
  }

  export interface Day2 {
      value: string;
  }

  export interface EndDate {
      year: Year2;
      month: Month2;
      day: Day2;
  }

  export interface Address2 {
      city: string;
      region: string;
      country: string;
  }

  export interface DisambiguatedOrganization {
      "disambiguated-organization-identifier": string;
      "disambiguation-source": string;
  }

  export interface Organization {
      name: string;
      address: Address2;
      "disambiguated-organization": DisambiguatedOrganization;
  }

  export interface EducationSummary {
      "created-date": CreatedDate;
      "last-modified-date": ValueObject;
      source: Source5;
      "department-name": string;
      "role-title": string;
      "start-date": StartDate;
      "end-date": EndDate;
      organization: Organization;
      visibility: string;
      "put-code": number;
      path: string;
  }

  export interface Educations {
      "last-modified-date": ValueObject;
      "education-summary": EducationSummary[];
      path: string;
  }

  export interface LastModifiedDate16 {
      value: number;
  }

  export interface CreatedDate8 {
      value: any;
  }

  export interface LastModifiedDate17 {
      value: any;
  }

  export interface SourceOrcid6 {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName6 {
      value: string;
  }

  export interface Source6 {
      "source-orcid": SourceOrcid6;
      "source-client-id"?: any;
      "source-name": SourceName6;
  }

  export interface Year3 {
      value: string;
  }

  export interface Month3 {
      value: string;
  }

  export interface StartDate2 {
      year: Year3;
      month: Month3;
      day?: any;
  }

  export interface Year4 {
      value: string;
  }

  export interface Month4 {
      value: string;
  }

  export interface EndDate2 {
      year: Year4;
      month: Month4;
      day?: any;
  }

  export interface Address3 {
      city: string;
      region: string;
      country: string;
  }

  export interface DisambiguatedOrganization2 {
      "disambiguated-organization-identifier": string;
      "disambiguation-source": string;
  }

  export interface Organization2 {
      name: string;
      address: Address3;
      "disambiguated-organization": DisambiguatedOrganization2;
  }

  export interface EmploymentSummary {
      "created-date": CreatedDate8;
      "last-modified-date": LastModifiedDate17;
      source: Source6;
      "department-name": string;
      "role-title": string;
      "start-date": StartDate2;
      "end-date": EndDate2;
      organization: Organization2;
      visibility: string;
      "put-code": number;
      path: string;
  }

  export interface Employments {
      "last-modified-date": LastModifiedDate16;
      "employment-summary": EmploymentSummary[];
      path: string;
  }

  export interface Fundings {
      "last-modified-date"?: any;
      group: any[];
      path: string;
  }

  export interface PeerReviews {
      "last-modified-date"?: any;
      group: any[];
      path: string;
  }

  export interface LastModifiedDate18 {
      value: number;
  }

  export interface LastModifiedDate19 {
      value: any;
  }

  export interface ExternalIdUrl {
      value: string;
  }

  export interface ExternalId {
      "external-id-type": string;
      "external-id-value": string;
      "external-id-url": ExternalIdUrl;
      "external-id-relationship": string;
  }

  export interface ExternalIds {
      "external-id": ExternalId[];
  }

  export interface CreatedDate9 {
      value: any;
  }

  export interface LastModifiedDate20 {
      value: any;
  }

  export interface SourceOrcid7 {
      uri: string;
      path: string;
      host: string;
  }

  export interface SourceName7 {
      value: string;
  }

  export interface Source7 {
      "source-orcid": SourceOrcid7;
      "source-client-id"?: any;
      "source-name": SourceName7;
  }

  export interface Title2 {
      value: string;
  }

  export interface Title {
      title: Title2;
      subtitle?: any;
      "translated-title"?: any;
  }

  export interface ExternalIdUrl2 {
      value: string;
  }

  export interface ExternalId2 {
      "external-id-type": string;
      "external-id-value": string;
      "external-id-url": ExternalIdUrl2;
      "external-id-relationship": string;
  }

  export interface ExternalIds2 {
      "external-id": ExternalId2[];
  }

  export interface Year5 {
      value: string;
  }

  export interface Month5 {
      value: string;
  }

  export interface Day3 {
      value: string;
  }

  export interface PublicationDate {
      year: Year5;
      month: Month5;
      day: Day3;
      "media-type"?: any;
  }

  export interface WorkSummary {
      "put-code": number;
      "created-date": CreatedDate9;
      "last-modified-date": LastModifiedDate20;
      source: Source7;
      title: Title;
      "external-ids": ExternalIds2;
      type: string;
      "publication-date": PublicationDate;
      visibility: string;
      path: string;
      "display-index": string;
  }

  export interface Group {
      "last-modified-date": LastModifiedDate19;
      "external-ids": ExternalIds;
      "work-summary": WorkSummary[];
  }

  export interface Works {
      "last-modified-date": LastModifiedDate18;
      group: Group[];
      path: string;
  }

  export interface ActivitiesSummary {
      "last-modified-date": LastModifiedDate;
      educations: Educations;
      employments: Employments;
      fundings: Fundings;
      "peer-reviews": PeerReviews;
      works: Works;
      path: string;
  }

  export interface RootObject {
      "orcid-identifier": OrcidIdentifier;
      preferences: Preferences;
      history: History;
      person: Person;
      "activities-summary": ActivitiesSummary;
      path: string;
  }

}

