/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation AddEntrant($input: AddEntrantInput!) {\n  addEntrant(input: $input) {\n    id\n  }\n}": types.AddEntrantDocument,
    "mutation AddTournament($input: AddTournamentInput!) {\n  addTournament(input: $input) {\n    id\n  }\n}": types.AddTournamentDocument,
    "query FetchStartGGTournament($slug: String!) {\n  fetchStartGGTournament(slug: $slug) {\n    id\n    name\n    slug\n    image\n    startAt\n    events {\n      id\n      name\n      image\n    }\n  }\n}": types.FetchStartGgTournamentDocument,
    "query FetchStartGGUser($slug: String!) {\n  fetchStartGGUser(slug: $slug) {\n    id\n    name\n    slug\n    image\n    tournaments {\n      id\n      name\n      slug\n    }\n  }\n}": types.FetchStartGgUserDocument,
    "query GetEntrants {\n  getEntrants {\n    id\n    name\n    image\n  }\n}": types.GetEntrantsDocument,
    "query GetMatchup($input: GetMatchupInput!) {\n  getMatchup(input: $input) {\n    score1\n    score2\n  }\n}": types.GetMatchupDocument,
    "query GetTournaments {\n  getTournaments {\n    id\n    slug\n    name\n    image\n  }\n}": types.GetTournamentsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddEntrant($input: AddEntrantInput!) {\n  addEntrant(input: $input) {\n    id\n  }\n}"): (typeof documents)["mutation AddEntrant($input: AddEntrantInput!) {\n  addEntrant(input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddTournament($input: AddTournamentInput!) {\n  addTournament(input: $input) {\n    id\n  }\n}"): (typeof documents)["mutation AddTournament($input: AddTournamentInput!) {\n  addTournament(input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchStartGGTournament($slug: String!) {\n  fetchStartGGTournament(slug: $slug) {\n    id\n    name\n    slug\n    image\n    startAt\n    events {\n      id\n      name\n      image\n    }\n  }\n}"): (typeof documents)["query FetchStartGGTournament($slug: String!) {\n  fetchStartGGTournament(slug: $slug) {\n    id\n    name\n    slug\n    image\n    startAt\n    events {\n      id\n      name\n      image\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchStartGGUser($slug: String!) {\n  fetchStartGGUser(slug: $slug) {\n    id\n    name\n    slug\n    image\n    tournaments {\n      id\n      name\n      slug\n    }\n  }\n}"): (typeof documents)["query FetchStartGGUser($slug: String!) {\n  fetchStartGGUser(slug: $slug) {\n    id\n    name\n    slug\n    image\n    tournaments {\n      id\n      name\n      slug\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEntrants {\n  getEntrants {\n    id\n    name\n    image\n  }\n}"): (typeof documents)["query GetEntrants {\n  getEntrants {\n    id\n    name\n    image\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetMatchup($input: GetMatchupInput!) {\n  getMatchup(input: $input) {\n    score1\n    score2\n  }\n}"): (typeof documents)["query GetMatchup($input: GetMatchupInput!) {\n  getMatchup(input: $input) {\n    score1\n    score2\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTournaments {\n  getTournaments {\n    id\n    slug\n    name\n    image\n  }\n}"): (typeof documents)["query GetTournaments {\n  getTournaments {\n    id\n    slug\n    name\n    image\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;