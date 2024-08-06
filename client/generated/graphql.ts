/* eslint-disable */
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

export type ChildTable = {
  __typename?: 'ChildTable';
  col1: Scalars['String']['output'];
  col2: Scalars['String']['output'];
  col3: Scalars['Int']['output'];
  col4: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
};

export type CreateTableInput = {
  col1: Scalars['String']['input'];
  col2: Scalars['String']['input'];
  col3: Scalars['Int']['input'];
  col4: Scalars['Float']['input'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  createTable: ChildTable;
};


export type MutationRootCreateTableArgs = {
  input: CreateTableInput;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  answer: Scalars['Int']['output'];
};
