"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from '@apollo/client';
import { Cell, Column, ColumnHeaderCell, Table2 } from "@blueprintjs/table";
import './style.css'
import { gql } from 'graphql-tag';

// Apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const getColumnsFromTableName = (tableName: string): string[] => {
  const [columns, setColumns] = useState<string[]>([]);

  const GET_TABLE_COLUMNS = gql`
    query {
      getTableColumns(tableName: "${tableName}")
    }
  `;

  const { loading, error, data } = useQuery(GET_TABLE_COLUMNS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });
  console.log(data);

  useEffect(() => {
    if (!loading && !error && data && Array.isArray(data.getTableColumns)) {
      setColumns(data.getTableColumns);
    }
  }, [loading, error, data]);

  if (loading) {
    console.log("Loading ...");
  }

  if (error) {
    console.error("GraphQL error: ", error.graphQLErrors);
    console.error("Network error: ", error.networkError);
  }

  return columns;
};

const fetchDataByColumns = (cols: string[]): any => {
  if (cols.length === 0) {
    return { loading: true, error: null, data: null };
  }

  const query = gql`
    query {
      getExampleRecords {
        ${cols.join("\n")}
      }
    }`;

  return useQuery(query);
};

const ExampleTableView: React.FC = () => {
  const tableName: string = "titanic_table";
  const columns: string[] = getColumnsFromTableName(tableName);
  
  // const { loading, error, data } = fetchDataByColumns(columns);

  // if (loading) {
  //   return <div>Loading data...</div>;
  // }

  // if (error) {
  //   return <div>Error loading data: {error.message}</div>;
  // }

  console.log(columns);
  return (
    <div>{columns.length > 0 ? columns.join(", ") : "No columns available"}</div>
  );
};


const Tables: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1 className="text-center text-xl font-bold mb-4">Blueprint.js Table Example</h1>
        <ExampleTableView />
      </div>

    </ApolloProvider >
  );
}

export default Tables;
