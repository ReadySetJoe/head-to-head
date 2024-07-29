import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type GetMatchupInput = {
  entrantId1?: InputMaybe<Scalars['Int']['input']>;
  entrantId2?: InputMaybe<Scalars['Int']['input']>;
  eventIds?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  getTournaments?: Maybe<Array<Maybe<Tournament>>>;
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

export type Tournament = {
  __typename?: 'Tournament';
  events?: Maybe<Array<Maybe<Event>>>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  startAt?: Maybe<Scalars['String']['output']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddEntrantInput: AddEntrantInput;
  AddTournamentInput: AddTournamentInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Entrant: ResolverTypeWrapper<Entrant>;
  Event: ResolverTypeWrapper<Event>;
  GetMatchupInput: GetMatchupInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Matchup: ResolverTypeWrapper<Matchup>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tournament: ResolverTypeWrapper<Tournament>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddEntrantInput: AddEntrantInput;
  AddTournamentInput: AddTournamentInput;
  Boolean: Scalars['Boolean']['output'];
  Entrant: Entrant;
  Event: Event;
  GetMatchupInput: GetMatchupInput;
  Int: Scalars['Int']['output'];
  Matchup: Matchup;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Tournament: Tournament;
}>;

export type EntrantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entrant'] = ResolversParentTypes['Entrant']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tournaments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tournament']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MatchupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Matchup'] = ResolversParentTypes['Matchup']> = ResolversObject<{
  entrant1?: Resolver<Maybe<ResolversTypes['Entrant']>, ParentType, ContextType>;
  entrant2?: Resolver<Maybe<ResolversTypes['Entrant']>, ParentType, ContextType>;
  score1?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  score2?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addEntrant?: Resolver<Maybe<ResolversTypes['Entrant']>, ParentType, ContextType, RequireFields<MutationAddEntrantArgs, 'input'>>;
  addTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<MutationAddTournamentArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  fetchStartGGTournament?: Resolver<Maybe<ResolversTypes['Tournament']>, ParentType, ContextType, RequireFields<QueryFetchStartGgTournamentArgs, 'slug'>>;
  fetchStartGGUser?: Resolver<Maybe<ResolversTypes['Entrant']>, ParentType, ContextType, RequireFields<QueryFetchStartGgUserArgs, 'slug'>>;
  getEntrants?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entrant']>>>, ParentType, ContextType>;
  getMatchup?: Resolver<Maybe<ResolversTypes['Matchup']>, ParentType, ContextType, RequireFields<QueryGetMatchupArgs, 'input'>>;
  getTournaments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tournament']>>>, ParentType, ContextType>;
}>;

export type TournamentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tournament'] = ResolversParentTypes['Tournament']> = ResolversObject<{
  events?: Resolver<Maybe<Array<Maybe<ResolversTypes['Event']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Entrant?: EntrantResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  Matchup?: MatchupResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tournament?: TournamentResolvers<ContextType>;
}>;

