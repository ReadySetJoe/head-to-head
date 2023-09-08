import gql from 'graphql-tag';

gql`
  query PrintMessage($message: String!) {
    printMessage(message: $message)
  }
`;
