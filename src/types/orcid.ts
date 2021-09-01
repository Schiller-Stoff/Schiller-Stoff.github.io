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

  export interface Name {
      "created-date": ValueObject;
      "last-modified-date": ValueObject;
      "given-names": ValueObject;
      "family-name": ValueObject;
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


  export interface Source {
      "source-orcid": SourceOrcid;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface OtherName {
      "created-date": ValueObject;
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
      "created-date": ValueObject;
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

  export interface Source2 {
      "source-orcid": SourceOrcid2;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface ResearcherUrl {
      "created-date": ValueObject;
      "last-modified-date": ValueObject;
      source: Source2;
      "url-name": string;
      url: ValueObject;
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

  export interface Source3 {
      "source-orcid": SourceOrcid3;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface Address {
      "created-date": ValueObject;
      "last-modified-date": ValueObject;
      source: Source3;
      country: ValueObject;
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
      "source-name": ValueObject;
  }

  export interface Keyword {
      "created-date": ValueObject;
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

  export interface Source5 {
      "source-orcid": SourceOrcid5;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface StartDate {
      year: ValueObject;
      month: ValueObject;
      day: ValueObject;
  }

  export interface EndDate {
      year: ValueObject;
      month: ValueObject;
      day: ValueObject;
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
      "created-date": ValueObject;
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

  export interface SourceOrcid6 {
      uri: string;
      path: string;
      host: string;
  }


  export interface Source6 {
      "source-orcid": SourceOrcid6;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface StartDate2 {
      year: ValueObject;
      month: ValueObject;
      day?: any;
  }

  export interface EndDate2 {
      year: ValueObject;
      month: ValueObject;
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
      "created-date": ValueObject;
      "last-modified-date": ValueObject;
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
      "last-modified-date": ValueObject;
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

  export interface ExternalId {
      "external-id-type": string;
      "external-id-value": string;
      "external-id-url": ValueObject;
      "external-id-relationship": string;
  }

  export interface ExternalIds {
      "external-id": ExternalId[];
  }

  export interface SourceOrcid7 {
      uri: string;
      path: string;
      host: string;
  }

  export interface Source7 {
      "source-orcid": SourceOrcid7;
      "source-client-id"?: any;
      "source-name": ValueObject;
  }

  export interface Title {
      title: ValueObject;
      subtitle?: any;
      "translated-title"?: any;
  }

  export interface ExternalId2 {
      "external-id-type": string;
      "external-id-value": string;
      "external-id-url": ValueObject;
      "external-id-relationship": string;
  }

  export interface ExternalIds2 {
      "external-id": ExternalId2[];
  }

  export interface PublicationDate {
      year: ValueObject;
      month: ValueObject;
      day: ValueObject;
      "media-type"?: any;
  }

  export interface WorkSummary {
      "put-code": number;
      "created-date": ValueObject;
      "last-modified-date": ValueObject;
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
      "last-modified-date": ValueObject;
      "external-ids": ExternalIds;
      "work-summary": WorkSummary[];
  }

  export interface Works {
      "last-modified-date": ValueObject;
      group: Group[];
      path: string;
  }

  export interface ActivitiesSummary {
      "last-modified-date": ValueObject;
      educations: Educations;
      employments: Employments;
      fundings: Fundings;
      "peer-reviews": PeerReviews;
      works: Works;
      path: string;
  }

  export interface RootObject {
      "orcid-identifier": OrcidIdentifier;
      preferences: ValueObject;
      history: History;
      person: Person;
      "activities-summary": ActivitiesSummary;
      path: string;
  }

}

