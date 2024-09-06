import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
    students {
      id
      roll_no
      name
      classSection
      mark
    }
  }
`;

export const ADD_NEW_ROW = gql`
  mutation AddNewRow(
    $roll_no: String!
    $name: String!
    $classSection: String!
    $mark: String!
  ) {
    addNewRow(
      roll_no: $roll_no
      name: $name
      classSection: $classSection
      mark: $mark
    ) {
      id
      roll_no
      name
      classSection
      mark
    }
  }
`;

export const UPDATE_ROW = gql`
  mutation UpdateRow(
    $id: ID!
    $roll_no: String
    $name: String
    $classSection: String
    $mark: String
  ) {
    updateRow(
      id: $id
      roll_no: $roll_no
      name: $name
      classSection: $classSection
      mark: $mark
    ) {
      id
      roll_no
      name
      classSection
      mark
    }
  }
`;

export const DELETE_ROW = gql`
  mutation DeleteRow($id: ID!) {
    deleteRow(id: $id) {
      message
    }
  }
`;
