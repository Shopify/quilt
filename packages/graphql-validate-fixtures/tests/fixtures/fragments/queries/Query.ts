import {gql} from "@apollo/client";

export const Query = gql`
    query My {
        name
        metadata {
            ...metadataDataFragment
        }
    }
    
    fragment metadataDataFragment on MetaData {
        affiliations {
            ...AffiliationsDataFragment
        }
    }

    fragment AffiliationsDataFragment on Affiliate {
        ...PersonFragment
        ...CompanyFragment
    }

    fragment PersonFragment on Person {
        name
        provider {
            ...MedicalFragment
        }
        address {
            ... on City {
                city
            }
            ... on State {
                state
            }
        }
    }

    fragment CompanyFragment on Company {
        name
        stockTicker
    }
    
    fragment MedicalFragment on MedicalProvider {
        name
    }

`
