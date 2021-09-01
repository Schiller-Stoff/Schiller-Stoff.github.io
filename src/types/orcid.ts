export declare module Orcid {

  interface VersionAble {
    "created-date": ValueObject;
    "last-modified-date": ValueObject;
  }

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

  export interface Name extends VersionAble {
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

  export interface OtherName extends VersionAble {
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

  export interface Biography extends VersionAble {
      content: string;
      visibility: string;
      path: string;
  }

  export interface ResearcherUrl extends VersionAble {
      source: Source;
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

  export interface Address extends VersionAble {
      source: Source;
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

  export interface Keyword extends VersionAble {
      source: Source;
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

  export interface Date {
      year: ValueObject;
      month: ValueObject;
      day: ValueObject;
  }

  export interface DisambiguatedOrganization {
      "disambiguated-organization-identifier": string;
      "disambiguation-source": string;
  }

  export interface Organization {
      name: string;
      address: Address;
      "disambiguated-organization": DisambiguatedOrganization;
  }

  export interface EducationSummary extends VersionAble {
      source: Source;
      "department-name": string;
      "role-title": string;
      "start-date": Date;
      "end-date": Date;
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

  export interface EmploymentSummary extends VersionAble {
      source: Source;
      "department-name": string;
      "role-title": string;
      "start-date": Date;
      "end-date": Date;
      organization: Organization;
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

  export interface Title {
      title: ValueObject;
      subtitle?: any;
      "translated-title"?: any;
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
      source: Source;
      title: Title;
      "external-ids": ExternalIds;
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

