/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddEntrantInput = {
  slug: Scalars['String']['input'];
};

export type AddTournamentInput = {
  eventIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  slug: Scalars['String']['input'];
};

export type Entrant = {
  __typename?: 'Entrant';
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  tournaments?: Maybe<Array<Maybe<Tournament>>>;
};

export type Event = {
  __typename?: 'Event';
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type GetMatchupBySlugsInput = {
  entrantSlug1: Scalars['String']['input'];
  entrantSlug2: Scalars['String']['input'];
  startAfter?: InputMaybe<Scalars['String']['input']>;
  videogameId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetMatchupInput = {
  entrantId1: Scalars['Int']['input'];
  entrantId2: Scalars['Int']['input'];
  startAfter?: InputMaybe<Scalars['String']['input']>;
  videogameId?: InputMaybe<Scalars['Int']['input']>;
};

export type GetMatchupSpreadInput = {
  entrantSlugs: Array<Scalars['String']['input']>;
};

export type Matchup = {
  __typename?: 'Matchup';
  entrant1?: Maybe<Entrant>;
  entrant2?: Maybe<Entrant>;
  score1?: Maybe<Scalars['Int']['output']>;
  score2?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEntrant?: Maybe<Entrant>;
  addTournament?: Maybe<Tournament>;
};


export type MutationAddEntrantArgs = {
  input: AddEntrantInput;
};


export type MutationAddTournamentArgs = {
  input: AddTournamentInput;
};

export type Query = {
  __typename?: 'Query';
  fetchStartGGTournament?: Maybe<Tournament>;
  fetchStartGGUser?: Maybe<Entrant>;
  getEntrants?: Maybe<Array<Maybe<Entrant>>>;
  getMatchup?: Maybe<Matchup>;
  getMatchupBySlugs?: Maybe<Matchup>;
  getMatchupSpread?: Maybe<Array<Maybe<Matchup>>>;
  getTournaments?: Maybe<Array<Maybe<Tournament>>>;
  getVideogames?: Maybe<Array<Maybe<Videogame>>>;
};


export type QueryFetchStartGgTournamentArgs = {
  slug: Scalars['String']['input'];
};


export type QueryFetchStartGgUserArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetMatchupArgs = {
  input: GetMatchupInput;
};


export type QueryGetMatchupBySlugsArgs = {
  input?: InputMaybe<GetMatchupBySlugsInput>;
};


export type QueryGetMatchupSpreadArgs = {
  input: GetMatchupSpreadInput;
};

export type Tournament = {
  __typename?: 'Tournament';
  events?: Maybe<Array<Maybe<Event>>>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  startAt?: Maybe<Scalars['String']['output']>;
};

export type Videogame = {
  __typename?: 'Videogame';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AddEntrantMutationVariables = Exact<{
  input: AddEntrantInput;
}>;


export type AddEntrantMutation = { __typename?: 'Mutation', addEntrant?: { __typename?: 'Entrant', id: number } | null };

export type AddTournamentMutationVariables = Exact<{
  input: AddTournamentInput;
}>;


export type AddTournamentMutation = { __typename?: 'Mutation', addTournament?: { __typename?: 'Tournament', id: number } | null };

export type FetchStartGgTournamentQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type FetchStartGgTournamentQuery = { __typename?: 'Query', fetchStartGGTournament?: { __typename?: 'Tournament', id: number, name: string, slug: string, image?: string | null, startAt?: string | null, events?: Array<{ __typename?: 'Event', id: number, name: string, image?: string | null } | null> | null } | null };

export type FetchStartGgUserQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type FetchStartGgUserQuery = { __typename?: 'Query', fetchStartGGUser?: { __typename?: 'Entrant', id: number, name: string, slug: string, image?: string | null, tournaments?: Array<{ __typename?: 'Tournament', id: number, name: string, slug: string } | null> | null } | null };

export type GetEntrantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntrantsQuery = { __typename?: 'Query', getEntrants?: Array<{ __typename?: 'Entrant', id: number, name: string, image?: string | null, slug: string } | null> | null };

export type GetMatchupBySlugsQueryVariables = Exact<{
  input: GetMatchupBySlugsInput;
}>;


export type GetMatchupBySlugsQuery = { __typename?: 'Query', getMatchupBySlugs?: { __typename?: 'Matchup', score1?: number | null, score2?: number | null } | null };

export type GetMatchupSpreadQueryVariables = Exact<{
  input: GetMatchupSpreadInput;
}>;


export type GetMatchupSpreadQuery = { __typename?: 'Query', getMatchupSpread?: Array<{ __typename?: 'Matchup', score1?: number | null, score2?: number | null, entrant1?: { __typename?: 'Entrant', id: number, name: string } | null, entrant2?: { __typename?: 'Entrant', id: number, name: string } | null } | null> | null };

export type GetMatchupQueryVariables = Exact<{
  input: GetMatchupInput;
}>;


export type GetMatchupQuery = { __typename?: 'Query', getMatchup?: { __typename?: 'Matchup', score1?: number | null, score2?: number | null } | null };

export type GetTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTournamentsQuery = { __typename?: 'Query', getTournaments?: Array<{ __typename?: 'Tournament', id: number, slug: string, name: string, image?: string | null } | null> | null };

export type GetVideogamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVideogamesQuery = { __typename?: 'Query', getVideogames?: Array<{ __typename?: 'Videogame', id: number, name: string } | null> | null };


export const AddEntrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddEntrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddEntrantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addEntrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddEntrantMutation, AddEntrantMutationVariables>;
export const AddTournamentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddTournament"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddTournamentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTournament"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddTournamentMutation, AddTournamentMutationVariables>;
export const FetchStartGgTournamentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchStartGGTournament"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchStartGGTournament"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<FetchStartGgTournamentQuery, FetchStartGgTournamentQueryVariables>;
export const FetchStartGgUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchStartGGUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchStartGGUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tournaments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<FetchStartGgUserQuery, FetchStartGgUserQueryVariables>;
export const GetEntrantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntrants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEntrants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetEntrantsQuery, GetEntrantsQueryVariables>;
export const GetMatchupBySlugsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMatchupBySlugs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMatchupBySlugsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMatchupBySlugs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score1"}},{"kind":"Field","name":{"kind":"Name","value":"score2"}}]}}]}}]} as unknown as DocumentNode<GetMatchupBySlugsQuery, GetMatchupBySlugsQueryVariables>;
export const GetMatchupSpreadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMatchupSpread"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMatchupSpreadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMatchupSpread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entrant1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entrant2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"score1"}},{"kind":"Field","name":{"kind":"Name","value":"score2"}}]}}]}}]} as unknown as DocumentNode<GetMatchupSpreadQuery, GetMatchupSpreadQueryVariables>;
export const GetMatchupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMatchup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMatchupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMatchup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score1"}},{"kind":"Field","name":{"kind":"Name","value":"score2"}}]}}]}}]} as unknown as DocumentNode<GetMatchupQuery, GetMatchupQueryVariables>;
export const GetTournamentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTournaments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTournaments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<GetTournamentsQuery, GetTournamentsQueryVariables>;
export const GetVideogamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVideogames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVideogames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetVideogamesQuery, GetVideogamesQueryVariables>;